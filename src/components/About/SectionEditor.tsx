import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Minus, Plus, Save } from "lucide-react";

interface Section {
  title: string;
  description: string;
  items: string[];
}

interface SectionEditorProps {
  section: Section;
  sectionKey: string;
  saving: boolean;
  updateSection: (key: string, data: Section) => void;
}

export const SectionEditor = ({
  section,
  sectionKey,
  updateSection,
  saving,
}: SectionEditorProps) => {
  const [sectionData, setSectionData] = useState({ ...section });

  const handleSave = () => {
    updateSection(sectionKey, sectionData);
  };

  const addItem = () => {
    setSectionData((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }));
  };

  const removeItem = (index: number) => {
    setSectionData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={sectionData.title}
          onChange={(e) =>
            setSectionData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={sectionData.description}
          onChange={(e) =>
            setSectionData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Items</label>
        {sectionData.items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const newItems = [...sectionData.items];
                newItems[index] = e.target.value;
                setSectionData((prev) => ({ ...prev, items: newItems }));
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeItem(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );
};
