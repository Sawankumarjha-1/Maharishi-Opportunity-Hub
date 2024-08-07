export type individualJob = {
  _id: string;
  company: string;
  aboutCompany: string;
  title: string;
  experience: string;
  skills: string;
  location: string;
  minimumEducation: string;
  salary: string;
  joining: string;
  description: string;
  status: string;
  postedDate: string;
};
export type candidates = {
  _id: string;
  email: string;
  jobId: string;
  education: string;
  experience: string;
  linkedin: string;
  name: string;
  phone: string;
  resumeLink: string;
  skills: string;
};
export type JobAndCandidate = {
  _id: string;
  company: string;
  title: string;
  experience: string;
  skills: string;
  salary: string;
  status: string;
  postedDate: string;
  location: string;
  candidates: [];
};
