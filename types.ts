export enum UserRole {
  GUEST = 'GUEST',
  CLIENT = 'CLIENT',
  HRD = 'HRD',
  HRD_PREMIUM = 'HRD_PREMIUM',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  profilePicture: string;
  // Client-specific
  currentJob?: string;
  desiredJob?: string;
  currentSkills?: string[];
  desiredSkills?: string[];
  desiredSalary?: { min: number; max: number };
  // HRD-specific
  company?: string;
  requiredSkills?: string[];
  budget?: { min: number; max: number };
}

export interface Job {
  id: number;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string[];
  salary: number;
  location: string;
  postedBy: number; // hrd user id
}

export interface Certification {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

export interface CartItem extends Certification {
  quantity: number;
}

export interface NewsletterArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
}

export interface ForumPost {
    id: number;
    title: string;
    authorId: number;
    content: string;
    comments: ForumComment[];
}

export interface ForumComment {
    id: number;
    authorId: number;
    content: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string | React.ReactNode;
    isLoading?: boolean;
}
