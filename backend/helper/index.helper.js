import { UserModel } from "../models/user.model.js";
export function extractName(text) {
  const nameRegex = /([a-zA-Z]+[a-zA-Z\s]+)/;
  const match = text.match(nameRegex);
  return match ? match[0] : "";
}

export function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : "";
}

export function extractPhone(text) {
  const phoneRegex = /(\+\d{1,2}\s?)?(\d{10,})/;
  const match = text.match(phoneRegex);
  return match ? match[0] : "";
}

export function extractLinkedInLinks(text) {
  const linkedinPattern =
    /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi;
  return text.match(linkedinPattern)[0] || [];
}
export function extractWorkExperience(text) {
  const workExperiencePattern =
    /(?:\bexperience\b|\bworked\b|\bjob\b|\binternship\b)[^\.]*\./gi;
  return text.match(workExperiencePattern) || [];
}
export function extractEducation(text) {
  const educationKeywords = [
    "diploma",
    "degree",
    "B.Tech",
    "BTech",
    "M.Tech",
    "MTech",
    "MBA",
    "BSc",
    "MSc",
    "B.A",
    "Ph.D",
    "B.Pharm",
  ];

  const education = educationKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  return education;
}
export function extractSkills(text) {
  const skillsKeywords = [
    "SQL",
    "JavaScript",
    "HTML",
    "CSS",
    "MongoDB",
    "Node.js",
    "React",
    "React Native",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Django",
    "Flask",
    "Angular",
    "Vue.js",
    "TypeScript",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Git",
    "Machine Learning",
    "AI",
    "TensorFlow",
    "PyTorch",
    "Linux",
    "Agile",
    "Scrum",
  ];
  const skills = skillsKeywords.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return skills;
}
export function extractDOB(text) {
  // Regex patterns to capture common DOB formats (e.g., YYYY-MM-DD, MM/DD/YYYY)
  const dobPatterns = [
    /\b(\d{4}-\d{2}-\d{2})\b/g, // YYYY-MM-DD
    /\b(\d{2}\/\d{2}\/\d{4})\b/g, // MM/DD/YYYY
    /\b(\d{2}\.\d{2}\.\d{4})\b/g, // DD.MM.YYYY
    /\b(\d{2}-\d{2}-\d{4})\b/g, // DD-MM-YYYY
  ];

  let dobMatches = [];

  dobPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      dobMatches = dobMatches.concat(matches);
    }
  });

  return dobMatches ? dobMatches[0] : "";
}

export async function generateAccessAndRefereshTokens(id) {
  const user = await UserModel.findById(id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}
