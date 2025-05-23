"use client";

import { useState } from "react";
import { QrCode, Shield, Key, Smartphone, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";

// Types
interface UserSettings {
  is2faenabled: boolean;
  question: string
}

interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
}

interface SecurityQuestionData {
  securityQuestion: string;
  securityAnswer: string;
}

interface TwoFAData {
  is2faenabled: boolean;
  authCode?: string;
}

type MutationData =
  | { passwords: PasswordUpdateData }
  | { securityQuestion: string; securityAnswer: string }
  | { is2faenabled: boolean; authCode?: string };

interface FeedbackState {
  type: string;
  message: string;
  section: string;
}

// API Functions
const fetchMyDetails = async (): Promise<UserSettings> => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.get(`${baseUrl}/auth/my-details`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data.data;
};
const generateQr = async () => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.get(`${baseUrl}/auth/generateSecret`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const updatePassword = async (data: PasswordUpdateData): Promise<any> => {
  const token = await TokenService.getToken();
  const res = await AxiosInstance.post(`${baseUrl}/auth/reset/new/password`, { token, newPassword: data.newPassword }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const toggle2FA = async (data: TwoFAData): Promise<any> => {
  const token = await TokenService.getToken();
  const res = await AxiosInstance.post(`${baseUrl}/auth/verify2fa/token`, { token: data.authCode }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  let returned;

  if (res.data.verified) {
    returned = await AxiosInstance.get(`${baseUrl}/auth/2fa/activate`, {
      headers: { Authorization: `Bearer ${token}` }
    });

  }
  return returned?.data
};

const saveSecurityQuestion = async (data: SecurityQuestionData): Promise<any> => {
  const token = await TokenService.getToken();
  const res = await AxiosInstance.post(`${baseUrl}/auth/set/question`, { question: data.securityQuestion, answer: data.securityAnswer }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export default function Security() {
  const queryClient = useQueryClient();
  const [showBackupCodes, setShowBackupCodes] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>("");
  const [securityQuestion, setSecurityQuestion] = useState<string>("What's your first pet's name?");
  const [securityAnswer, setSecurityAnswer] = useState<string>("");
  const [passwords, setPasswords] = useState<{ current: string; new: string; confirm: string }>({
    current: "",
    new: "",
    confirm: ""
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [securityQuestionError, setSecurityQuestionError] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "", message: "", section: "" });
  const [enable2fa, setEnable2fa] = useState(false)

  // Fetch user settings
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: fetchMyDetails
  });

  const { data: qr, isLoading: loadingQr } = useQuery({
    queryKey: ['qrUrl'],
    queryFn: generateQr
  });

  // Create mutation for updating settings
  const mutation = useMutation({
    mutationFn: (data: MutationData) => {
      if ('passwords' in data) {
        return updatePassword(data.passwords);
      } else if ('securityQuestion' in data) {
        return saveSecurityQuestion(data);
      } else if ('is2faenabled' in data) {
        return toggle2FA(data);
      }
      return Promise.reject("Invalid mutation data");
    },
    onSuccess: (data, variables) => {
      if ('passwords' in variables) {
        setFeedback({
          type: "success",
          message: "Password updated successfully!",
          section: "password"
        });
        setPasswords({ current: "", new: "", confirm: "" });
        setPasswordError("");
      } else if ('securityQuestion' in variables) {
        setFeedback({
          type: "success",
          message: "Security question saved successfully!",
          section: "security-question"
        });
        setSecurityQuestionError("");
      } else if ('is2faenabled' in variables) {
        setFeedback({
          type: "success",
          message: variables.is2faenabled ? "2FA enabled successfully!" : "2FA disabled successfully!",
          section: "2fa"
        });
        setAuthCode("");
      }
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error: any, variables) => {
      if ('passwords' in variables) {
        setPasswordError(error.response?.data?.message || "Failed to update password");
        setFeedback({
          type: "error",
          message: error.response?.data?.message || "Failed to update password",
          section: "password"
        });
      } else if ('securityQuestion' in variables) {
        setSecurityQuestionError(error.response?.data?.message || "Failed to save security question");
        setFeedback({
          type: "error",
          message: error.response?.data?.message || "Failed to save security question",
          section: "security-question"
        });
      } else if ('is2faenabled' in variables) {
        setFeedback({
          type: "error",
          message: error.response?.data?.message || "Failed to update 2FA settings",
          section: "2fa"
        });
      }
    }
  });

  // Handler functions
  const handleUpdatePassword = (): void => {
    setPasswordError("");

    if (!passwords.current) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwords.new) {
      setPasswordError("New password is required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    mutation.mutate({
      passwords: {
        oldPassword: passwords.current,
        newPassword: passwords.new
      }
    });
  };

  const handleSaveSecurityQuestion = (): void => {
    setSecurityQuestionError("");

    if (!securityAnswer) {
      setSecurityQuestionError("Security answer is required");
      return;
    }

    mutation.mutate({
      securityQuestion,
      securityAnswer
    });
  };

  const handle2FAToggle = (): void => {
    if (!settings) return;

    if (settings.is2faenabled) {
      // Disable 2FA
      mutation.mutate({
        is2faenabled: false
      });
    } else {
      // Enable 2FA
      if (authCode.length !== 6 || !/^\d+$/.test(authCode)) {
        setFeedback({
          type: "error",
          message: "Please enter a valid 6-digit authentication code",
          section: "2fa"
        });
        return;
      }

      mutation.mutate({
        is2faenabled: true,
        authCode
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 2FA Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!enable2fa && !isLoading && !settings?.is2faenabled &&
            <Button
              className="bg-green-600 text-white hover:text-black"
              variant="secondary"
              onClick={() => setEnable2fa(true)}
            >
              Enable 2AF
            </Button>
          }

          {!isLoading && enable2fa && (
            <div className="flex items-start gap-4">
              <div className="border p-4 rounded-lg bg-gray-50">
                {loadingQr && <p className="w-32 h-32 bg-gray-300 animate-pulse"></p>}
                {
                  !loadingQr && <img className='rounded w-32 h-32 object-contain text-black' src={qr.qrcode} alt="QR Code" />
                }
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label>Enter Authentication Code</Label>
                  <Input
                    type="number"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-green-600 text-white hover:text-black"
                  variant="secondary"
                  onClick={handle2FAToggle}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && 'is2faenabled' in (mutation.variables as any || {}) ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Veryfying...</>
                  ) : <>Verify Code</>}
                </Button>
              </div>
            </div>
          )}
          {settings?.is2faenabled && (
            <Alert className="bg-green-50 border-green-200 p-4">
              <Smartphone className="h-4 w-4" />
              <AlertTitle>2FA is Enabled</AlertTitle>
              <AlertDescription>
                Your account is currently protected with two-factor authentication.
              </AlertDescription>
            </Alert>
          )}

          {feedback.section === "2fa" && (
            <Alert variant={feedback.type === "error" ? "destructive" : "default"} className={feedback.type === "success" ? "bg-green-50 border-green-200" : ""}>
              {feedback.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
              <AlertTitle>{feedback.type === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Security Question
          </CardTitle>
          { }
        </CardHeader>
        {settings?.question &&
          <Alert className="bg-green-50 border-green-200 p-4">
            <Smartphone className="h-4 w-4" />
            <AlertTitle>Question is set</AlertTitle>
            <AlertDescription>
              The security question has already been set up.
            </AlertDescription>
          </Alert>
        }
        {!settings?.question &&
          <CardContent className="space-y-4">
            <Label>Select a Security Question</Label>
            <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
              <SelectTrigger>
                <SelectValue placeholder="Select a question" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="What's your first pet's name?">What's your first pet's name?</SelectItem>
                <SelectItem value="What's your mother's maiden name?">What's your mother's maiden name?</SelectItem>
                <SelectItem value="What's your favorite book?">What's your favorite book?</SelectItem>
              </SelectContent>
            </Select>
            <Label>Your Answer</Label>
            <Input
              type="password"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className={securityQuestionError ? "border-red-500" : ""}
            />
            {securityQuestionError && (
              <p className="text-red-500 text-sm">{securityQuestionError}</p>
            )}
            <Button
              className="bg-green-600 text-white hover:text-black"
              onClick={handleSaveSecurityQuestion}
              disabled={mutation.isPending && 'securityQuestion' in (mutation.variables as any || {})}
            >
              {mutation.isPending && 'securityQuestion' in (mutation.variables as any || {}) ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Security Question"
              )}
            </Button>

            {feedback.section === "security-question" && (
              <Alert variant={feedback.type === "error" ? "destructive" : "default"} className={feedback.type === "success" ? "bg-green-50 border-green-200 mt-4" : "mt-4"}>
                {feedback.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                <AlertTitle>{feedback.type === "error" ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        }
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Current Password</Label>
          <Input
            type="password"
            placeholder="Enter your current password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className={passwordError ? "border-red-500" : ""}
          />
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter your new password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className={passwordError ? "border-red-500" : ""}
          />
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            placeholder="Confirm your new password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className={passwordError ? "border-red-500" : ""}
          />
          {passwordError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          <Button
            className="bg-green-600 text-white hover:text-black"
            onClick={handleUpdatePassword}
            disabled={mutation.isPending && 'passwords' in (mutation.variables as any || {})}
          >
            {mutation.isPending && 'passwords' in (mutation.variables as any || {}) ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              "Update Password"
            )}
          </Button>

          {feedback.section === "password" && (
            <Alert variant={feedback.type === "error" ? "destructive" : "default"} className={feedback.type === "success" ? "bg-green-50 border-green-200 mt-4" : "mt-4"}>
              {feedback.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
              <AlertTitle>{feedback.type === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}