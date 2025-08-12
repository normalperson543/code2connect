export type Project = {
  name: string;
  projectId: string;
  thumbnail: string;
  owner: {
    username: string;
    profilePicture?: string;
  };
  likes: number;
  featured: boolean;
};
