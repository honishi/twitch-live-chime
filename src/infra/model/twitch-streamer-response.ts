// https://dev.twitch.tv/docs/api/reference/#get-followed-channels
export type TwitchStreamerResponse = {
  total: number;
  data: TwitchStreamerData[];
  pagination: {
    cursor: string;
  };
};

export type TwitchStreamerData = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
};
