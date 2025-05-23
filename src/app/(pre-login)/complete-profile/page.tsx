"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Avatar,
  ButtonProps,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import XmobInput from "@/components/inputs/xmobitInput";
import ErrorAlert from "@/components/ui/ErrorAlert";
import SuccessAlert from "@/components/ui/SuccessAlert";
import AuthApiService from "@/helpers/Api/authentication/Auth.service";

interface UiResponse {
  message: string;
  messageType: "success" | "error";
}

const steps = ["Personal Information", "Phone Verification"];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSkipping, setIsSkipping] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    otp: "",
    bio: "",
    profileImage: "",
    imageFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 2) {
      setError("Image size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }

    // Show image preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://api.xmobit.com/api/v1/file/server/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const imageUrl = `https://resources.xmobit.com/${data.file_url}`;

      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      await AuthApiService.updateProfileImage(imageUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError("Error uploading image. " + error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      setError("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await AuthApiService.sendPhoneOTP(formData.phone);
      setOtpSent(true);
      setSuccessMessage("Verification code sent successfully to your phone");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");
    setSuccessMessage("");

    try {
      await AuthApiService.sendPhoneOTP(formData.phone);
      setSuccessMessage("Verification code resent successfully");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await AuthApiService.verifyPhoneOTP(formData.phone, formData.otp);
      await AuthApiService.savePhoneNumber(formData.phone);
      await handleUpdateProfile();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await AuthApiService.updateBio(formData.bio);

      if (formData.imageFile) {
        // const imageUrl = await uploadImage(formData.imageFile);
        // await AuthApiService.updateProfileImage(imageUrl);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.fullName) {
        setError("Please fill in your full name");
        return;
      }
      setActiveStep(1);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    setError("");

    try {
      // If user entered any data, we can still save it
      if (formData.bio) {
        await AuthApiService.updateBio(formData.bio);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
      setIsSkipping(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar
                src={imagePreview || formData.profileImage}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                  bgcolor: "#E8F5F0",
                  color: "#00BF63",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={handleImageClick}
              >
                {isUploadingImage ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <AddAPhotoIcon />
                )}
              </Avatar>
              <p className="text-sm text-gray-500">
                {isUploadingImage
                  ? "Uploading..."
                  : "Click to add profile photo"}
              </p>
            </div>

            <XmobInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="bg-[#E8F5F0]"
            />
            <XmobInput
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              multiline
              rows={3}
              className="bg-[#E8F5F0]"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={isLoading || isUploadingImage || isSkipping}
              sx={
                {
                  backgroundColor: "#00BF63",
                  "&:hover": { backgroundColor: "#00A857" },
                  textTransform: "none",
                  height: "3rem",
                } as any
              }
            >
              {isUploadingImage || isSkipping ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Next"
              )}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={handleSkip}
              disabled={isLoading || isUploadingImage || isSkipping}
              sx={{
                color: "#888",
                textTransform: "none",
                "&:hover": { backgroundColor: "transparent", color: "#555" },
              }}
            >
              {isSkipping ? "Skipping..." : "Skip for now"}
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <XmobInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="bg-[#E8F5F0]"
              type="text"
            />
            {otpSent ? (
              <>
                <XmobInput
                  label="Verification Code"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter verification code"
                  required
                  className="bg-[#E8F5F0]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The verification code might be sent to your WhatsApp or via
                  SMS
                </p>
                <div className="flex flex-col space-y-2">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || isSkipping}
                    sx={{
                      backgroundColor: "#00BF63",
                      "&:hover": { backgroundColor: "#00A857" },
                      textTransform: "none",
                      height: "3rem",
                    }}
                  >
                    {isLoading || isSkipping ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                  <div className="flex justify-between">
                    <Button
                      variant="text"
                      onClick={handleResendOTP}
                      disabled={isResending || isSkipping}
                      sx={{
                        color: "#00BF63",
                        textTransform: "none",
                      }}
                    >
                      {isResending ? "Resending..." : "Resend Code"}
                    </Button>
                    <Button
                      variant="text"
                      onClick={handleSkip}
                      disabled={isLoading || isSkipping}
                      sx={{
                        color: "#888",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#555",
                        },
                      }}
                    >
                      {isSkipping ? "Skipping..." : "Skip for now"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSendOTP}
                  disabled={isLoading || isSkipping}
                  sx={{
                    backgroundColor: "#00BF63",
                    "&:hover": { backgroundColor: "#00A857" },
                    textTransform: "none",
                    height: "3rem",
                  }}
                >
                  {isLoading || isSkipping ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Code"
                  )}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleSkip}
                  disabled={isLoading || isSkipping}
                  sx={{
                    color: "#888",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#555",
                    },
                  }}
                >
                  {isSkipping ? "Skipping..." : "Skip for now"}
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  The verification code will be sent to your WhatsApp or via SMS
                </p>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide your information to continue
          </p>
        </div>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <ErrorAlert error={error || null} onClose={() => setError("")} />
        <SuccessAlert
          message={successMessage || null}
          onClose={() => setSuccessMessage("")}
        />

        {renderStepContent()}
      </div>
    </motion.div>
  );
}
