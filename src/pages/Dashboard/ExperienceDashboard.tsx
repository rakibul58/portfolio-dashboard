/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Save, X, Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import Loading from "@/components/shared/Loading";
import {
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
  useUpdateExperienceMutation,
} from "@/redux/features/experience/experienceApi";

interface Experience {
  _id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

const ExperienceDashboard = () => {
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [experienceToDelete, setExperienceToDelete] =
    useState<Experience | null>(null);
  const [newAchievement, setNewAchievement] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    _id: "",
    title: "",
    company: "",
    period: "",
    description: "",
    achievements: [],
  });

  // Add your API hooks here
  const { data, isFetching } = useGetExperiencesQuery([
    { name: "page", value: page },
    { name: "limit", value: 5 },
  ]);
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (experience: Experience) => {
    try {
      await deleteExperience(experience._id);
      setExperienceToDelete(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const resetForm = () => {
    setCurrentExperience({
      _id: "",
      title: "",
      company: "",
      period: "",
      description: "",
      achievements: [],
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing) {
        await updateExperience({
          id: currentExperience._id,
          experienceData: currentExperience,
        });
      } else {
        const { _id, ...rest } = currentExperience;
        await addExperience(rest);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setSaving(false);
    }
  };

  const addAchievement = () => {
    if (
      newAchievement.trim() &&
      !currentExperience.achievements.includes(newAchievement.trim())
    ) {
      setCurrentExperience((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    setCurrentExperience((prev) => ({
      ...prev,
      achievements: prev.achievements.filter(
        (achievement) => achievement !== achievementToRemove
      ),
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
                {isEditing ? "Edit Experience" : "Add New Experience"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={currentExperience.title}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter job title"
                />
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={currentExperience.company}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label>Period</Label>
                <Input
                  value={currentExperience.period}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({
                      ...prev,
                      period: e.target.value,
                    }))
                  }
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={currentExperience.description}
                  onChange={(e) =>
                    setCurrentExperience((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your role and responsibilities"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Achievements</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement"
                    onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                  />
                  <Button onClick={addAchievement}>Add</Button>
                </div>
                <div className="space-y-2 mt-2">
                  {currentExperience.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-secondary rounded"
                    >
                      <span className="text-sm">{achievement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(achievement)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
                  {isEditing ? "Update" : "Add"} Experience
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Experience List Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.data?.experience?.map((experience: Experience) => (
                  <Card
                    key={experience._id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {experience.title}
                          </h3>
                          <p className="text-sm font-medium">
                            {experience.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {experience.period}
                          </p>
                          <p className="text-sm">{experience.description}</p>
                          <div className="space-y-1">
                            {experience.achievements.map(
                              (achievement, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {achievement}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(experience)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={experienceToDelete?._id === experience._id}
                            onOpenChange={(open) => {
                              if (!open) setExperienceToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  setExperienceToDelete(experience)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Experience</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this
                                  experience at "{experience.company}"? This
                                  action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-4 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setExperienceToDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(experience)}
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
                totalPage={data?.totalPages}
              />
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default ExperienceDashboard;
