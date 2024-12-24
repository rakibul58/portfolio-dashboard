/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAboutQuery,
  useUpdateAboutSectionMutation,
  useUpdateSkillsDataMutation,
} from "@/redux/features/about/aboutApi";
import Loading from "@/components/shared/Loading";
import { SectionEditor } from "@/components/About/SectionEditor";
import { SkillEditor } from "@/components/About/SkillEditor";
import { toast } from "sonner";

interface SectionData {
  [key: string]: any;
}

interface SkillData {
  [key: string]: any;
}

const AboutDashboard = () => {
  const [saving, setSaving] = useState(false);
  const { data, isFetching } = useGetAboutQuery(undefined);
  const [updateAboutSection] = useUpdateAboutSectionMutation();
  const [updateSkillsData] = useUpdateSkillsDataMutation();

  const updateSection = async (
    section: string,
    data: SectionData
  ): Promise<void> => {
    setSaving(true);

    try {
      updateAboutSection({ section, data });
      toast.success("Section updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  const updateSkills = async (
    category: string,
    skills: SkillData
  ): Promise<void> => {
    setSaving(true);

    try {
      updateSkillsData({ category, data: skills });

      toast.success("Skills updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update skills");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto border-0 py-8 relative w-full h-screen bg-gradient-to-br from-background to-secondary/30">
      {isFetching ? (
        <Loading />
      ) : (
        <Card className="border-0">
          <CardHeader>
            <CardTitle>About Page Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sections">
              <TabsList>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="sections">
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Focus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SectionEditor
                        saving={saving}
                        updateSection={updateSection}
                        section={data?.data?.currentFocus}
                        sectionKey="currentFocus"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Journey</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SectionEditor
                        saving={saving}
                        updateSection={updateSection}
                        section={data?.data?.learning}
                        sectionKey="learning"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SectionEditor
                        saving={saving}
                        updateSection={updateSection}
                        section={data?.data?.interests}
                        sectionKey="interests"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <Tabs defaultValue="frontend">
                  <TabsList>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>

                  <TabsContent value="frontend">
                    <SkillEditor
                      saving={saving}
                      updateSkills={updateSkills}
                      category="frontend"
                      skills={data?.data?.skills.frontend}
                    />
                  </TabsContent>

                  <TabsContent value="backend">
                    <SkillEditor
                      saving={saving}
                      updateSkills={updateSkills}
                      category="backend"
                      skills={data?.data?.skills.backend}
                    />
                  </TabsContent>

                  <TabsContent value="tools">
                    <SkillEditor
                      saving={saving}
                      updateSkills={updateSkills}
                      category="tools"
                      skills={data?.data?.skills.tools}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AboutDashboard;
