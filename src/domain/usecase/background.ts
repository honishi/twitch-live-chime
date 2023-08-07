import { inject, injectable } from "tsyringe";

import { InjectTokens } from "../../di/inject-tokens";
import { BrowserApi } from "../infra-interface/browser-api";
import { TwitchApi } from "../infra-interface/twitch-api";
import { MessageType } from "../model/message";
import { SoundType } from "../model/sound-type";
import { Stream } from "../model/stream";
import { MessagingService } from "../service/messaging";
import { defaultBadgeBackgroundColor } from "./colors";

const RUN_INTERVAL = 1000 * 60; // 1 minute
const DELAY_AFTER_OPEN = 1000 * 5; // 5 seconds

export interface Background {
  run(): Promise<void>;
  openNotification(notificationId: string): Promise<void>;
}

@injectable()
export class BackgroundImpl implements Background {
  private isRunning = false;
  private lastStreamCheckTime?: Date;
  private processedStreamIds: string[] = [];
  private notifiedStreams: { [key: string]: string } = {}; // key: notificationId, value: streamUrl

  constructor(
    @inject(InjectTokens.TwitchApi) private twitchApi: TwitchApi,
    @inject(InjectTokens.BrowserApi) private browserApi: BrowserApi,
    @inject(InjectTokens.MessagingService) private messagingService: MessagingService,
  ) {
    this.initialize().then(() => console.log("Background initialized"));
  }

  async initialize(): Promise<void> {
    this.initializeMessagingService();
    await this.resetSuspended();
  }

  private initializeMessagingService(): void {
    this.messagingService.initialize();
    this.messagingService.addMessageHandler(
      MessageType.REQUEST_CONNECT_TO_TWITCH,
      async () => await this.handleRequestConnectToTwitch(),
    );
  }

  private async handleRequestConnectToTwitch(): Promise<void> {
    try {
      const result = await this.browserApi.launchAuthFlow();
      await this.browserApi.setTwitchAccessToken(result.accessToken);
      const accessToken = await this.browserApi.getTwitchAccessToken();
      if (accessToken === undefined) {
        // This should never happen
        throw new Error("Failed to get access token");
      }
      const users = await this.twitchApi.getUsers(accessToken);
      await this.browserApi.setTwitchUserId(users[0].id);
      console.log("Background: Connected to Twitch successfully");

      // First streams fetch after authentication
      await this.requestStreamsIgnoringError();
    } catch (e) {
      console.warn("Background: Failed to connect to Twitch", e);
      await this.browserApi.setWarningBadge();
    }
  }

  async resetSuspended(): Promise<void> {
    await this.browserApi.setSuspendFromDate(undefined);
    await this.browserApi.setBadgeBackgroundColor(defaultBadgeBackgroundColor);
  }

  async run(): Promise<void> {
    if (this.isRunning) {
      console.log("Background run: already running");
      return;
    }
    console.log("Background run: start");
    this.isRunning = true;

    await this.browserApi.startSendingKeepAliveFromOffscreen();
    await this.requestStreamsIgnoringError();
    setInterval(async () => {
      await this.requestStreamsIgnoringError();
    }, RUN_INTERVAL);

    console.log("Background run: end");
  }

  async openNotification(notificationId: string): Promise<void> {
    const url = this.notifiedStreams[notificationId];
    if (url === undefined) {
      console.log(
        `Background openNotification: url is undefined. notificationId=${notificationId}`,
      );
      return;
    }
    await this.browserApi.openTab(url);
  }

  private async requestStreamsIgnoringError(): Promise<void> {
    try {
      await this.requestStreams();
    } catch (e) {
      console.log(`Failed to request streams: ${e}`);
    }
  }

  private async requestStreams(): Promise<void> {
    console.log("Background requestStreams: start", new Date());

    const accessToken = await this.browserApi.getTwitchAccessToken();
    if (accessToken === undefined) {
      console.log("Background requestStreams: accessToken is undefined");
      await this.browserApi.setWarningBadge();
      return;
    }
    const userId = await this.browserApi.getTwitchUserId();
    if (userId === undefined) {
      console.log("Background requestStreams: userId is undefined");
      await this.browserApi.setWarningBadge();
      return;
    }

    const streams = await this.twitchApi.getFollowingStreams(accessToken, userId, false);
    await this.browserApi.setBadgeNumber(streams.length);
    await this.checkStreams(streams);

    console.log("Background requestStreams: end", new Date());
  }

