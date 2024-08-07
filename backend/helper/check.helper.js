export function hasSkills(data, jobRequiredSkill) {
  const jobKeywords = jobRequiredSkill.split(",");
  const res = jobKeywords.filter((keyword) =>
    data.toLowerCase().includes(keyword.toLowerCase())
  );
  return res.length != 0;
}
export function hasRequiredEducation(data, jobMinimumEducation) {
  const jobArray = jobMinimumEducation.split(" ");

  const res =
    data.toLowerCase().includes(jobArray[0].toLowerCase()) &&
    data.toLowerCase().includes(jobArray[jobArray.length - 1].toLowerCase());
  return res;
}
export function hasPhoneno(text) {
  const phoneRegex = /(\+\d{1,2}\s?)?(\d{10,})/;
  const match = text.match(phoneRegex);
  return match ? true : false;
}
export function hasEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? true : false;
}
// Function to check if all required headings are present in the resume
export function checkRequiredHeadings(resume) {
  // Define the required headings
  // "Contact Information": ["Contact Information", "Contact", "Personal Information"],
  // "Professional Summary": ["Professional Summary", "Summary", "Profile", "Overview"],
  // "Awards": ["Awards", "Honors", "Achievements"],
  // "Languages": ["Languages", "Language Skills", "Language Proficiency"],
  // "Professional Affiliations": ["Professional Affiliations", "Memberships", "Associations"]
  const Experience = [
    "Work Experience",
    "Experience",
    "Professional Experience",
    "Employment History",
  ];
  const Education = ["Education", "Academic Background", "Qualifications"];
  const Skills = ["Skills", "Key Skills", "Competencies", "Technical Skills"];
  const Projects = [
    "Projects",
    "Project",
    "Key Projects",
    "Project Experience",
  ];
  const Certifications = [
    "Certifications",
    "Certification",
    "Certifications and Licenses",
    "Credentials",
  ];
  const hasExperienceHeading = Experience.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const hasEducationHeading = Education.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const hasSkillsHeading = Skills.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const hasProjectHeading = Projects.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const hasCertificationHeading = Certifications.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const res =
    hasExperienceHeading &&
    hasEducationHeading &&
    hasSkillsHeading &&
    hasProjectHeading &&
    hasCertificationHeading;

  return res;
}

export function isResume(resume) {
  const Education = ["Education", "Academic Background", "Qualifications"];
  const Skills = ["Skills", "Key Skills", "Competencies", "Technical Skills"];

  const hasEducationHeading = Education.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const hasSkillsHeading = Skills.some((item) => {
    return resume.toLowerCase().includes(item.toLowerCase());
  });
  const res = hasEducationHeading && hasSkillsHeading;
  return res;
}
