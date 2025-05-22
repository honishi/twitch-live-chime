import "reflect-metadata";
import { ContentImpl } from "../../../src/domain/usecase/content";
import { BrowserApi } from "../../../src/domain/infra-interface/browser-api";

describe("ContentImpl", () => {
  let mockBrowserApi: jest.Mocked<BrowserApi>;
  let contentImpl: ContentImpl;

  beforeEach(() => {
    mockBrowserApi = {
      getAutoUnmute: jest.fn(),
      setAutoUnmute: jest.fn(),
    } as jest.Mocked<BrowserApi>;
    contentImpl = new ContentImpl(mockBrowserApi);
  });

  describe("isAutoUnmute", () => {
    it("should call browserApi.getAutoUnmute and return its result", async () => {
      mockBrowserApi.getAutoUnmute.mockResolvedValue(true);
      const result = await contentImpl.isAutoUnmute();
      expect(result).toBe(true);
      expect(mockBrowserApi.getAutoUnmute).toHaveBeenCalledTimes(1);

      mockBrowserApi.getAutoUnmute.mockResolvedValue(false);
      const result2 = await contentImpl.isAutoUnmute();
      expect(result2).toBe(false);
    });
  });

  describe("setAutoUnmute", () => {
    it("should call browserApi.setAutoUnmute with the given value", async () => {
      await contentImpl.setAutoUnmute(true);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledWith(true);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledTimes(1);

      await contentImpl.setAutoUnmute(false);
      expect(mockBrowserApi.setAutoUnmute).toHaveBeenCalledWith(false);
    });
  });
});
