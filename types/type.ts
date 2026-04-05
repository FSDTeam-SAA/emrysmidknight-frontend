export interface Author {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  bio: string;
  profilePicture?: string;
  profileImage?: string; // legacy fallback
  // ...other fields
}

export interface Blog {
  _id: string;
  image: string[];
  audio: string[];
  link: string;
  attachment: string[];
  category: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  audienceType: "free" | "paid";
  price: number;
  comments: string[];
  likes: string[];
  isLocked?: boolean;
  isBookmarked?: boolean;
}

export interface BlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Blog[];
}
