import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAddCategory } from "@/hooks/useHook";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { addCategoryData, isAdding } = useAddCategory();
  const token = useSelector(selectUser)?.token;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "category-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    const formDataObj = new FormData(e.target as HTMLFormElement);
    const name = formDataObj.get("name") as string;
    const description = formDataObj.get("description") as string;
    const image = formDataObj.get("image") as File;

    const categoryData: { name: string; description: string; image?: File } = {
      name,
      description,
    };

    if (image && image.size > 0) {
      categoryData.image = image;
    }

    try {
      await addCategoryData(categoryData, token);
      navigate("/categories");
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/categories"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <ArrowLeft size={16} />
          Back to Categories
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Category</h1>
          <p className="text-muted-foreground">Create a new product category</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 border rounded-lg bg-card border-border">
            {/* Category Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Category Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name ? "border-red-500" : "border-input"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                  errors.description ? "border-red-500" : "border-input"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Provide a clear description of what products belong in this
                category
              </p>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category Image (Optional)
              </label>
              <div className="relative">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected category image"
                      className="object-cover w-full h-32 border rounded-lg border-border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      id="category-image"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="category-image"
                      className="absolute px-2 py-1 text-xs text-white transition-colors rounded cursor-pointer bottom-2 left-2 bg-black/50 hover:bg-black/70"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      id="category-image"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="category-image"
                      className="flex items-center justify-center w-full p-4 transition-colors border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary/50"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/categories"
              className="px-6 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isAdding ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
