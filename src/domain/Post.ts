export type Post = {
  id: number;
  content: string;
  like: number;
  handle: string;
  isLiked: boolean;
  image: string | null;
  createdAt: Date | string;
  avatarUrl: string | null;
  name: string;
};
