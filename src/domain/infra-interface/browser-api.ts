import { SoundType } from "../model/sound-type";
import { TwitchAuthResult } from "../model/twitch-auth-result";

export interface BrowserApi {
  launchAuthFlow(): Promise<TwitchAuthResult>;
  startSendingKeepAliveFromOffscreen(): Promise<void>;
  setWarningBadge(): Promise<void>;
  setBadgeNumber(number: number): Promise<void>;
  setBadgeBackgroundColor(hex: string): Promise<void>;
  getTwitchAccessToken(): Promise<string | undefined>;
  setTwitchAccessToken(value: string): Promise<void>;
  getTwitchUserId(): Promise<string | undefined>;
  setTwitchUserId(value: string): Promise<void>;
  getShowNotification(): Promise<boolean>;
  setShowNotification(value: boolean): Promise<void>;
  getSoundVolume(): Promise<number>;
  setSoundVolume(value: number): Promise<void>;
  playSound(sound: SoundType): Promise<void>;
  showNotification(
    title: string,
    message: string,
    iconUrl: string,
    onCreated: (notificationId: string) => void,
  ): void;
  isAutoOpenUser(userId: string): Promise<boolean>;
  getAutoOpenUserIds(): Promise<string[]>;
  setAutoOpenUser(userId: string, enabled: boolean): Promise<void>;
  openTab(url: string): Promise<void>;
  getTabUrls(): Promise<string[]>;
  setSuspendFromDate(date: Date | undefined): Promise<void>;
  getSuspendFromDate(): Promise<Date | undefined>;
  isDuplicateTabGuard(): Promise<boolean>;
  setDuplicateTabGuard(duplicateTabGuard: boolean): Promise<void>;
  openOptionsPage(): void;
  getTrendingLanguages(): Promise<string[]>;
  setTrendingLanguages(languages: string[]): Promise<void>;
}
