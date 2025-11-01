import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

const Profile = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fileInputRef = useRef(null);

  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
  });

  const profile = profileResponse?.data;

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      status: "",
      firstName: "",
      lastName: "",
      middleName: "",
      prefix: "",
      suffix: "",
      phoneNumber: "",
      email: "",
      secondNumber: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipCode: "",
    },
  });

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        status: profile.status || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        middleName: profile.middleName || "",
        prefix: profile.prefix || "",
        suffix: profile.suffix || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || "",
        secondNumber: profile.secondNumber || "",
        country: profile.country || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        city: `${profile.city || ""}, ${profile.state || ""}`
          .trim()
          .replace(/^,|,$/g, ""),
        zipCode: profile.zipCode || "",
      });
    }
  }, [profile, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => {
      // Parse city and state
      const [city, state] = data.city.split(",").map((s) => s.trim());
      return api.updateProfile({
        ...data,
        city: city || "",
        state: state || "",
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile"]);
      setShowConfirmDialog(false);
      addToast("Profile updated successfully", "success");
      // Reset form with new data to clear isDirty
      if (response?.data) {
        const updatedProfile = response.data;
        reset({
          status: updatedProfile.status || "",
          firstName: updatedProfile.firstName || "",
          lastName: updatedProfile.lastName || "",
          middleName: updatedProfile.middleName || "",
          prefix: updatedProfile.prefix || "",
          suffix: updatedProfile.suffix || "",
          phoneNumber: updatedProfile.phoneNumber || "",
          email: updatedProfile.email || "",
          secondNumber: updatedProfile.secondNumber || "",
          country: updatedProfile.country || "",
          addressLine1: updatedProfile.addressLine1 || "",
          addressLine2: updatedProfile.addressLine2 || "",
          city: `${updatedProfile.city || ""}, ${updatedProfile.state || ""}`
            .trim()
            .replace(/^,|,$/g, ""),
          zipCode: updatedProfile.zipCode || "",
        });
      }
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: (photoUrl) => api.uploadPhoto(photoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      addToast("Photo uploaded successfully", "success");
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  // Handle confirm button click - show dialog
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  // Handle cancel - reset form to original values
  const handleCancel = () => {
    if (profile) {
      reset({
        status: profile.status || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        middleName: profile.middleName || "",
        prefix: profile.prefix || "",
        suffix: profile.suffix || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || "",
        secondNumber: profile.secondNumber || "",
        country: profile.country || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        city: `${profile.city || ""}, ${profile.state || ""}`
          .trim()
          .replace(/^,|,$/g, ""),
        zipCode: profile.zipCode || "",
      });
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast("Photo size must be less than 5MB", "error");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        addToast("Please upload an image file", "error");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        uploadPhotoMutation.mutate(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Link successfully copied", "success");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Your profile helps personalize your experience and ensures legal
          compliance. Please provide accurate information.
        </p>
      </div>

      {/* General Information */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">General information</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>UserID: {profile?.userId}</span>
              <button
                onClick={() => copyToClipboard(profile?.userId)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Avatar Section */}
            <div className="col-span-3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold text-gray-700">
                    {profile?.initials}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                variant="default"
                onClick={handleUploadClick}
                disabled={uploadPhotoMutation.isPending}
              >
                {uploadPhotoMutation.isPending
                  ? "Uploading..."
                  : "Upload photo"}
              </Button>
            </div>

            {/* Form Fields */}
            <div className="col-span-9 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" {...register("status")}>
                    <option>Mister</option>
                    <option>Miss</option>
                    <option>Mrs</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Input here"
                    {...register("firstName")}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} />
                </div>
              </div>

              <div>
                <Label htmlFor="middleName">Middle Name (optional)</Label>
                <Input id="middleName" {...register("middleName")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prefix">Prefix (optional)</Label>
                  <Input
                    id="prefix"
                    placeholder="Enter prefix..."
                    {...register("prefix")}
                  />
                </div>
                <div>
                  <Label htmlFor="suffix">Suffix (optional)</Label>
                  <Input
                    id="suffix"
                    placeholder="Enter suffix..."
                    {...register("suffix")}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Contact Information */}
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
            </div>
            <div>
              <Label htmlFor="secondNumber">Second number (optional)</Label>
              <Input id="secondNumber" {...register("secondNumber")} />
            </div>
          </div>
        </CardContent>

        {/* Address */}
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select id="country" {...register("country")}>
                <option>USA</option>
                <option>Canada</option>
                <option>UK</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address line 1</Label>
                <Input id="addressLine1" {...register("addressLine1")} />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
                <Input
                  id="addressLine2"
                  placeholder="e.g. Apartment 2"
                  {...register("addressLine2")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Zip code</Label>
                <Input id="zipCode" {...register("zipCode")} />
              </div>
              <div>
                <Label htmlFor="city">City/Town</Label>
                <Input id="city" {...register("city")} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save and Cancel Buttons */}
      {isDirty && (
        <div className="flex justify-end gap-3 mb-6">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={updateMutation.isPending}
            type="button"
          >
            {updateMutation.isPending ? "Saving..." : "Confirm"}
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogHeader onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle>Confirm changes</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Please confirm the updates to the general information, as these will
            affect the contract details.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Confirm and notify counselor"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile;
