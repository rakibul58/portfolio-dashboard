import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Plus, Save } from "lucide-react";

interface Skill {
  name: string;
  level: string;
  experience: string;
  details: string;
  projects: string[];
  keywords: string[];
}

interface SkillEditorProps {
  category: string;
  skills: Skill[];
  saving: boolean;
  updateSkills: (category: string, skills: Skill[]) => void;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({
  category,
  skills,
  updateSkills,
  saving,
}) => {
  const [skillsData, setSkillsData] = useState([...skills]);
  // Add state for temporary input values
  const [tempInputs, setTempInputs] = useState(
    skills.map((skill) => ({
      projects: skill.projects.join(", "),
      keywords: skill.keywords.join(", "),
    }))
  );

  const handleSave = () => {
    updateSkills(category, skillsData);
  };

  const addSkill = () => {
    setSkillsData((prev) => [
      ...prev,
      {
        name: "",
        level: "Beginner",
        experience: "",
        details: "",
        projects: [],
        keywords: [],
      },
    ]);
    setTempInputs((prev) => [...prev, { projects: "", keywords: "" }]);
  };

  const removeSkill = (index: number) => {
    setSkillsData((prev) => prev.filter((_, i) => i !== index));
    setTempInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArrayInputChange = (
    index: number,
    field: "projects" | "keywords",
    value: string
  ) => {
    // Update the temporary input value
    setTempInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        [field]: value,
      };
      return newInputs;
    });

    // Update the actual data with parsed array
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSkillsData((prev) => {
      const newSkills = [...prev];
      newSkills[index] = {
        ...newSkills[index],
        [field]: arrayValue,
      };
      return newSkills;
    });
  };

  return (
    <div className="space-y-6">
      {skillsData.map((skill, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Skill {index + 1}</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeSkill(index)}
              >
                Remove Skill
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...skillsData];
                    newSkills[index] = { ...skill, name: e.target.value };
                    setSkillsData(newSkills);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Input
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...skillsData];
                    newSkills[index] = { ...skill, level: e.target.value };
                    setSkillsData(newSkills);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input
                  value={skill.experience}
                  onChange={(e) => {
                    const newSkills = [...skillsData];
                    newSkills[index] = {
                      ...skill,
                      experience: e.target.value,
                    };
                    setSkillsData(newSkills);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Details</label>
                <Input
                  value={skill.details}
                  onChange={(e) => {
                    const newSkills = [...skillsData];
                    newSkills[index] = { ...skill, details: e.target.value };
                    setSkillsData(newSkills);
                  }}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">
                  Projects (comma-separated)
                </label>
                <Input
                  value={tempInputs[index].projects}
                  placeholder="Project 1, Project 2, Project 3"
                  onChange={(e) => {
                    handleArrayInputChange(index, "projects", e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">
                  Keywords (comma-separated)
                </label>
                <Input
                  value={tempInputs[index].keywords}
                  placeholder="Keyword 1, Keyword 2, Keyword 3"
                  onChange={(e) => {
                    handleArrayInputChange(index, "keywords", e.target.value);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-4">
        <Button variant="outline" onClick={addSkill} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SkillEditor;