  private async checkStreams(streams: Stream[]): Promise<void> {
    if (this.lastStreamCheckTime === undefined) {
      this.lastStreamCheckTime = new Date();
      this.processedStreamIds = streams.map((p) => p.id);
      return;
    }
    this.lastStreamCheckTime = new Date();

    const showNotification = await this.browserApi.getShowNotification();
    const isSuspended = (await this.browserApi.getSuspendFromDate()) !== undefined;

    let openedAnyPrograms = false;
    for (const stream of streams) {
      if (this.isProcessed(stream)) {
        continue;
      }
      this.logStream("Found following stream:", stream);
      this.processedStreamIds.push(stream.id);
      if (openedAnyPrograms) {
        console.log(`wait: ${DELAY_AFTER_OPEN} ms`);
        await this.delay(DELAY_AFTER_OPEN);
      }
      if (showNotification) {
        this.showNotification(stream);
      }
      if (isSuspended) {
        console.log("Suspended", stream.id);
        continue;
      }
      const shouldAutoOpen = await this.shouldAutoOpenStream(stream);
      if (shouldAutoOpen) {
        await this.browserApi.openTab(this.makeStreamUrl(stream));
        await this.browserApi.playSound(SoundType.NEW_LIVE_MAIN);
      } else if (showNotification) {
        await this.browserApi.playSound(SoundType.NEW_LIVE_SUB);
      }
      openedAnyPrograms = true;
    }

    this.processedStreamIds = this.processedStreamIds.slice(-10000);
  }

  private isProcessed(stream: Stream): boolean {
    return this.processedStreamIds.includes(stream.id);
  }

  private logStream(message: string, stream: Stream): void {
    console.log(message, stream.id, stream.userLogin, stream.title, stream.startedAt);
  }

  private showNotification(stream: Stream): void {
    this.browserApi.showNotification(
      `${stream.userName} started streaming`,
      stream.title,
      this.makeThumbnailUrl(stream),
      (notificationId) => {
        console.log(`Background checkAndPlaySounds: notificationId: ${notificationId}`);
        this.notifiedStreams[notificationId] = this.makeStreamUrl(stream);
      },
    );
  }

  private makeThumbnailUrl(stream: Stream): string {
    // https://static-cdn.jtvnw.net/previews-ttv/live_user_k4sen-{width}x{height}.jpg
    return stream.thumbnailUrl.replace("{width}", "1280").replace("{height}", "720");
  }

  private makeStreamUrl(stream: Stream): string {
    return `https://www.twitch.tv/${stream.userLogin}`;
  }

  private async shouldAutoOpenStream(stream: Stream): Promise<boolean> {
    const isTargetUser = await this.browserApi.isAutoOpenUser(stream.userId);
    const isAlreadyOpened = (await this.getTabStreamUserLogins()).includes(stream.userLogin);
    const shouldOpen = isTargetUser && !isAlreadyOpened;
    console.log(
      `shouldAutoOpen: userId:(${stream.userId}) userLogin:(${stream.userLogin}) streamId:(${stream.id}) isTargetUser:(${isTargetUser}) isAlreadyOpened:(${isAlreadyOpened}) shouldOpen:(${shouldOpen})`,
    );
    return shouldOpen;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async getTabStreamUserLogins(): Promise<string[]> {
    return (await this.browserApi.getTabUrls())
      .map((url) => {
        // Matches 1. but not 2.
        // 1. https://www.twitch.tv/kaze_no_nyantarou
        // 2. https://www.twitch.tv/kaze_no_nyantarou/schedule
        const match = url.match(/^https:\/\/.*twitch\.tv\/([^/]+)$/);
        if (match === null) {
          return undefined;
        }
        return match[1];
      })
      .filter((id): id is string => id !== undefined);
  }
}
