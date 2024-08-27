import CompanyHistory from "@/components/About/CompanyHistory";
import Contact from "@/components/About/Contact";
import Fleet from "@/components/About/Fleet";
import Header from "@/components/About/Header";
import MeetTheTeam from "@/components/About/MeetTheTeam";
import ValuesCommitment from "@/components/About/ValuesCommitment";

const About = () => {
  return (
    <div>
      <Header />
      <CompanyHistory />
      <MeetTheTeam />
      <Fleet />
      <ValuesCommitment />
      <Contact />
    </div>
  );
};

export default About;