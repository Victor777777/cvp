export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  responsibilities: string[];
  logo?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  logo?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  percentage: number;
}

export interface CVData {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  profileImage?: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  technicalSkills: string[];
  languages: Language[];
  interests: string[];
  achievements: string[];
}