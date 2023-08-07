export interface MessagingPort {
  onMessage(handler: (message: unknown) => void): void;
  sendMessage(message: unknown): Promise<void>;
}

export interface MessagingService {
  addMessageHandler(messageType: string, handler: (data: unknown) => Promise<void>): void;
  initialize(): void;
}
