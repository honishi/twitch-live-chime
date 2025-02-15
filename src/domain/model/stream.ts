export type Stream = {
  id: string;
  userId: string;
  userLogin: string;
  userName: string;
  gameId: string;
  gameName: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  startedAt: Date;
  tagIds: string[];
  tags: string[];
  language: string;
  profileImageUrl?: string;
};
