import { useState } from "react";
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
import { Loader2, Save, X, Edit, Trash2, Video } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import Loading from "@/components/shared/Loading";
import {
  useAddProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "@/redux/features/projects/projectApi";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image?: string;
  repo: string;
  username: string;
  links: {
    live?: string;
    client?: string;
    server?: string;
    github?: string;
  };
  media: Array<{
    type: "youtube" | "video" | "image";
    url: string;
    videoId?: string;
    thumbnail?: string;
  }>;
}

const ProjectDashboard = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetProjectsQuery([
    { name: "page", value: page },
    { name: "limit", value: 5 },
  ]);
  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [saving, setSaving] = useState(false);
  const [newTechnology, setNewTechnology] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project>({
    _id: "",
    title: "",
    description: "",
    longDescription: "",
    category: "Frontend",
    technologies: [],
    image: "",
    repo: "",
    username: "rakibul58",
    links: {},
    media: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (project: Project) => {
    try {
      await deleteProject(project._id);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetForm = () => {
    setCurrentProject({
      _id: "",
      title: "",
      description: "",
      longDescription: "",
      category: "Frontend",
      technologies: [],
      image: "",
      links: {},
      media: [],
      repo: "",
      username: "rakibul58",
    });
    setIsEditing(false);
    setYoutubeUrl("");
    setShowYoutubeInput(false);
  };

  const handleImageUpload = async (file: File) => {
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

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setCurrentProject((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      }
    }
  };

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setCurrentProject((prev) => ({
          ...prev,
          media: [...prev.media, { type: "image", url: imageUrl }],
        }));
      }
    }
  };

  const handleYoutubeAdd = () => {
    if (youtubeUrl) {
      const videoId = youtubeUrl.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      )?.[1];
      if (videoId) {
        setCurrentProject((prev) => ({
          ...prev,
          media: [...prev.media, { type: "youtube", url: youtubeUrl, videoId }],
        }));
        setYoutubeUrl("");
        setShowYoutubeInput(false);
      }
    }
  };

  const removeMedia = (index: number) => {
    setCurrentProject((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const removeThumbnail = () => {
    setCurrentProject((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const addTechnology = () => {
    if (
      newTechnology.trim() &&
      !currentProject.technologies.includes(newTechnology.trim())
    ) {
      setCurrentProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    setCurrentProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing) {
        await updateProject({
          id: currentProject._id,
          projectData: currentProject,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = currentProject;
        await addProject(rest);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto border-0 py-8 relative w-full min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Project" : "Create New Project"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={currentProject.title}
                  onChange={(e) =>
                    setCurrentProject((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter project title"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={currentProject.category}
                  onValueChange={(value) =>
                    setCurrentProject((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Full Stack">Full Stack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thumbnail Section */}
              <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <div className="flex flex-wrap gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                </div>
                {currentProject.image && (
                  <div className="relative w-48 mt-4">
                    <img
                      src={currentProject.image}
                      alt="Thumbnail"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex flex-wrap gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowYoutubeInput(true)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Add YouTube Video
                  </Button>
                </div>
                {showYoutubeInput && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="Enter YouTube video URL"
                    />
                    <Button onClick={handleYoutubeAdd}>Add</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowYoutubeInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {currentProject.media.map((media, index) => (
                    <div key={index} className="relative group">
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={`Media ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center">
                          <Video className="h-8 w-8" />
                        </div>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add a technology"
                    onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                  />
                  <Button onClick={addTechnology}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProject.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-2 py-1"
                    >
                      {tech}
                      <X
                        className="h-4 w-4 ml-2 cursor-pointer"
                        onClick={() => removeTechnology(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={currentProject.description}
                  onChange={(e) =>
                    setCurrentProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Long Description</Label>
                <Textarea
                  value={currentProject.longDescription}
                  onChange={(e) =>
                    setCurrentProject((prev) => ({
                      ...prev,
                      longDescription: e.target.value,
                    }))
                  }
                  placeholder="Detailed description of the project"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Repository Name</Label>
                <Input
                  value={currentProject.repo}
                  onChange={(e) =>
                    setCurrentProject((prev) => ({
                      ...prev,
                      repo: e.target.value,
                    }))
                  }
                  placeholder="Repository name (required)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Project Links</Label>
                <div className="space-y-4">
                  <Input
                    value={currentProject.links.live || ""}
                    onChange={(e) =>
                      setCurrentProject((prev) => ({
                        ...prev,
                        links: { ...prev.links, live: e.target.value },
                      }))
                    }
                    placeholder="Live Demo URL"
                  />
                  <Input
                    value={currentProject.links.github || ""}
                    onChange={(e) =>
                      setCurrentProject((prev) => ({
                        ...prev,
                        links: { ...prev.links, github: e.target.value },
                      }))
                    }
                    placeholder="GitHub Repository URL"
                  />
                  <Input
                    value={currentProject.links.client || ""}
                    onChange={(e) =>
                      setCurrentProject((prev) => ({
                        ...prev,
                        links: { ...prev.links, client: e.target.value },
                      }))
                    }
                    placeholder="Client Repository URL"
                  />
                  <Input
                    value={currentProject.links.server || ""}
                    onChange={(e) =>
                      setCurrentProject((prev) => ({
                        ...prev,
                        links: { ...prev.links, server: e.target.value },
                      }))
                    }
                    placeholder="Server Repository URL"
                  />
                </div>
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
                  {isEditing ? "Update" : "Create"} Project
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.data?.projects?.map((project: Project) => (
                  <Card
                    key={project._id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        {project.image && (
                          <div className="w-48 flex-shrink-0">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="space-y-2 flex-grow">
                          <h3 className="font-semibold text-lg">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge>{project.category}</Badge>
                            {project.technologies
                              .slice(0, 3)
                              .map((tech, index) => (
                                <Badge key={index} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            {project.technologies.length > 3 && (
                              <Badge variant="outline">
                                +{project.technologies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={projectToDelete?._id === project._id}
                            onOpenChange={(open) => {
                              if (!open) setProjectToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setProjectToDelete(project)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Project</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "
                                  {project.title}"? This action cannot be
                                  undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-4 mt-4">
                                <Button
                                  variant="ghost"
                                  onClick={() => setProjectToDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(project)}
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
            <CardFooter className="flex justify-center">
              <Pagination
                page={page}
                totalPage={data?.data?.totalPages || 1}
                setPage={setPage}
              />
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProjectDashboard;
