import "reflect-metadata";

import { BrowserApi } from "../../../src/domain/infra-interface/browser-api";
import { TwitchApi } from "../../../src/domain/infra-interface/twitch-api";
import {
  InvalidTokenError,
  NoTokenError,
  NoUserIdError,
  TwitchAuthError,
} from "../../../src/domain/model/error";
import { MessageType } from "../../../src/domain/model/message";
import { Stream } from "../../../src/domain/model/stream";
import { Streamer } from "../../../src/domain/model/streamer";
import { MessagingPort } from "../../../src/domain/service/messaging";
import { PopupImpl } from "../../../src/domain/usecase/popup";

describe("PopupImpl", () => {
  let mockTwitchApi: jest.Mocked<TwitchApi>;
  let mockBrowserApi: jest.Mocked<BrowserApi>;
  let mockMessagingPort: jest.Mocked<MessagingPort>;
  let popup: PopupImpl;

  beforeEach(() => {
    jest.clearAllMocks();

    // Generate mocks
    mockTwitchApi = {
      getUsers: jest.fn(),
      getFollowingStreams: jest.fn(),
      getFollowingStreamers: jest.fn(),
      getStreams: jest.fn(),
    } as unknown as jest.Mocked<TwitchApi>;

    mockBrowserApi = {
      launchAuthFlow: jest.fn(),
      startSendingKeepAliveFromOffscreen: jest.fn(),
      setWarningBadge: jest.fn(),
      setBadgeNumber: jest.fn(),
      setBadgeBackgroundColor: jest.fn(),
      getTwitchAccessToken: jest.fn(),
      setTwitchAccessToken: jest.fn(),
      getTwitchUserId: jest.fn(),
      setTwitchUserId: jest.fn(),
      getShowNotification: jest.fn(),
      setShowNotification: jest.fn(),
      getSoundVolume: jest.fn(),
      setSoundVolume: jest.fn(),
      playSound: jest.fn(),
      showNotification: jest.fn(),
      isAutoOpenUser: jest.fn(),
      getAutoOpenUserIds: jest.fn(),
      setAutoOpenUser: jest.fn(),
      openTab: jest.fn(),
      getTabUrls: jest.fn(),
      setSuspendFromDate: jest.fn(),
      getSuspendFromDate: jest.fn(),
      openOptionsPage: jest.fn(),
      getTrendingLanguages: jest.fn(),
      setTrendingLanguages: jest.fn(),
    } as unknown as jest.Mocked<BrowserApi>;

    mockMessagingPort = {
      onMessage: jest.fn(),
      sendMessage: jest.fn(),
    } as unknown as jest.Mocked<MessagingPort>;

    popup = new PopupImpl(mockTwitchApi, mockBrowserApi, mockMessagingPort);
  });

  describe("connectToTwitch()", () => {
    it("Should send a REQUEST_CONNECT_TO_TWITCH message to the background script", async () => {
      await popup.connectToTwitch();
      expect(mockMessagingPort.sendMessage).toHaveBeenCalledTimes(1);
      expect(mockMessagingPort.sendMessage).toHaveBeenCalledWith({
        messageType: MessageType.REQUEST_CONNECT_TO_TWITCH,
      });
    });

    it("Should call setWarningBadge() when TwitchAuthError is thrown", async () => {
      mockMessagingPort.sendMessage.mockRejectedValueOnce(new TwitchAuthError("Auth error"));

      await popup.connectToTwitch();
      expect(mockBrowserApi.setWarningBadge).toHaveBeenCalledTimes(1);
    });
  });

  describe("getFollowingStreams()", () => {
    it("Should return live streams when token & userId are present", async () => {
      const mockStreams: Stream[] = [
        {
          id: "stream-id",
          userId: "some-user",
          userLogin: "someuser",
          userName: "SomeUser",
          gameId: "123",
          gameName: "SomeGame",
          title: "some title",
          thumbnailUrl: "http://example.com",
          viewerCount: 999,
          startedAt: new Date(),
          tagIds: [],
          tags: [],
          language: "en",
          profileImageUrl: "http://example.com/profile.png",
        },
      ];
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");
      mockTwitchApi.getFollowingStreams.mockResolvedValue(mockStreams);

      const result = await popup.getFollowingStreams();
      expect(result).toEqual(mockStreams);
    });

    it("Should throw NoTokenError when access token is undefined", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue(undefined);
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");

      await expect(popup.getFollowingStreams()).rejects.toThrow(NoTokenError);
    });

    it("Should throw NoUserIdError when userId is undefined", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue(undefined);

      await expect(popup.getFollowingStreams()).rejects.toThrow(NoUserIdError);
    });

    it("Should throw InvalidTokenError when TwitchApi returns 401", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");
      mockTwitchApi.getFollowingStreams.mockRejectedValue(new InvalidTokenError("401"));

      await expect(popup.getFollowingStreams()).rejects.toThrow(InvalidTokenError);
    });
  });

  describe("getFollowingStreamers()", () => {
    it("should return streamers if token & userId are present", async () => {
      const mockStreamers: Streamer[] = [
        {
          id: "123",
          login: "streamer123",
          name: "Streamer Name",
          followedAt: new Date(),
          profileImageUrl: "http://example.com/streamer.png",
        },
      ];
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");
      mockTwitchApi.getFollowingStreamers.mockResolvedValue(mockStreamers);

      const result = await popup.getFollowingStreamers();
      expect(result).toEqual(mockStreamers);
    });

    it("should throw NoTokenError if access token is undefined", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue(undefined);
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");

      await expect(popup.getFollowingStreamers()).rejects.toThrow(NoTokenError);
    });

    it("should throw NoUserIdError if userId is undefined", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue(undefined);

      await expect(popup.getFollowingStreamers()).rejects.toThrow(NoUserIdError);
    });
  });

  describe("setBadgeNumber()", () => {
    it("should call browserApi.setBadgeNumber()", async () => {
      await popup.setBadgeNumber(5);
      expect(mockBrowserApi.setBadgeNumber).toHaveBeenCalledWith(5);
    });
  });

  describe("isSuspended() & setSuspended()", () => {
    it("Should return true when getSuspendFromDate() is defined", async () => {
      mockBrowserApi.getSuspendFromDate.mockResolvedValue(new Date());
      const result = await popup.isSuspended();
      expect(result).toBe(true);
    });

    it("Should return false when getSuspendFromDate() is undefined", async () => {
      mockBrowserApi.getSuspendFromDate.mockResolvedValue(undefined);
      const result = await popup.isSuspended();
      expect(result).toBe(false);
    });

    it("Should set suspendFromDate and badge background color when suspended", async () => {
      await popup.setSuspended(true);
      expect(mockBrowserApi.setSuspendFromDate).toHaveBeenCalledWith(expect.any(Date));
      expect(mockBrowserApi.setBadgeBackgroundColor).toHaveBeenCalled();
    });

    it("Should remove suspendFromDate and reset badge color when unsuspended", async () => {
      await popup.setSuspended(false);
      expect(mockBrowserApi.setSuspendFromDate).toHaveBeenCalledWith(undefined);
      expect(mockBrowserApi.setBadgeBackgroundColor).toHaveBeenCalled();
    });
  });

  describe("openOptionsPage()", () => {
    it("should call browserApi.openOptionsPage()", () => {
      popup.openOptionsPage();
      expect(mockBrowserApi.openOptionsPage).toHaveBeenCalledTimes(1);
    });
  });

  describe("isAutoOpenUser() & setAutoOpenUser()", () => {
    it("isAutoOpenUser() should return the result from browserApi.isAutoOpenUser()", async () => {
      mockBrowserApi.isAutoOpenUser.mockResolvedValue(true);
      const result = await popup.isAutoOpenUser("some-user-id");
      expect(result).toBe(true);
      expect(mockBrowserApi.isAutoOpenUser).toHaveBeenCalledWith("some-user-id");
    });

    it("setAutoOpenUser() should call browserApi.setAutoOpenUser()", async () => {
      await popup.setAutoOpenUser("some-user-id", true);
      expect(mockBrowserApi.setAutoOpenUser).toHaveBeenCalledWith("some-user-id", true);
    });
  });

  describe("getStreams()", () => {
    it("Should return streams when token is present", async () => {
      const mockStreams: Stream[] = [
        {
          id: "stream-id",
          userId: "some-user",
          userLogin: "someuser",
          userName: "SomeUser",
          gameId: "123",
          gameName: "SomeGame",
          title: "some title",
          thumbnailUrl: "http://example.com",
          viewerCount: 999,
          startedAt: new Date(),
          tagIds: [],
          tags: [],
          language: "en",
          profileImageUrl: "http://example.com/profile.png",
        },
      ];
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("ACCESS_TOKEN");
      mockTwitchApi.getStreams.mockResolvedValue(mockStreams);

      const result = await popup.getStreams(["en", "ja"]);
      expect(result).toEqual(mockStreams);
      expect(mockTwitchApi.getStreams).toHaveBeenCalledWith("ACCESS_TOKEN", ["en", "ja"]);
    });

    it("Should throw NoTokenError when access token is undefined", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue(undefined);

      await expect(popup.getStreams(["en"])).rejects.toThrow(NoTokenError);
    });
  });

  describe("getTrendingLanguages()", () => {
    it("Should return languages from browserApi", async () => {
      const mockLanguages = ["en", "ja", "ko"];
      mockBrowserApi.getTrendingLanguages.mockResolvedValue(mockLanguages);

      const result = await popup.getTrendingLanguages();
      expect(result).toEqual(mockLanguages);
      expect(mockBrowserApi.getTrendingLanguages).toHaveBeenCalledTimes(1);
    });
  });

  describe("setTrendingLanguages()", () => {
    it("Should call browserApi.setTrendingLanguages with provided languages", async () => {
      const languages = ["en", "ja", "ko"];
      await popup.setTrendingLanguages(languages);
      
      expect(mockBrowserApi.setTrendingLanguages).toHaveBeenCalledWith(languages);
      expect(mockBrowserApi.setTrendingLanguages).toHaveBeenCalledTimes(1);
    });
  });
});
