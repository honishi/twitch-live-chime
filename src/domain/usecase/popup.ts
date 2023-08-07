import { inject, injectable } from "tsyringe";

import { InjectTokens } from "../../di/inject-tokens";
import { BrowserApi } from "../infra-interface/browser-api";
import { TwitchApi } from "../infra-interface/twitch-api";
import { NoTokenError, NoUserIdError, TwitchAuthError } from "../model/error";
import { MessageType } from "../model/message";
import { Stream } from "../model/stream";
import { Streamer } from "../model/streamer";
import { MessagingPort } from "../service/messaging";
import { defaultBadgeBackgroundColor, suspendedBadgeBackgroundColor } from "./colors";

export interface Popup {
  connectToTwitch(): Promise<void>;
  getFollowingStreams(): Promise<Stream[]>;
  getStreams(languages: string[]): Promise<Stream[]>;
  getFollowingStreamers(): Promise<Streamer[]>;
  setBadgeNumber(number: number): Promise<void>;
  isSuspended(): Promise<boolean>;
  setSuspended(suspended: boolean): Promise<void>;
  openOptionsPage(): void;
  isAutoOpenUser(userId: string): Promise<boolean>;
  setAutoOpenUser(userId: string, enabled: boolean): Promise<void>;
  getTrendingLanguages(): Promise<string[]>;
  setTrendingLanguages(languages: string[]): Promise<void>;
}

@injectable()
export class PopupImpl implements Popup {
  constructor(
    @inject(InjectTokens.TwitchApi) private twitchApi: TwitchApi,
    @inject(InjectTokens.BrowserApi) private browserApi: BrowserApi,
    @inject(InjectTokens.MessagingPort) private messagingPort: MessagingPort,
  ) {}

  async connectToTwitch(): Promise<void> {
    try {
      // If we launch the auth flow directly here, the popup may close during the process leaving it in an incomplete state,
      // so we send a message to the background script to launch the auth flow there instead.
      await this.messagingPort.sendMessage({
        messageType: MessageType.REQUEST_CONNECT_TO_TWITCH,
      });
    } catch (e) {
      if (e instanceof TwitchAuthError) {
        console.log("Popup connectToTwitch: ", e.message);
        await this.browserApi.setWarningBadge();
      }
    }
  }

  async getFollowingStreams(): Promise<Stream[]> {
    const accessToken = await this.browserApi.getTwitchAccessToken();
    if (accessToken === undefined) {
      throw new NoTokenError();
    }
    const userId = await this.browserApi.getTwitchUserId();
    if (userId === undefined) {
      throw new NoUserIdError();
    }
    return this.twitchApi.getFollowingStreams(accessToken, userId, true);
  }

  async getStreams(languages: string[]): Promise<Stream[]> {
    const accessToken = await this.browserApi.getTwitchAccessToken();
    if (accessToken === undefined) {
      throw new NoTokenError();
    }
    return this.twitchApi.getStreams(accessToken, languages);
  }

  async getFollowingStreamers(): Promise<Streamer[]> {
    const accessToken = await this.browserApi.getTwitchAccessToken();
    if (accessToken === undefined) {
      throw new NoTokenError();
    }
    const userId = await this.browserApi.getTwitchUserId();
    if (userId === undefined) {
      throw new NoUserIdError();
    }
    return this.twitchApi.getFollowingStreamers(accessToken, userId);
  }

  async setBadgeNumber(number: number): Promise<void> {
    await this.browserApi.setBadgeNumber(number);
  }

  async isSuspended(): Promise<boolean> {
    return (await this.browserApi.getSuspendFromDate()) !== undefined;
  }

  async setSuspended(suspended: boolean): Promise<void> {
    await this.browserApi.setSuspendFromDate(suspended ? new Date() : undefined);

    const isSuspended = await this.isSuspended();
    await this.browserApi.setBadgeBackgroundColor(
      isSuspended ? suspendedBadgeBackgroundColor : defaultBadgeBackgroundColor,
    );
  }

  openOptionsPage(): void {
    this.browserApi.openOptionsPage();
  }

  async isAutoOpenUser(userId: string): Promise<boolean> {
    return await this.browserApi.isAutoOpenUser(userId);
  }

  async setAutoOpenUser(userId: string, enabled: boolean): Promise<void> {
    await this.browserApi.setAutoOpenUser(userId, enabled);
  }

  async getTrendingLanguages(): Promise<string[]> {
    return await this.browserApi.getTrendingLanguages();
  }

  async setTrendingLanguages(languages: string[]): Promise<void> {
    await this.browserApi.setTrendingLanguages(languages);
  }
}
