import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  Loader2,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useGetCategories,
  useEditCategory,
  useDeleteCategory,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from "@/hooks/useHook";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  productCount: number;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [addingSubCategory, setAddingSubCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false);
  const [isDeleteSubModalOpen, setIsDeleteSubModalOpen] = useState(false);
  const [subDeleteError, setSubDeleteError] = useState<string | null>(null);
  const { data, isLoading, error, mutate } = useGetCategories();
  const { editCategoryData, isEditing } = useEditCategory();
  const { deleteCategoryData, isDeleting } = useDeleteCategory();
  const { createSubCategoryData, isCreating } = useCreateSubCategory();
  const { updateSubCategoryData, isUpdating } = useUpdateSubCategory();
  const { deleteSubCategoryData, isDeleting: isDeletingSub } = useDeleteSubCategory();
  const token = useSelector(selectUser)?.token;

  console.log("Data", data);

  // Extract categories from API response
  const categories: Category[] =
    data && Array.isArray(data.categories)
      ? data.categories.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || item.title || "Unnamed categories",
          description: item.description || "",
          createdAt:
            item.createdAt || item.created_at || new Date().toISOString(),
          productCount: 0, // API doesn't provide product count
          subCategories: item.subCategories || [],
        }))
      : [];

  const filteredCategories = categories.filter(
    (categories) =>
      categories.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setSelectedImage(null); // Reset selected image
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory || !token) return;

    setDeleteError(null); // Clear any previous error

    try {
      await deleteCategoryData(deletingCategory.id, token);
      mutate(); // Refresh categories
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (error: any) {
      console.error("Failed to delete category:", error);

      // Check if error status is 400 (category has listings)
      if (error?.response?.status === 400) {
        setDeleteError(
          "Category already holding some listings, you cannot delete. Try editing."
        );
      } else {
        setDeleteError("Failed to delete category. Please try again.");
      }
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddSubCategory = (category: Category) => {
    setAddingSubCategory(category);
    setIsAddSubModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setIsEditSubModalOpen(true);
  };

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setDeletingSubCategory(subCategory);
    setIsDeleteSubModalOpen(true);
  };

  const handleAddSubSubmit = async (formData: FormData) => {
    if (!addingSubCategory || !token) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      await createSubCategoryData({
        name,
        description: description || undefined,
        categoryId: addingSubCategory.id
      }, token);
      mutate(); // Refresh categories (which includes subcategories)
      setIsAddSubModalOpen(false);
      setAddingSubCategory(null);
    } catch (error) {
      console.error("Failed to add subcategory:", error);
    }
  };

  const handleEditSubSubmit = async (formData: FormData) => {
    if (!editingSubCategory || !token) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const updateData: { name?: string; description?: string } = {};
    if (name && name !== editingSubCategory.name) updateData.name = name;
    if (description !== editingSubCategory.description) updateData.description = description;

    try {
      await updateSubCategoryData(editingSubCategory.id, updateData, token);
      mutate(); // Refresh categories (which includes subcategories)
      setIsEditSubModalOpen(false);
      setEditingSubCategory(null);
    } catch (error) {
      console.error("Failed to edit subcategory:", error);
    }
  };

  const handleDeleteSubConfirm = async () => {
    if (!deletingSubCategory || !token) return;

    setSubDeleteError(null);

    try {
      await deleteSubCategoryData(deletingSubCategory.id, token);
      mutate(); // Refresh categories (which includes subcategories)
      setIsDeleteSubModalOpen(false);
      setDeletingSubCategory(null);
    } catch (error: any) {
      console.error("Failed to delete subcategory:", error);

      if (error?.response?.status === 400) {
        setSubDeleteError(
          "Cannot delete subcategory with existing listings."
        );
      } else {
        setSubDeleteError("Failed to delete subcategory. Please try again.");
      }
    }
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
      "edit-category-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!editingCategory || !token) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;

    const editData: { name?: string; description?: string; image?: File } = {};

    if (name && name !== editingCategory.name) editData.name = name;
    if (description && description !== editingCategory.description)
      editData.description = description;
    if (image && image.size > 0) editData.image = image;

    try {
      await editCategoryData(editingCategory.id, editData, token);
      mutate(); // Refresh categories
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to edit category:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FolderOpen
            size={48}
            className="mx-auto mb-4 opacity-50 text-muted-foreground"
          />
          <p className="text-muted-foreground">Failed to load categories</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Categories
          </h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Link
          to="/categories/add"
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add categories
        </Link>
      </div>

      {/* Search */}
      <div className="p-6 mb-6 border rounded-lg bg-card border-border">
        <div className="relative max-w-md">
          <Search
            className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => {
          const categorySubs = category.subCategories || [];
          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="border rounded-lg bg-card border-border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <FolderOpen size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {categorySubs.length} subcategories
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCategoryExpansion(category.id)}
                      className="p-2 transition-colors text-muted-foreground hover:text-blue-600"
                      title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 transition-colors text-muted-foreground hover:text-blue-600"
                      title="Edit category"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 transition-colors text-muted-foreground hover:text-red-600"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="mb-4 text-sm text-muted-foreground">
                  {category.description}
                </p>

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>

                {/* Add Subcategory Button */}
                <button
                  onClick={() => handleAddSubCategory(category)}
                  className="mt-4 flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  <Plus size={14} />
                  Add Subcategory
                </button>
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <div className="border-t border-border">
                  {categorySubs.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No subcategories yet
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {categorySubs.map((sub) => (
                        <div key={sub.id} className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{sub.name}</h4>
                            {sub.description && (
                              <p className="text-sm text-muted-foreground">{sub.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSubCategory(sub)}
                              className="p-1 transition-colors text-muted-foreground hover:text-blue-600"
                              title="Edit subcategory"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(sub)}
                              className="p-1 transition-colors text-muted-foreground hover:text-red-600"
                              title="Delete subcategory"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>No categories found</p>
          <p className="mt-2 text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Add your first category to get started"}
          </p>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-md border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Edit Category
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleEditSubmit(formData);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory.name}
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingCategory.description}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter category description"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
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
                        id="edit-category-image"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="edit-category-image"
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
                        id="edit-category-image"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="edit-category-image"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          <div className="relative w-full max-w-md border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Delete Category
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Confirm Deletion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">
                Are you sure you want to delete the category{" "}
                <span className="font-semibold text-foreground">
                  "{deletingCategory.name}"
                </span>
                ? This will permanently remove the category and may affect
                associated products.
              </p>

              {deleteError && (
                <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {isAddSubModalOpen && addingSubCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAddSubModalOpen(false)}
          />

          <div className="relative w-full max-w-md border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Add Subcategory
              </h2>
              <button
                onClick={() => setIsAddSubModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddSubSubmit(formData);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                  placeholder="Enter subcategory description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Subcategory"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {isEditSubModalOpen && editingSubCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsEditSubModalOpen(false)}
          />

          <div className="relative w-full max-w-md border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Edit Subcategory
              </h2>
              <button
                onClick={() => setIsEditSubModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleEditSubSubmit(formData);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSubCategory.name}
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter subcategory name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingSubCategory.description}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                  placeholder="Enter subcategory description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditSubModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Subcategory"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subcategory Modal */}
      {isDeleteSubModalOpen && deletingSubCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteSubModalOpen(false)}
          />

          <div className="relative w-full max-w-md border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Delete Subcategory
              </h2>
              <button
                onClick={() => setIsDeleteSubModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Confirm Deletion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">
                Are you sure you want to delete the subcategory{" "}
                <span className="font-semibold text-foreground">
                  "{deletingSubCategory.name}"
                </span>
                ? This will permanently remove the subcategory.
              </p>

              {subDeleteError && (
                <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                  {subDeleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteSubModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubConfirm}
                  disabled={isDeletingSub}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingSub ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Subcategory"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
