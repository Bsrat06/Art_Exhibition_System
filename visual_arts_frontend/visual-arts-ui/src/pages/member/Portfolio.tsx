import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import { Upload, Trash2, Edit, RotateCw, ArrowUpDown, Filter } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import API from "../../lib/api";
import "react-datepicker/dist/react-datepicker.css";

type Artwork = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  approval_status: string;
  submission_date: string;
  feedback?: string;
};

type ArtworkForm = {
  id?: number;
  title: string;
  category: string;
  description: string;
  image: File | null;
};

type Errors = {
  title?: string;
  category?: string;
  description?: string;
  image?: string;
};

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CATEGORIES = ["sketch", "canvas", "wallart", "digital", "photography"] as const;
const STATUS_VARIANTS = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

const validateForm = (form: ArtworkForm): Errors => ({
  title: form.title.length === 0 ? "Title is required" : form.title.length > 100 ? "Title must be 100 characters or less" : undefined,
  category: !form.category || form.category === "none" ? "Category is required" : undefined,
  description: form.description.length > 1000 ? "Description must be 1000 characters or less" : undefined,
  image: !form.id && !form.image ? "Image is required" : undefined,
});

export default function Portfolio() {
  const [form, setForm] = useState<ArtworkForm>({ title: "", category: "none", description: "", image: null });
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [editMode, setEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 8;

  // Fetch artworks
  useEffect(() => {
    fetchArtworks(page);
  }, [page, statusFilter, categoryFilter]);

  const fetchArtworks = async (pageNum: number) => {
    setIsLoading(true);
    try {
      let url = `/artwork/my_artworks/?page=${pageNum}&page_size=${itemsPerPage}`;
      if (statusFilter !== "all") url += `&approval_status=${statusFilter}`;
      if (categoryFilter !== "all") url += `&category=${categoryFilter}`;
      
      const res = await API.get(url);
      setArtworks(res.data.results || []);
      setHasNext(!!res.data.next);
      setHasPrev(!!res.data.previous);
      setTotalItems(res.data.count || 0);
    } catch {
      toast.error("Failed to fetch portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      setShowCropper(true);
      setErrors((prev) => ({ ...prev, image: undefined }));
    } else {
      setForm({ ...form, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "title"
            ? value.length === 0
              ? "Title is required"
              : value.length > 100
              ? "Title must be 100 characters or less"
              : undefined
            : name === "description"
            ? value.length > 1000
              ? "Description must be 1000 characters or less"
              : undefined
            : undefined,
      }));
    }
  };

  // Handle select change
  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
    setErrors((prev) => ({ ...prev, category: value && value !== "none" ? undefined : "Category is required" }));
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
            resolve(new File([blob], "artwork.jpg", { type: "image/jpeg" }));
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
    if (preview && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
        setForm({ ...form, image: croppedImage });
        setShowCropper(false);
        setErrors((prev) => ({ ...prev, image: undefined }));
        toast.success("Image cropped successfully");
      } catch {
        toast.error("Failed to process image");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({ title: "", category: "none", description: "", image: null });
    setPreview(null);
    setShowCropper(false);
    setErrors({});
    setEditMode(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Form reset");
  };

  // Handle upload or update
  const handleSubmit = async () => {
    const newErrors = validateForm(form);
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    try {
      if (editMode && form.id) {
        await API.put(`/artwork/${form.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork updated successfully");
      } else {
        await API.post("/artwork/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork uploaded successfully");
      }
      resetForm();
      fetchArtworks(page);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || `Failed to ${editMode ? "update" : "upload"} artwork`);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit artwork
  const editArtwork = (artwork: Artwork) => {
    setForm({
      id: artwork.id,
      title: artwork.title,
      category: artwork.category,
      description: artwork.description,
      image: null,
    });
    setPreview(artwork.image);
    setEditMode(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete artwork
  const deleteArtwork = async () => {
    if (!deleteDialog.id) return;
    setIsLoading(true);
    try {
      await API.delete(`/artwork/${deleteDialog.id}/`);
      toast.success("Artwork deleted successfully");
      setDeleteDialog({ open: false, id: null });
      fetchArtworks(page);
    } catch {
      toast.error("Failed to delete artwork");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-in]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Manage and showcase your creative work
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Artwork
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{editMode ? "Edit Artwork" : "Upload Artwork"}</CardTitle>
            <CardDescription>Share your creative work with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Title</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="text-sm"
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
              />
              {errors.title && (
                <p id="title-error" className="text-xs text-red-500 mt-1">
                  {errors.title}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Category</Label>
              <Select value={form.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Category</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p id="category-error" className="text-xs text-red-500 mt-1">
                  {errors.category}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="text-sm"
                rows={4}
                maxLength={1000}
                aria-invalid={!!errors.description}
                aria-describedby="description-error"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {form.description.length}/1000 characters
              </p>
              {errors.description && (
                <p id="description-error" className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm">Image</Label>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="text-sm"
                ref={fileInputRef}
                aria-label="Upload artwork image"
              />
              {preview && !showCropper && (
                <img
                  src={preview}
                  alt="Artwork preview"
                  className="w-40 h-40 mt-3 rounded-lg border-2 border-teal-500 dark:border-teal-600 object-cover transition-transform hover:scale-[1.02]"
                />
              )}
              {showCropper && preview && (
                <div className="mt-3">
                  <div className="relative w-64 h-64">
                    <Cropper
                      image={preview}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
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
                        setForm({ ...form, image: null });
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        setErrors((prev) => ({ ...prev, image: undefined }));
                      }}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Cancel Crop
                    </Button>
                  </div>
                </div>
              )}
              {errors.image && (
                <p id="image-error" className="text-xs text-red-500 mt-1">
                  {errors.image}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-sm"
                aria-label={editMode ? "Update artwork" : "Submit artwork"}
              >
                {isLoading ? <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1.5" />}
                {isLoading ? (editMode ? "Updating..." : "Uploading...") : editMode ? "Update Artwork" : "Submit Artwork"}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                className="text-sm"
                aria-label="Reset form"
              >
                {editMode ? "Cancel Edit" : "Reset"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">My Artworks</h2>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Category: {categoryFilter === "all" ? "All" : categoryFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RotateCw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : artworks.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No artworks found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {artworks.map((art) => (
              <Card key={art.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1">{art.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {art.category}
                      </Badge>
                      <Badge variant={STATUS_VARIANTS[art.approval_status as keyof typeof STATUS_VARIANTS]}>
                        {art.approval_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {formatDate(art.submission_date)}
                    </p>
                    {art.approval_status === "rejected" && art.feedback && (
                      <p className="text-xs text-red-500 line-clamp-2">
                        Feedback: {art.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => editArtwork(art)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setDeleteDialog({ open: true, id: art.id })}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {artworks.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{artworks.length}</strong> of <strong>{totalItems}</strong> artworks
            </p>
            <div className="flex items-center justify-end gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!hasPrev || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNext || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to delete this artwork? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, id: null })}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteArtwork}
                disabled={isLoading}
                className="text-sm"
              >
                {isLoading ? <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}