/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Save, X, Edit, Trash2 } from "lucide-react";
import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
} from "@/redux/features/blogs/blogApi";
import Pagination from "@/components/shared/Pagination";
import Loading from "@/components/shared/Loading";

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: string;
  coverImage: { url: string } | null;
}

const BlogDashboard = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetBlogsQuery([
    { name: "page", value: page },
    { name: "limit", value: 5 },
  ]);
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [saving, setSaving] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [currentBlog, setCurrentBlog] = useState<Blog>({
    _id: "",
    title: "",
    content: "",
    slug: "",
    excerpt: "",
    category: "",
    tags: [],
    status: "draft",
    coverImage: null,
  });
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (blog: Blog) => {
    try {
      await deleteBlog(blog._id);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const resetForm = () => {
    setCurrentBlog({
      _id: "",
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      slug: "",
      status: "draft",
      coverImage: null,
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${import.meta.env.VITE_CLOUDINARY_PRESET}`
    );

    try {
      const response = await fetch(`${import.meta.env.VITE_CLOUDINARY_URI}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleCoverImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setCurrentBlog((prev) => ({
          ...prev,
          coverImage: { url: imageUrl },
        }));
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing) {
        await updateBlog({ id: currentBlog._id, blogData: currentBlog });
      } else {
        await addBlog(currentBlog);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !currentBlog.tags.includes(newTag.trim())) {
      setCurrentBlog((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="mx-auto border-0 py-8 relative w-full min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {isFetching ? (
        <Loading />
      ) : (
        <>
          {/* Editor Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Blog" : "Create New Blog"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={currentBlog.title}
                  onChange={(e) =>
                    setCurrentBlog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter blog title"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  defaultValue={currentBlog.category}
                  value={currentBlog.category}
                  onValueChange={(value) =>
                    setCurrentBlog((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                  />
                  {currentBlog.coverImage?.url && (
                    <img
                      src={currentBlog.coverImage.url}
                      alt="Cover"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentBlog.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-2 py-1"
                    >
                      {tag}
                      <X
                        className="h-4 w-4 ml-2 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  value={currentBlog.content}
                  onEditorChange={(content) =>
                    setCurrentBlog((prev) => ({ ...prev, content }))
                  }
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help | image",
                    images_upload_handler: async (blobInfo) => {
                      const url = await handleImageUpload(blobInfo.blob());
                      return url;
                    },
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={currentBlog.excerpt}
                  onChange={(e) =>
                    setCurrentBlog((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={currentBlog.status}
                  onValueChange={(value) =>
                    setCurrentBlog((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? "Update" : "Create"} Blog
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blogs List Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.data?.blogs?.map((blog: Blog) => (
                  <Card
                    key={blog._id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {blog.excerpt}
                          </p>
                          <div className="flex gap-2">
                            <Badge>{blog.category}</Badge>
                            <Badge variant="outline">{blog.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(blog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={blogToDelete?._id === blog._id}
                            onOpenChange={(open) => {
                              if (!open) setBlogToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setBlogToDelete(blog)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Blog</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{blog.title}
                                  "? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-4 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setBlogToDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(blog)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Pagination
                page={page}
                setPage={setPage}
                totalPage={data?.data?.totalPages}
              />
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default BlogDashboard;
