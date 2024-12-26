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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Save, Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import Loading from "@/components/shared/Loading";
import {
  useAddEducationMutation,
  useDeleteEducationMutation,
  useGetEducationsQuery,
  useUpdateEducationMutation,
} from "@/redux/features/education/educationApi";

interface Education {
  _id: string;
  degree: string;
  institution: string;
  period: string;
  result: string;
}

const EducationDashboard = () => {
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    _id: "",
    degree: "",
    institution: "",
    period: "",
    result: "",
  });

  // Add your API hooks here
  const { data, isFetching } = useGetEducationsQuery([
    { name: "page", value: page },
    { name: "limit", value: 5 },
  ]);
  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const handleEdit = (education: Education) => {
    setCurrentEducation(education);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (education: Education) => {
    try {
      await deleteEducation(education._id);
      setEducationToDelete(null);
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const resetForm = () => {
    setCurrentEducation({
      _id: "",
      degree: "",
      institution: "",
      period: "",
      result: "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing) {
        await updateEducation({
          id: currentEducation._id,
          educationData: currentEducation,
        });
      } else {
        const { _id, ...rest } = currentEducation;
        await addEducation(rest);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving education:", error);
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
          {/* Editor Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Education" : "Add New Education"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={currentEducation.degree}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({
                      ...prev,
                      degree: e.target.value,
                    }))
                  }
                  placeholder="Enter degree name"
                />
              </div>

              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={currentEducation.institution}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  placeholder="Enter institution name"
                />
              </div>

              <div className="space-y-2">
                <Label>Period</Label>
                <Input
                  value={currentEducation.period}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({
                      ...prev,
                      period: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2018 - 2022"
                />
              </div>

              <div className="space-y-2">
                <Label>Result</Label>
                <Input
                  value={currentEducation.result}
                  onChange={(e) =>
                    setCurrentEducation((prev) => ({
                      ...prev,
                      result: e.target.value,
                    }))
                  }
                  placeholder="e.g., CGPA 3.8/4.0"
                />
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
                  {isEditing ? "Update" : "Add"} Education
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education List Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.data?.education?.map((education: Education) => (
                  <Card
                    key={education._id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {education.degree}
                          </h3>
                          <p className="text-sm font-medium">
                            {education.institution}
                          </p>
                          <div className="flex gap-4">
                            <p className="text-sm text-muted-foreground">
                              {education.period}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Result: {education.result}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(education)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={educationToDelete?._id === education._id}
                            onOpenChange={(open) => {
                              if (!open) setEducationToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setEducationToDelete(education)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Education</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete your education
                                  record from "{education.institution}"? This
                                  action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-4 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setEducationToDelete(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(education)}
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

export default EducationDashboard;
