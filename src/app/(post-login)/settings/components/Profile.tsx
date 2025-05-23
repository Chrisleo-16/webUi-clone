"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CheckCircle, Loader2, User } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormDataState {
  username: string;
  phoneNumber: string;
  countryCode: string;
  bio: string;
  notification: string;
  profileImage: File | null | string;
}

interface FormErrors {
  username?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
}

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = await TokenService.getToken();
  const { data } = await axios.post(
    "https://api.xmobit.com/api/v1/file/server/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.file_url;
};

const updatePhone = async (payload: {
  country_code: string;
  phone: string;
}) => {
  const token = await TokenService.getToken();
  const { data } = await AxiosInstance.post(
    `${baseUrl}/auth/save/phone`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

const updateField = async (endpoint: string, key: string, value: any) => {
  const token = await TokenService.getToken();
  const payload = { [key]: value };
  const { data } = await AxiosInstance.post(
    `${baseUrl}/auth${endpoint}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const ProfileContent = ({ myDetails: data }: any) => {
  const [formData, setFormData] = useState<FormDataState>({
    username: "",
    phoneNumber: "",
    countryCode: "+1",
    bio: "",
    notification: "sound",
    profileImage: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error: any) => {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Failed to upload image",
      }));
      setIsUploading(false);
    },
  });

  const profileMutation = useMutation({
    mutationFn: (imageUrl: string | undefined) => {
      const requests = [
        imageUrl
          ? updateField(
              "/update/profileUrl",
              "imageUrl",
              "https://resources.xmobit.com/" + imageUrl
            )
          : Promise.resolve(),
        updatePhone({
          country_code: formData.countryCode,
          phone: formData.phoneNumber,
        }),
        updateField("/update/bio", "bio", formData.bio),
      ];
      return Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDetails"] });
      setFeedback("Profile Update Successfully");
      setIsUploading(false);
    },
    onError: (error: any) => {
      setErrors(error);
      setIsUploading(false);
    },
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        username: data.username,
        countryCode: data.country_code,
        phoneNumber: data.phone_number,
        profileImage: data.profile_pic_url,
        bio: data.user_bio,
      }));
    }
  }, [data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!/^[0-9]+$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    if (formData.bio && formData.bio.length > 325)
      newErrors.bio = "Biography exceeds the character limit";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);

    try {
      if (formData.profileImage instanceof File) {
        const imageUrl = await uploadMutation.mutateAsync(
          formData.profileImage
        );
        await profileMutation.mutateAsync(imageUrl);
      } else {
        await profileMutation.mutateAsync(undefined);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
        <p className="text-sm text-gray-500 mb-6">
          Please update your profile settings here
        </p>
        {feedback && (
          <Alert className={"bg-green-50 border-green-200 mb-4"}>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Profile Updated Succcessfully</AlertDescription>
          </Alert>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              {formData.profileImage ? (
                typeof formData.profileImage === "string" ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <Input
                type="file"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            {errors.profileImage && (
              <p className="text-red-500 text-sm">{errors.profileImage}</p>
            )}
          </div>
          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Charles"
              disabled
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label>Your Local Phone Number</Label>
            <div className="flex gap-2">
              <Select
                name="countryCode"
                defaultValue="+1"
                onValueChange={(value) =>
                  handleSelectChange("countryCode", value)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{formData.countryCode}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+254">+254</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>
          <div className="space-y-4">
            <Label>Notifications</Label>
            <RadioGroup defaultValue="sound">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="font-normal">
                  <div>Email Notification</div>
                  <span className="text-sm text-gray-500">
                    You will be notified when a new email arrives.
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sound" id="sound" />
                <Label htmlFor="sound" className="font-normal">
                  <div>Sound Notification</div>
                  <span className="text-sm text-gray-500">
                    You will be notified with sound when someone messages you.
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="bg-green-600 text-white hover:text-black"
              disabled={
                isUploading ||
                profileMutation.isPending ||
                uploadMutation.isPending
              }
            >
              {isUploading ||
              profileMutation.isPending ||
              uploadMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}{" "}
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
