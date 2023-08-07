export type Message = {
  messageType: MessageType;
  options?: { [key: string]: unknown };
};

export enum MessageType {
  REQUEST_CONNECT_TO_TWITCH = "REQUEST_CONNECT_TO_TWITCH",
}
