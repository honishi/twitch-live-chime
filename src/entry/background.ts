import "reflect-metadata";

import { container } from "tsyringe";

import { InjectTokens } from "../di/inject-tokens";
import { configureDefaultContainer } from "../di/register";
import { Background } from "../domain/usecase/background";

// Receives keep-alive message from offscreen window just to wake up the background script.
// https://stackoverflow.com/a/66618269
function configureKeepAliveListener() {
  self.onmessage = (event) => {
    console.log(new Date(), "onmessage", event);
  };
}

function configureNotificationsListener(background: Background) {
  chrome.notifications.onClicked.addListener(async (notificationId) => {
    // console.log(`notification clicked: ${notificationId}`);
    await background.openNotification(notificationId);
  });
}

function configureRuntimeListener(background: Background) {
  chrome.runtime.onInstalled.addListener(async (details) => {
    console.log("onInstalled", details);
    await background.run();
  });
  chrome.runtime.onStartup.addListener(async () => {
    console.log("onStartup");
    await background.run();
  });
  console.log("configureRuntimeListener: done");
}

function configureListener(background: Background) {
  configureKeepAliveListener();
  configureNotificationsListener(background);
  configureRuntimeListener(background);
}

configureDefaultContainer();
const background = container.resolve<Background>(InjectTokens.Background);
configureListener(background);
console.log("Background script configured.");
await background.run();
console.log("Background script started.");
