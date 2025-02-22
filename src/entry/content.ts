async function listenLoadEvent() {
  unmutePlayerIfMuted();
}

async function unmutePlayerIfMuted() {
  console.log("unmutePlayerIfMuted");
  if (!isPlayerPage()) {
    return;
  }
  await sleep(2000);
  const muteUnmuteButton = document.querySelector(
    'button[data-a-target="player-mute-unmute-button"]',
  ) as HTMLButtonElement;
  const volumeSlider = document.querySelector(
    'input[data-a-target="player-volume-slider"]',
  ) as HTMLInputElement;
  if (!muteUnmuteButton || !volumeSlider) {
    return;
  }
  const isMuted = volumeSlider.value === "0";
  if (!isMuted) {
    return;
  }
  muteUnmuteButton.click();
  for (let i = 0; i < 10; i++) {
    simulateShiftArrowUp();
    await sleep(100);
  }
}

function isPlayerPage(): boolean {
  // "https://www.twitch.tv/myakkomyako" -> true
  // "https://www.twitch.tv/myakkomyako/videos" -> false
  return window.location.pathname.split("/").filter(Boolean).length === 1;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateShiftArrowUp() {
  const keyDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
    code: "ArrowUp",
    keyCode: 38,
    which: 38,
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  });

  const keyUpEvent = new KeyboardEvent("keyup", {
    key: "ArrowUp",
    code: "ArrowUp",
    keyCode: 38,
    which: 38,
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(keyDownEvent);
  document.dispatchEvent(keyUpEvent);
}

window.addEventListener("load", listenLoadEvent);
