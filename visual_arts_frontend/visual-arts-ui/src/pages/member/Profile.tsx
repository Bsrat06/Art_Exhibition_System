import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Upload, Eye, EyeOff, Trash2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import API from "../../lib/api";
import "react-datepicker/dist/react-datepicker.css";

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bio: string;
  profile_picture: File | null;
};

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) =>
  password === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);

export default function MemberProfile() {
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    bio: "",
    profile_picture: null,
  });
  const [initialForm, setInitialForm] = useState<ProfileForm | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current user profile
  useEffect(() => {
    setIsLoading(true);
    API.get("/auth/user/")
      .then((res) => {
        const { first_name, last_name, email, bio, profile_picture } = res.data;
        const profileData = { first_name, last_name, email, bio: bio || "", profile_picture: null, password: "" };
        setForm(profileData);
        setInitialForm(profileData);
        setPreviewUrl(profile_picture || null);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setIsLoading(false));
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profile_picture" && files && files[0]) {
      setForm({ ...form, profile_picture: files[0] });
      setPreviewUrl(URL.createObjectURL(files[0]));
      setShowCropper(true);
    } else {
      setForm({ ...form, [name]: value });
      // Validate on change
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "email"
            ? !validateEmail(value)
              ? "Invalid email format"
              : undefined
            : name === "password"
            ? !validatePassword(value)
              ? "Password must be at least 8 characters with uppercase, lowercase, and number"
              : undefined
            : name === "first_name" || name === "last_name"
            ? value.length > 50
              ? "Name must be 50 characters or less"
              : undefined
            : name === "bio"
            ? value.length > 500
              ? "Bio must be 500 characters or less"
              : undefined
            : undefined,
      }));
    }
  };

  // Get cropped image
  const getCroppedImg = useCallback(
    async (imageSrc: string, pixelCrop: CroppedAreaPixels) => {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], "profile_picture.jpg", { type: "image/jpeg" }));
          }
        }, "image/jpeg");
      });
    },
    []
  );

  // Handle crop complete
  const onCropComplete = useCallback((_: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Save cropped image
  const saveCroppedImage = async () => {
    if (previewUrl && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels);
        setForm({ ...form, profile_picture: croppedImage });
        setShowCropper(false);
        toast.success("Image cropped successfully");
      } catch (err) {
        toast.error("Failed to process image");
      }
    }
  };

  // Delete profile picture
  const deleteProfilePicture = async () => {
    setIsLoading(true);
    try {
      await API.delete("/auth/profile/remove-picture/");
      setForm({ ...form, profile_picture: null });
      setPreviewUrl(null); // Fixed: Set previewUrl to null
      setShowCropper(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Profile picture removed successfully");
    } catch (err) {
      toast.error("Failed to remove profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (initialForm) {
      setForm(initialForm);
      setPreviewUrl(initialForm.profile_picture || null);
      setErrors({});
      setShowCropper(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.info("Form reset to original values");
    }
  };

  // Submit update
  const handleSubmit = async () => {
    // Validate form
    const newErrors: Partial<ProfileForm> = {
      first_name: form.first_name.length > 50 ? "First name must be 50 characters or less" : undefined,
      last_name: form.last_name.length > 50 ? "Last name must be 50 characters or less" : undefined,
      email: !validateEmail(form.email) ? "Invalid email format" : undefined,
      password: !validatePassword(form.password) ? "Password must be at least 8 characters with uppercase, lowercase, and number" : undefined,
      bio: form.bio.length > 500 ? "Bio must be 500 characters or less" : undefined,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("first_name", form.first_name);
    data.append("last_name", form.last_name);
    data.append("email", form.email);
    if (form.password) data.append("password", form.password);
    if (form.bio) data.append("bio", form.bio);
    if (form.profile_picture) data.append("profile_picture", form.profile_picture);

    try {
      await API.put("/auth/profile/update/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInitialForm(form);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-in]">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-transform hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
            <p className="text-sm text-muted-foreground">Update your personal information and profile picture</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">First Name</Label>
              <Input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="text-sm"
                aria-invalid={!!errors.first_name}
                aria-describedby="first-name-error"
              />
              {errors.first_name && (
                <p id="first-name-error" className="text-xs text-red-500 mt-1">
                  {errors.first_name}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Last Name</Label>
              <Input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="text-sm"
                aria-invalid={!!errors.last_name}
                aria-describedby="last-name-error"
              />
              {errors.last_name && (
                <p id="last-name-error" className="text-xs text-red-500 mt-1">
                  {errors.last_name}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="text-sm"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">New Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="text-sm pr-10"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Bio</Label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="text-sm"
                rows={4}
                maxLength={500}
                aria-invalid={!!errors.bio}
                aria-describedby="bio-error"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {form.bio.length}/500 characters
              </p>
              {errors.bio && (
                <p id="bio-error" className="text-xs text-red-500 mt-1">
                  {errors.bio}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Input
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-sm"
                  ref={fileInputRef}
                  aria-label="Upload profile picture"
                />
                {previewUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deleteProfilePicture}
                        disabled={isLoading}
                        aria-label="Delete profile picture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove profile picture</TooltipContent>
                  </Tooltip>
                )}
              </div>
              {previewUrl && !showCropper && (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-28 h-28 rounded-full mt-3 border-2 border-teal-500 dark:border-teal-600 object-cover transition-transform hover:scale-[1.02]"
                />
              )}
              {showCropper && previewUrl && (
                <div className="mt-3">
                  <div className="relative w-64 h-64">
                    <Cropper
                      image={previewUrl}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={saveCroppedImage}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Save Crop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCropper(false);
                        setForm({ ...form, profile_picture: null });
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Cancel Crop
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-sm"
                aria-label="Save profile changes"
              >
                {isLoading ? <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1.5" />}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                className="text-sm"
                aria-label="Reset form"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}