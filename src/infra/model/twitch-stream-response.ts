// https://dev.twitch.tv/docs/api/reference/#get-followed-streams
export type TwitchStreamResponse = {
  data: TwitchStreamData[];
  pagination: {
    cursor: string;
  };
};

export type TwitchStreamData = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  title: string;
  thumbnail_url: string;
  viewer_count: number;
  started_at: string;
  tag_ids: string[];
  tags: string[];
  language: string;
};
