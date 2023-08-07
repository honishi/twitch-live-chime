import { TwitchApi } from "../domain/infra-interface/twitch-api";
import { InvalidTokenError } from "../domain/model/error";
import { Stream } from "../domain/model/stream";
import { Streamer } from "../domain/model/streamer";
import { User } from "../domain/model/user";
import { TwitchStreamData } from "./model/twitch-stream-response";
import { TwitchStreamerData } from "./model/twitch-streamer-response";
import { TwitchUserData } from "./model/twitch-user-response";

const API_BASE_URL = "https://api.twitch.tv/helix";
const GET_USERS_API_URL = `${API_BASE_URL}/users`;
const GET_STREAMS_API_URL = `${API_BASE_URL}/streams`;
const GET_FOLLOWING_STREAMS_API_URL = `${API_BASE_URL}/streams/followed`;
const GET_FOLLOWING_STREAMERS_API_URL = `${API_BASE_URL}/channels/followed`;

export class TwitchApiImpl implements TwitchApi {
  async getUsers(accessToken: string, userIds?: string[]): Promise<User[]> {
    const url = new URL(GET_USERS_API_URL);
    if (userIds) {
      // The ID of the user to get. To specify more than one user, include the id parameter for each user to get. For example, id=1234&id=5678. The maximum number of IDs you may specify is 100.
      userIds.forEach((userId) => {
        url.searchParams.append("id", userId);
      });
    }
    const response = await this.fetchWithToken(url.toString(), accessToken);
    const json = await response.json();
    return json.data.map((user: TwitchUserData) => ({
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      profileImageUrl: user.profile_image_url,
    }));
  }

  async getStreams(accessToken: string, languages: string[]): Promise<Stream[]> {
    const url = new URL(GET_STREAMS_API_URL);
    languages.forEach((language) => {
      url.searchParams.append("language", language);
    });
    url.searchParams.append("first", "100");
    const response = await this.fetchWithToken(url.toString(), accessToken);
    const json = await response.json();
    const users = await this.getUsers(
      accessToken,
      json.data.map((stream: TwitchStreamData) => stream.user_id),
    );
    return json.data.map((stream: TwitchStreamData) => this.toStream(stream, users));
  }

  async getFollowingStreams(
    accessToken: string,
    userId: string,
    includeProfileImage: boolean,
  ): Promise<Stream[]> {
    const url = new URL(GET_FOLLOWING_STREAMS_API_URL);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("first", "100");
    const response = await this.fetchWithToken(url.toString(), accessToken);
    const json = await response.json();
    const users = includeProfileImage
      ? await this.getUsers(
          accessToken,
          json.data.map((stream: TwitchStreamData) => stream.user_id),
        )
      : [];
    return json.data.map((stream: TwitchStreamData) => this.toStream(stream, users));
  }

  async getFollowingStreamers(accessToken: string, userId: string): Promise<Streamer[]> {
    let allStreamers: TwitchStreamerData[] = [];
    let cursor: string | undefined = undefined;
    let allUsers: User[] = [];

    do {
      const url = new URL(GET_FOLLOWING_STREAMERS_API_URL);
      url.searchParams.append("user_id", userId);
      url.searchParams.append("first", "100");
      if (cursor) {
        url.searchParams.append("after", cursor);
      }

      const response = await this.fetchWithToken(url.toString(), accessToken);
      const json = await response.json();

      allStreamers = [...allStreamers, ...json.data];
      cursor = json.pagination.cursor;

      const users = await this.getUsers(
        accessToken,
        json.data.map((streamer: TwitchStreamerData) => streamer.broadcaster_id),
      );
      allUsers = [...allUsers, ...users];
    } while (cursor);

    return allStreamers.map((streamer: TwitchStreamerData) => ({
      id: streamer.broadcaster_id,
      login: streamer.broadcaster_login,
      name: streamer.broadcaster_name,
      followedAt: new Date(streamer.followed_at),
      profileImageUrl:
        allUsers.find((user) => user.id === streamer.broadcaster_id)?.profileImageUrl ?? "",
    }));
  }

  private async fetchWithToken(url: string, accessToken: string): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
    });
    if (response.status === 401) {
      throw new InvalidTokenError();
    }
    return response;
  }

  private toStream(stream: TwitchStreamData, users: User[]): Stream {
    return {
      id: stream.id,
      userId: stream.user_id,
      userLogin: stream.user_login,
      userName: stream.user_name,
      gameId: stream.game_id,
      gameName: stream.game_name,
      title: stream.title,
      thumbnailUrl: stream.thumbnail_url,
      viewerCount: stream.viewer_count,
      startedAt: new Date(stream.started_at),
      tagIds: stream.tag_ids,
      tags: stream.tags,
      language: stream.language,
      profileImageUrl: users.find((user) => user.id === stream.user_id)?.profileImageUrl ?? "",
    };
  }
}
