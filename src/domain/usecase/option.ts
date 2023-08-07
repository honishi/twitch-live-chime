import { inject, injectable } from "tsyringe";

import { InjectTokens } from "../../di/inject-tokens";
import { BrowserApi } from "../infra-interface/browser-api";
import { TwitchApi } from "../infra-interface/twitch-api";
import { SoundType } from "../model/sound-type";

export interface Option {
  getShowNotification(): Promise<boolean>;
  setShowNotification(value: boolean): Promise<void>;
  getSoundVolume(): Promise<number>;
  setSoundVolume(value: number): Promise<void>;
  playTestSound(): Promise<void>;
  getAutoOpenUserIds(): Promise<string[]>;
  disableAutoOpen(userId: string): Promise<void>;
}

@injectable()
export class OptionImpl implements Option {
  constructor(
    @inject(InjectTokens.TwitchApi) private twitchApi: TwitchApi,
    @inject(InjectTokens.BrowserApi) private browserApi: BrowserApi,
  ) {}

  async getShowNotification(): Promise<boolean> {
    return await this.browserApi.getShowNotification();
  }

  async setShowNotification(value: boolean): Promise<void> {
    await this.browserApi.setShowNotification(value);
  }

  async getSoundVolume(): Promise<number> {
    return await this.browserApi.getSoundVolume();
  }

  async setSoundVolume(value: number): Promise<void> {
    await this.browserApi.setSoundVolume(value);
  }

  async playTestSound(): Promise<void> {
    await this.browserApi.playSound(SoundType.NEW_LIVE_MAIN);
  }

  async getAutoOpenUserIds(): Promise<string[]> {
    return (await this.browserApi.getAutoOpenUserIds()).reverse();
  }

  async disableAutoOpen(userId: string): Promise<void> {
    await this.browserApi.setAutoOpenUser(userId, false);
  }
}
