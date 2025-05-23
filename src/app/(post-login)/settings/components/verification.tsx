"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
}

interface VerificationResponse {
  success: boolean;
  message?: string;
}


export default function Verification({ myDetails }: any) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Camera setup effect
  // useEffect(() => {
  //   // Flag to prevent async operations after component unmount
  //   let isMounted = true;

  //   const startCamera = async () => {
  //     try {
  //       // Request camera access with specific constraints for better compatibility
  //       const mediaStream = await navigator.mediaDevices.getUserMedia({
  //         video: {
  //           width: { ideal: 1280 },
  //           height: { ideal: 720 },
  //           facingMode: "user"
  //         },
  //         audio: false
  //       });

  //       if (isMounted) {
  //         setStream(mediaStream);

  //         // Ensure the video element is ready before setting the stream
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = mediaStream;

  //           // Handle potential issues with autoplay
  //           const playPromise = videoRef.current.play();
  //           if (playPromise !== undefined) {
  //             playPromise.catch(error => {
  //               console.error("Error playing video:", error);
  //             });
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error accessing camera:", error);
  //     }
  //   };

  //   // Start the camera
  //   startCamera();

  //   // Cleanup function
  //   return () => {
  //     isMounted = false;
  //     if (stream) {
  //       stream.getTracks().forEach((track) => track.stop());
  //     }
  //   };
  // }, []);

  // Capture image from video
  const captureImage = (): string | null => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return null;

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      const context = canvas.getContext("2d");
      if (!context) return null;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Error capturing image:", error);
      return null;
    }
  };

  // React Query mutation
  const verifyMutation = useMutation<VerificationResponse, Error, any>({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      alert("Verification successful!");
    },
    onError: (error) => {
      alert(`Verification failed: ${error.message}`);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Capture image if not already captured
    const imageData = capturedImage || captureImage();

    if (!imageData) {
      alert("Please capture your photo first");
      return;
    }

    const idDocumentsData = files.map(file => {
      return {
        name: file.name,
        type: file.type,
        size: file.size
      };
    });

    const submissionData = {
      ...formData,
      image: imageData,
      idDocuments: idDocumentsData,
    };

    verifyMutation.mutate(submissionData);
  };

  return (
    <div className="">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Identity Verification</CardTitle>
          {
            myDetails.isVerified && (
              <Alert className="bg-green-50 border-green-200 p-4">
                {/* <Smartphone className="h-4 w-4" /> */}
                <AlertTitle>Identity Verified</AlertTitle>
                <AlertDescription>
                  Your account is already verified.
                </AlertDescription>
              </Alert>
            )

          }
          <CardDescription>
            Please provide your personal details and take a photo for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Personal Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Morty"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* ID Upload */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium mb-2">ID Document</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Click to upload the front and back of your ID
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </Button>

                    {files.length > 0 && (
                      <div className="mt-4 text-sm text-left">
                        <p className="font-medium">{files.length} file(s) selected</p>
                        <ul className="list-disc pl-5 mt-2">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Camera Interface */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Photo Verification</h3>
                <div className="border-2 border-dashed rounded-lg p-4 text-center h-full flex flex-col">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden flex-1 min-h-60">
                    {/* Video element for camera feed */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Hidden canvas for image capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Show captured image when available */}
                    {capturedImage && (
                      <div className="absolute inset-0 bg-white">
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {!stream && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
                        <div className="text-center">
                          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Awaiting camera access...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 my-4">
                    {stream && !capturedImage ? "Position your face within the frame" :
                      capturedImage ? "Photo captured" : "Camera setup in progress"}
                  </p>

                  <div className="flex justify-center gap-4 mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={captureImage}
                      disabled={!stream || !!capturedImage}
                      className="flex-1"
                    >
                      Capture Photo
                    </Button>

                    {capturedImage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCapturedImage(null)}
                        className="flex-1"
                      >
                        Retake
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="bg-green-600 w-full text-white hover:bg-green-700 mt-8 py-6"
              type="submit"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Submitting..." : "Submit Verification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}