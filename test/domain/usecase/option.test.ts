import "reflect-metadata";
import { OptionImpl } from "../../../src/domain/usecase/option";
import { BrowserApi } from "../../../src/domain/infra-interface/browser-api";
import { TwitchApi } from "../../../src/domain/infra-interface/twitch-api";
import { SoundType } from "../../../src/domain/model/sound-type";

describe("OptionImpl", () => {
  let mockBrowserApi: jest.Mocked<BrowserApi>;
  let mockTwitchApi: jest.Mocked<TwitchApi>;
  let optionImpl: OptionImpl;

  beforeEach(() => {
    mockBrowserApi = {
      getAutoUnmute: jest.fn(),
      setAutoUnmute: jest.fn(),
      getShowNotification: jest.fn(),
      setShowNotification: jest.fn(),
      getSoundVolume: jest.fn(),
      setSoundVolume: jest.fn(),
      playSound: jest.fn(),
      getAutoOpenUserIds: jest.fn(),
      setAutoOpenUser: jest.fn(),
    } as jest.Mocked<BrowserApi>;

    mockTwitchApi = {} as jest.Mocked<TwitchApi>; // No methods used by OptionImpl directly in tests for now

    optionImpl = new OptionImpl(mockTwitchApi, mockBrowserApi);
  });

  describe("getAutoUnmute", () => {
    it("should call browserApi.getAutoUnmute and return its result", async () => {
      mockBrowserApi.getAutoUnmute.mockResolvedValue(true);
      const result = await optionImpl.getAutoUnmute();
      expect(result).toBe(true);
      expect(mockBrowserApi.getAutoUnmute).toHaveBeenCalledTimes(1);

      mockBrowserApi.getAutoUnmute.mockResolvedValue(false);
      const result2 = await optionImpl.getAutoUnmute();
      expect(result2).toBe(false);
    });
  });

  describe("setAutoUnmute", () => {
    it("should call browserApi.setAutoUnmute with the given value", async () => {
      await optionImpl.setAutoUnmute(true);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledWith(true);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledTimes(1);

      await optionImpl.setAutoUnmute(false);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledWith(false);
    });
  });

  describe("getShowNotification", () => {
    it("should call browserApi.getShowNotification and return its result", async () => {
      mockBrowserApi.getShowNotification.mockResolvedValue(true);
      const result = await optionImpl.getShowNotification();
      expect(result).toBe(true);
      expect(mockBrowserApi.getShowNotification).toHaveBeenCalledTimes(1);

      mockBrowserApi.getShowNotification.mockResolvedValue(false);
      const result2 = await optionImpl.getShowNotification();
      expect(result2).toBe(false);
    });
  });

  describe("setShowNotification", () => {
    it("should call browserApi.setShowNotification with the given value", async () => {
      await optionImpl.setShowNotification(true);
      expect(mockBrowserApi.setShowNotification).toHaveBeenCalledWith(true);
      expect(mockBrowserApi.setShowNotification).toHaveBeenCalledTimes(1);

      await optionImpl.setShowNotification(false);
      expect(mockBrowserApi.setShowNotification).toHaveBeenCalledWith(false);
    });
  });

  describe("getSoundVolume", () => {
    it("should call browserApi.getSoundVolume and return its result", async () => {
      mockBrowserApi.getSoundVolume.mockResolvedValue(0.5);
      const result = await optionImpl.getSoundVolume();
      expect(result).toBe(0.5);
      expect(mockBrowserApi.getSoundVolume).toHaveBeenCalledTimes(1);

      mockBrowserApi.getSoundVolume.mockResolvedValue(1.0);
      const result2 = await optionImpl.getSoundVolume();
      expect(result2).toBe(1.0);
    });
  });

  describe("setSoundVolume", () => {
    it("should call browserApi.setSoundVolume with the given value", async () => {
      await optionImpl.setSoundVolume(0.7);
      expect(mockBrowserApi.setSoundVolume).toHaveBeenCalledWith(0.7);
      expect(mockBrowserApi.setSoundVolume).toHaveBeenCalledTimes(1);

      await optionImpl.setSoundVolume(0.0);
      expect(mockBrowserApi.setSoundVolume).toHaveBeenCalledWith(0.0);
    });
  });

  describe("playTestSound", () => {
    it("should call browserApi.playSound with SoundType.NEW_LIVE_MAIN", async () => {
      await optionImpl.playTestSound();
      expect(mockBrowserApi.playSound).toHaveBeenCalledWith(SoundType.NEW_LIVE_MAIN);
      expect(mockBrowserApi.playSound).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAutoOpenUserIds", () => {
    it("should call browserApi.getAutoOpenUserIds and return its result reversed", async () => {
      const userIds = ["id1", "id2", "id3"];
      const reversedUserIds = ["id3", "id2", "id1"];
      mockBrowserApi.getAutoOpenUserIds.mockResolvedValue(userIds);
      const result = await optionImpl.getAutoOpenUserIds();
      expect(result).toEqual(reversedUserIds);
      expect(mockBrowserApi.getAutoOpenUserIds).toHaveBeenCalledTimes(1);
    });
  });

  describe("disableAutoOpen", () => {
    it("should call browserApi.setAutoOpenUser with the given userId and false", async () => {
      const userIdToDisable = "user123";
      await optionImpl.disableAutoOpen(userIdToDisable);
      expect(mockBrowserApi.setAutoOpenUser).toHaveBeenCalledWith(userIdToDisable, false);
      expect(mockBrowserApi.setAutoOpenUser).toHaveBeenCalledTimes(1);
    });
  });
});
