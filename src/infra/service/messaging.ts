import { injectable } from "tsyringe";

import { Message } from "../../domain/model/message";
import { MessagingPort, MessagingService } from "../../domain/service/messaging";

@injectable()
export class MessagingServiceImpl implements MessagingService {
  private handlers: Map<string, (data: unknown) => Promise<void>> = new Map();

  initialize(): void {
    chrome.runtime.onMessage.addListener((message: Message) => {
      const handler = this.handlers.get(message.messageType);
      if (handler) {
        handler(message.options);
      }
    });
  }

  addMessageHandler(messageType: string, handler: (data: unknown) => Promise<void>): void {
    this.handlers.set(messageType, handler);
  }
}

@injectable()
export class MessagingPortImpl implements MessagingPort {
  onMessage(handler: (message: unknown) => void): void {
    chrome.runtime.onMessage.addListener(handler);
  }

  async sendMessage(message: unknown): Promise<void> {
    await chrome.runtime.sendMessage(message);
  }
}
