import { BrowserApi } from "../domain/infra-interface/browser-api";
import { TwitchAuthError } from "../domain/model/error";
import { SoundType } from "../domain/model/sound-type";
import { TwitchAuthResult } from "../domain/model/twitch-auth-result";
import { ChromeMessage, ChromeMessageType } from "./chrome_message/message";

const TWITCH_ACCESS_TOKEN_KEY = "twitchAccessToken";
const TWITCH_USER_ID_KEY = "twitchUserId";
const SHOW_NOTIFICATION_KEY = "showNotification";
const SOUND_VOLUME_KEY = "soundVolume";
const SUSPEND_FROM_DATE_KEY = "suspendFromDate";
const DUPLICATE_TAB_GUARD_KEY = "duplicateTabGuard";
const AUTO_OPEN_USERS_KEY = "autoOpenUsers";
const TRENDING_LANGUAGES_KEY = "trendingLanguages";
const AUTO_UNMUTE_KEY = "autoUnmute";

const OFFSCREEN_HTML = "html/offscreen.html";

export class BrowserApiImpl implements BrowserApi {
  async launchAuthFlow(): Promise<TwitchAuthResult> {
    // await chrome.identity.clearAllCachedAuthTokens();
    const clientId = process.env.TWITCH_CLIENT_ID;
    const scopes = "user:read:follows";
    const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org`;
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&scope=${scopes}&response_type=token&redirect_uri=${redirectUri}`,
          interactive: true,
        },
        (responseUrl) => {
          console.log(responseUrl);
          if (chrome.runtime.lastError) {
            // For example, "The user did not approve access."
            const errorMessage = chrome.runtime.lastError.message;
            console.warn("launchWebAuthFlow error:", errorMessage);
            return reject(new TwitchAuthError(errorMessage));
          }
          if (responseUrl === undefined) {
            return reject(new TwitchAuthError("Failed to get response url"));
          }
          const authResult = this.parseResponseUrl(responseUrl!);
          if (authResult === undefined) {
            return reject(new TwitchAuthError("Failed to parse auth result"));
          }
          resolve(authResult);
        },
      );
    });
  }

  private parseResponseUrl(responseUrl: string): TwitchAuthResult | undefined {
    const url = new URL(responseUrl);
    const params = new URLSearchParams(url.hash.slice(1));
    const accessToken = params.get("access_token");
    if (accessToken === null) {
      return undefined;
    }
    return {
      accessToken: accessToken,
    };
  }

  async startSendingKeepAliveFromOffscreen(): Promise<void> {
    await this.createOffscreen();
  }

  async setWarningBadge(): Promise<void> {
    await chrome.action.setBadgeText({ text: "❗️" });
  }

  async setBadgeNumber(number: number): Promise<void> {
    await chrome.action.setBadgeText({ text: number.toString() });
  }

  async setBadgeBackgroundColor(hex: string): Promise<void> {
    await chrome.action.setBadgeBackgroundColor({ color: hex });
  }

  async getTwitchAccessToken(): Promise<string | undefined> {
    const result = await chrome.storage.local.get([TWITCH_ACCESS_TOKEN_KEY]);
    return result[TWITCH_ACCESS_TOKEN_KEY] ?? undefined;
  }

  async setTwitchAccessToken(value: string): Promise<void> {
    await chrome.storage.local.set({ [TWITCH_ACCESS_TOKEN_KEY]: value });
  }

  async getTwitchUserId(): Promise<string | undefined> {
    const result = await chrome.storage.local.get([TWITCH_USER_ID_KEY]);
    return result[TWITCH_USER_ID_KEY] ?? undefined;
  }

  async setTwitchUserId(value: string): Promise<void> {
    await chrome.storage.local.set({ [TWITCH_USER_ID_KEY]: value });
  }

  async getShowNotification(): Promise<boolean> {
    const result = await chrome.storage.local.get([SHOW_NOTIFICATION_KEY]);
    return result[SHOW_NOTIFICATION_KEY] ?? true;
  }

  async setShowNotification(value: boolean): Promise<void> {
    await chrome.storage.local.set({ [SHOW_NOTIFICATION_KEY]: value });
  }

  async getSoundVolume(): Promise<number> {
    const result = await chrome.storage.local.get([SOUND_VOLUME_KEY]);
    return result[SOUND_VOLUME_KEY] ?? 1.0;
  }

  async setSoundVolume(value: number): Promise<void> {
    await chrome.storage.local.set({ [SOUND_VOLUME_KEY]: value });
  }

  async playSound(sound: SoundType): Promise<void> {
    await this.createOffscreen();

    const message: ChromeMessage = {
      messageType: ChromeMessageType.PLAY_SOUND,
      options: {
        sound: sound,
        volume: await this.getSoundVolume(),
      },
    };

    try {
      await chrome.runtime.sendMessage(message);
    } catch (e) {
      console.error(`Failed to send message: ${e}`);
    } finally {
      console.log(`sent message: ${message}`);
    }
  }

  private async createOffscreen(): Promise<void> {
    if (await chrome.offscreen.hasDocument()) {
      return;
    }
    const url = chrome.runtime.getURL(OFFSCREEN_HTML);
    try {
      await chrome.offscreen.createDocument({
        url: url,
        reasons: [chrome.offscreen.Reason.BLOBS, chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: "background.js keep alive, audio playback",
      });
    } catch (e) {
      console.error(`Failed to create offscreen document: ${e}`);
    } finally {
      console.log("Offscreen document created");
    }
  }

  public showNotification(
    title: string,
    message: string,
    iconUrl: string,
    onCreated: (notificationId: string) => void,
  ): void {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: iconUrl,
        title: title,
        message: message,
      },
      onCreated,
    );
  }

  async isAutoOpenUser(userId: string): Promise<boolean> {
    const autoOpenUserIds = await this.getAutoOpenUserIds();
    return autoOpenUserIds.includes(userId);
  }

  async getAutoOpenUserIds(): Promise<string[]> {
    const result = await chrome.storage.local.get([AUTO_OPEN_USERS_KEY]);
    const autoOpenUsers = (result[AUTO_OPEN_USERS_KEY] as { [key: string]: string }[]) ?? [];
    return autoOpenUsers.map((user) => user.userId);
  }

  async setAutoOpenUser(userId: string, enabled: boolean): Promise<void> {
    const result = await chrome.storage.local.get([AUTO_OPEN_USERS_KEY]);
    const autoOpenUsers = (result[AUTO_OPEN_USERS_KEY] as { [key: string]: string }[]) ?? [];
    const autoOpenUserIds = autoOpenUsers.map((user) => user.userId);
    const targetEnabled = enabled;
    const currentEnabled = autoOpenUserIds.includes(userId);
    if (targetEnabled === currentEnabled) {
      // already set
      return;
    }
    const users = targetEnabled
      ? [...autoOpenUsers, { userId: userId }]
      : autoOpenUsers.filter((user) => user.userId !== userId);
    await chrome.storage.local.set({ [AUTO_OPEN_USERS_KEY]: users });
  }

  async openTab(url: string): Promise<void> {
    await chrome.tabs.create({ url: url });
  }

  async getTabUrls(): Promise<string[]> {
    const tabs = await chrome.tabs.query({});
    return tabs.map((tab) => tab.url).filter((url): url is string => url !== undefined);
  }

  async setSuspendFromDate(date: Date | undefined): Promise<void> {
    if (date === undefined) {
      await chrome.storage.local.remove(SUSPEND_FROM_DATE_KEY);
      return;
    }
    await chrome.storage.local.set({ [SUSPEND_FROM_DATE_KEY]: date.toISOString() });
  }

  async getSuspendFromDate(): Promise<Date | undefined> {
    const result = await chrome.storage.local.get([SUSPEND_FROM_DATE_KEY]);
    const date = result[SUSPEND_FROM_DATE_KEY];
    if (date === undefined) {
      return undefined;
    }
    return new Date(date);
  }

  async isDuplicateTabGuard(): Promise<boolean> {
    const result = await chrome.storage.local.get([DUPLICATE_TAB_GUARD_KEY]);
    return result[DUPLICATE_TAB_GUARD_KEY] ?? true;
  }

  async setDuplicateTabGuard(duplicateTabGuard: boolean): Promise<void> {
    await chrome.storage.local.set({ [DUPLICATE_TAB_GUARD_KEY]: duplicateTabGuard });
  }

  openOptionsPage(): void {
    chrome.runtime.openOptionsPage();
  }

  async getTrendingLanguages(): Promise<string[]> {
    const result = await chrome.storage.local.get([TRENDING_LANGUAGES_KEY]);
    return result[TRENDING_LANGUAGES_KEY] ?? [];
  }

  async setTrendingLanguages(languages: string[]): Promise<void> {
    await chrome.storage.local.set({ [TRENDING_LANGUAGES_KEY]: languages });
  }

  async getAutoUnmute(): Promise<boolean> {
    const result = await chrome.storage.local.get([AUTO_UNMUTE_KEY]);
    return result[AUTO_UNMUTE_KEY] ?? false;
  }

  async setAutoUnmute(enabled: boolean): Promise<void> {
    await chrome.storage.local.set({ [AUTO_UNMUTE_KEY]: enabled });
  }
}
