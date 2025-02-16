/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { BrowserApi } from "../../../src/domain/infra-interface/browser-api";
import { TwitchApi } from "../../../src/domain/infra-interface/twitch-api";
import { MessageType } from "../../../src/domain/model/message";
import { SoundType } from "../../../src/domain/model/sound-type";
import { Stream } from "../../../src/domain/model/stream";
import { MessagingService } from "../../../src/domain/service/messaging";
import { BackgroundImpl } from "../../../src/domain/usecase/background";

describe("BackgroundImpl", () => {
  let mockBrowserApi: jest.Mocked<BrowserApi>;
  let mockTwitchApi: jest.Mocked<TwitchApi>;
  let mockMessagingService: jest.Mocked<MessagingService>;

  let background: BackgroundImpl;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Generate mocks
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
      isDuplicateTabGuard: jest.fn(),
      setDuplicateTabGuard: jest.fn(),
      openOptionsPage: jest.fn(),
    } as unknown as jest.Mocked<BrowserApi>;

    mockTwitchApi = {
      getUsers: jest.fn(),
      getFollowingStreams: jest.fn(),
      getFollowingStreamers: jest.fn(),
    } as unknown as jest.Mocked<TwitchApi>;

    mockMessagingService = {
      addMessageHandler: jest.fn(),
      initialize: jest.fn(),
    } as jest.Mocked<MessagingService>;

    background = new BackgroundImpl(mockTwitchApi, mockBrowserApi, mockMessagingService);
    await Promise.resolve();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialize()", () => {
    it("Should initialize MessagingService and register a handler", () => {
      expect(mockMessagingService.initialize).toHaveBeenCalledTimes(1);
      expect(mockMessagingService.addMessageHandler).toHaveBeenCalledWith(
        MessageType.REQUEST_CONNECT_TO_TWITCH,
        expect.any(Function),
      );
    });
  });

  describe("run()", () => {
    it("On first call, should start keepAlive and request streams immediately", async () => {
      // Assume we have a valid token and userId for testing
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("TEST_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");
      mockTwitchApi.getFollowingStreams.mockResolvedValue([]);

      await background.run();

      // Start Offscreen
      expect(mockBrowserApi.startSendingKeepAliveFromOffscreen).toHaveBeenCalledTimes(1);
      // Immediately request streams once
      expect(mockTwitchApi.getFollowingStreams).toHaveBeenCalledTimes(1);
      // Reset badge
      expect(mockBrowserApi.setBadgeNumber).toHaveBeenCalledWith(0);
    });

    it("If there is no token, set warning badge", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue(undefined);
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");

      await background.run();

      expect(mockBrowserApi.setWarningBadge).toHaveBeenCalledTimes(1);
      // Does not call TwitchApi
      expect(mockTwitchApi.getFollowingStreams).not.toHaveBeenCalled();
    });

    it("If there is no userId, set warning badge", async () => {
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("TEST_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue(undefined);

      await background.run();

      expect(mockBrowserApi.setWarningBadge).toHaveBeenCalledTimes(1);
      expect(mockTwitchApi.getFollowingStreams).not.toHaveBeenCalled();
    });
  });

  describe("requestStreamsIgnoringError()", () => {
    it("Does not throw even if an exception occurs", async () => {
      mockBrowserApi.getTwitchAccessToken.mockRejectedValue(new Error("Some Error"));
      await expect(
        // Casting to call the private method for testing
        (background as any).requestStreamsIgnoringError(),
      ).resolves.not.toThrow();
    });
  });

  describe("checkStreams()", () => {
    it("When there is a new stream, notification ON, not suspended, and autoOpen is true, it should open a tab and play SoundType.NEW_LIVE_MAIN", async () => {
      const mockStream: Stream = {
        id: "stream123",
        userId: "user123",
        userLogin: "test_streamer",
        userName: "Test Streamer",
        title: "Playing Something",
        thumbnailUrl: "some_url",
        viewerCount: 1234,
        startedAt: new Date(),
        tagIds: [],
        tags: [],
        language: "en",
        gameId: "game123",
        gameName: "TEST_GAME",
        profileImageUrl: "test.png",
      };

      // Assume we have a valid token and userId
      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("TEST_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");

      // One new stream
      mockTwitchApi.getFollowingStreams.mockResolvedValue([mockStream]);

      // State flags
      mockBrowserApi.getShowNotification.mockResolvedValue(true);
      mockBrowserApi.getSuspendFromDate.mockResolvedValue(undefined); // Not suspended
      mockBrowserApi.isDuplicateTabGuard.mockResolvedValue(true); // Duplicate tab guard is on
      mockBrowserApi.isAutoOpenUser.mockResolvedValue(true); // The user is set to auto-open
      mockBrowserApi.getTabUrls.mockResolvedValue([]); // No tabs are open yet

      // Manually set lastStreamCheckTime for testing
      (background as any).lastStreamCheckTime = new Date();

      // Execute
      await (background as any).requestStreams();

      // Badge set to 1
      expect(mockBrowserApi.setBadgeNumber).toHaveBeenCalledWith(1);
      // Show notification
      expect(mockBrowserApi.showNotification).toHaveBeenCalledWith(
        `${mockStream.userName} started streaming`,
        mockStream.title,
        expect.any(String),
        expect.any(Function),
      );
      // Open a new tab
      expect(mockBrowserApi.openTab).toHaveBeenCalledWith("https://www.twitch.tv/test_streamer");
      // Play the main sound
      expect(mockBrowserApi.playSound).toHaveBeenCalledWith(SoundType.NEW_LIVE_MAIN);
    });

    it("When suspended, it does not open a tab, but if notification is ON it shows a notification (and does not play a sound)", async () => {
      const mockStream: Stream = {
        id: "stream999",
        userId: "suspend-user",
        userLogin: "suspend_login",
        userName: "Suspend Streamer",
        title: "Playing",
        thumbnailUrl: "some_url",
        viewerCount: 999,
        startedAt: new Date(),
        tagIds: [],
        tags: [],
        language: "en",
        gameId: "game123",
        gameName: "TEST_GAME",
        profileImageUrl: "test.png",
      };

      mockBrowserApi.getTwitchAccessToken.mockResolvedValue("TEST_TOKEN");
      mockBrowserApi.getTwitchUserId.mockResolvedValue("USER_ID");

      mockTwitchApi.getFollowingStreams.mockResolvedValue([mockStream]);

      mockBrowserApi.getShowNotification.mockResolvedValue(true);
      mockBrowserApi.getSuspendFromDate.mockResolvedValue(new Date()); // Suspended
      mockBrowserApi.isAutoOpenUser.mockResolvedValue(true);
      mockBrowserApi.getTabUrls.mockResolvedValue([]);

      // Manually set lastStreamCheckTime for testing
      (background as any).lastStreamCheckTime = new Date();

      await (background as any).requestStreams();

      // Tab is not opened
      expect(mockBrowserApi.openTab).not.toHaveBeenCalled();
      // But the notification is shown
      expect(mockBrowserApi.showNotification).toHaveBeenCalledTimes(1);
      // Sound is not played
      expect(mockBrowserApi.playSound).not.toHaveBeenCalled();
    });
  });

  describe("openNotification()", () => {
    it("If there is a corresponding URL for the notification ID, it should open a new tab", async () => {
      // Insert a value into private property "notifiedStreams"
      (background as any).notifiedStreams["notif123"] = "https://twitch.tv/my_stream";

      await background.openNotification("notif123");
      expect(mockBrowserApi.openTab).toHaveBeenCalledWith("https://twitch.tv/my_stream");
    });

    it("If there is no corresponding URL for the notification ID, do nothing", async () => {
      await background.openNotification("unknown_id");
      expect(mockBrowserApi.openTab).not.toHaveBeenCalled();
    });
  });
});
