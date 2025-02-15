import { SoundType } from "../domain/model/sound-type";
import { ChromeMessage, ChromeMessageType } from "../infra/chrome_message/message";

function startSendingKeepAlive() {
  setInterval(async () => {
    (await navigator.serviceWorker.ready).active?.postMessage("keepAlive");
  }, 20e3); // 20 seconds
}

function addOnMessageListener() {
  chrome.runtime.onMessage.addListener(async (message) => {
    // console.log(`Received message from the extension: ${JSON.stringify(message)}`);
    const chromeMessage = message as ChromeMessage;
    if (chromeMessage.messageType === ChromeMessageType.PLAY_SOUND) {
      await playAudio(toFilePath(message.options.sound), message.options.volume);
    }
  });
}

function toFilePath(soundType: SoundType): string {
  switch (soundType) {
    case SoundType.DEFAULT:
      return "../sounds/new_live_sub.mp3";
    case SoundType.NEW_LIVE_MAIN:
      return "../sounds/new_live_main.mp3";
    case SoundType.NEW_LIVE_SUB:
      return "../sounds/new_live_sub.mp3";
  }
}

async function playAudio(source: string, volume: number = 1) {
  const audio = new Audio(source);
  audio.volume = volume;
  await audio.play();
}

startSendingKeepAlive();
addOnMessageListener();
