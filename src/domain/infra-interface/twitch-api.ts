import { Stream } from "../model/stream";
import { Streamer } from "../model/streamer";
import { User } from "../model/user";

export interface TwitchApi {
  getUsers(accessToken: string, userIds?: string[]): Promise<User[]>;
  getStreams(accessToken: string, languages: string[]): Promise<Stream[]>;
  getFollowingStreams(
    accessToken: string,
    userId: string,
    includeProfileImage: boolean,
  ): Promise<Stream[]>;
  getFollowingStreamers(accessToken: string, userId: string): Promise<Streamer[]>;
}
