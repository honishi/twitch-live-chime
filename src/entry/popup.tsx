import "reflect-metadata";
import "../view/css/tailwind.css";

import React from "react";
import { createRoot, Root } from "react-dom/client";
import Select, { StylesConfig } from "react-select";
import { container } from "tsyringe";

import { InjectTokens } from "../di/inject-tokens";
import { configureDefaultContainer } from "../di/register";
import { InvalidTokenError, NoTokenError, NoUserIdError } from "../domain/model/error";
import { Stream as StreamModel } from "../domain/model/stream";
import { streamLanguages } from "../domain/model/stream-languages";
import { Streamer as StreamerModel } from "../domain/model/streamer";
import { Popup } from "../domain/usecase/popup";
import Stream from "./component/Stream";
import Streamer from "./component/Streamer";

const SUSPEND_BUTTON_ID = "suspend-button";

const roots: { [key: string]: Root } = {};

async function renderPage() {
  // Render
  await renderMenu();
  await renderTabs();
  await renderTrendingStreams();

  // Initial update
  await updateFollowingStreams();
}

async function renderMenu() {
  const popup = container.resolve<Popup>(InjectTokens.Popup);

  // Suspend button
  const suspendButton = document.getElementById(SUSPEND_BUTTON_ID) as HTMLButtonElement;
  suspendButton.onclick = async () => {
    await toggleSuspended();
    await updateSuspendButton();
  };
  await updateSuspendButton();

  // Reconnect button
  const reconnectButton = document.getElementById("reconnect-button") as HTMLButtonElement;
  reconnectButton.onclick = async () => {
    await popup.connectToTwitch();
  };

  // Refresh button
  const refreshButton = document.getElementById("refresh-button") as HTMLButtonElement;
  refreshButton.onclick = async () => {
    await refreshCurrentTab();
  };

  // Option button
  const optionButton = document.getElementById("option-button") as HTMLButtonElement;
  optionButton.onclick = () => {
    popup.openOptionsPage();
  };
}

async function renderTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const tabName = button.getAttribute("data-tab");
      if (tabName === null) {
        return;
      }

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      const tabContent = document.getElementById(tabName);
      if (tabContent === null) {
        return;
      }
      tabContent.classList.add("active");

      // update tab content only when the tab is not rendered yet
      if (tabName === "trending-streams" && !roots.trendingStreams) {
        await updateTrendingStreams();
      } else if (tabName === "auto-launch" && !roots.autoLaunchStreamers) {
        await updateAutoLaunch();
      }
    });
  });
}

async function renderTrendingStreams() {
  const selectContainer = document.getElementById("trending-select");
  if (selectContainer === null || roots.trendingSelect) {
    return;
  }

  const popup = container.resolve<Popup>(InjectTokens.Popup);
  const selectedLanguages = await popup.getTrendingLanguages();

  roots.trendingSelect = createRoot(selectContainer);
  roots.trendingSelect.render(
    <Select
      isMulti
      placeholder="Select Languages..."
      options={streamLanguages}
      defaultValue={streamLanguages.filter((language) =>
        selectedLanguages.includes(language.value),
      )}
      onChange={(selected) => {
        const values = selected.map((v: unknown) => (v as { value: string }).value);
        popup.setTrendingLanguages(values);
        updateTrendingStreams();
      }}
      className="mb-4 w-100"
      styles={makeReactSelectStylesConfig()}
    />,
  );
}

function makeReactSelectStylesConfig(): StylesConfig {
  const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const black = "#101010";
  const white = "#f0f0f0";
  const lightActive = "#5c16c5";
  const darkActive = "#bf94ff";

  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "#222" : white,
      borderColor: isDark ? "#333" : "#ddd",
      color: isDark ? white : black,
      minHeight: 36,
      fontSize: 12,
      boxShadow: "none",
      "&:hover": {
        borderColor: isDark ? darkActive : lightActive,
      },
    }),
    input: (base) => ({
      ...base,
      color: isDark ? white : black,
    }),
    valueContainer: (base) => ({
      ...base,
      gap: 4,
    }),
    clearIndicator: (base) => ({
      ...base,
      color: isDark ? "#888" : "#ccc",
      "&:hover": {
        color: isDark ? "#eee" : "#888",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark ? "#333" : "#ddd",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "#888" : "#ccc",
      "&:hover": {
        color: isDark ? "#eee" : "#888",
      },
    }),
    multiValue: (base) => ({
      ...base,
      color: isDark ? white : black,
      backgroundColor: "#ddd",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: black,
      "&:hover": {
        color: black,
        backgroundColor: darkActive,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? white : black,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? black : white,
      color: isDark ? white : black,
      border: `1px solid ${isDark ? "#333" : "#eee"}`,
      zIndex: 9999,
      fontSize: 12,
    }),
    option: (base, state) => {
      const isSelected = state.isSelected;
      const isFocused = state.isFocused;

      let backgroundColor = isDark ? black : white;
      let color = isDark ? white : black;

      if (isSelected) {
        backgroundColor = isDark ? darkActive : lightActive;
        color = isDark ? black : white;
      } else if (isFocused) {
        backgroundColor = isDark ? "#222" : "#ddd";
        color = isDark ? white : black;
      }

      return {
        ...base,
        backgroundColor,
        color,
        cursor: "pointer",
      };
    },
  };
}

async function updateFollowingStreams() {
  const streamsContainer = document.getElementById("following-streams-list");
  if (streamsContainer === null) {
    return;
  }
  if (!roots.followingStreams) {
    roots.followingStreams = createRoot(streamsContainer);
  }

  try {
    const popup = container.resolve<Popup>(InjectTokens.Popup);
    const streams = await popup.getFollowingStreams();
    // throw new NoTokenError();
    // const streams: StreamModel[] = [];
    if (streams.length === 0) {
      roots.followingStreams.render(<NoStreamsLabel />);
    } else {
      roots.followingStreams.render(<StreamGrid streams={streams} />);
    }
    await popup.setBadgeNumber(streams.length);
  } catch (e) {
    console.log(e);
    if (e instanceof NoTokenError || e instanceof NoUserIdError || e instanceof InvalidTokenError) {
      roots.followingStreams.render(<ConnectButton />);
    }
  }
}

function ConnectButton() {
  const popup = container.resolve<Popup>(InjectTokens.Popup);
  return (
    <div className="m-4 w-full py-10">
      <button
        className="cursor-pointer rounded-md bg-black px-6 py-2 text-white dark:bg-white dark:text-black"
        onClick={() => popup.connectToTwitch()}
      >
        <div className="flex items-center gap-2">
          <span className="material-icons">login</span>
          Connect to Twitch.
        </div>
      </button>
    </div>
  );
}

function NoStreamsLabel() {
  return (
    <div className="m-4 flex w-full items-center gap-2 py-10 text-sm">
      No live streams.
      <img src={randomNoStreamImage()} width="24" alt="No live streams" />
    </div>
  );
}

function randomNoStreamImage() {
  const imageFiles = ["../images/no_stream/resident_sleeper.png"];
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return imageFiles[randomIndex];
}

function StreamGrid({ streams }: { streams: StreamModel[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {streams.map((p) => (
        <Stream stream={p} key={p.id} />
      ))}
    </div>
  );
}

async function updateTrendingStreams() {
  const streamsContainer = document.getElementById("trending-streams-list");
  if (streamsContainer === null) {
    return;
  }
  if (!roots.trendingStreams) {
    roots.trendingStreams = createRoot(streamsContainer);
  }

  try {
    const popup = container.resolve<Popup>(InjectTokens.Popup);
    const selectedLanguages = await popup.getTrendingLanguages();
    const streams = await popup.getStreams(selectedLanguages);
    // throw new NoTokenError();
    // const streams: StreamModel[] = [];
    if (streams.length === 0) {
      roots.trendingStreams.render(<NoStreamsLabel />);
    } else {
      roots.trendingStreams.render(<StreamGrid streams={streams} />);
    }
  } catch (e) {
    console.log(e);
    if (e instanceof NoTokenError || e instanceof InvalidTokenError) {
      roots.trendingStreams.render(<ConnectButton />);
    }
  }
}

async function updateAutoLaunch() {
  const autoLaunchContainer = document.getElementById("auto-launch-list");
  if (autoLaunchContainer === null) {
    return;
  }
  if (!roots.autoLaunchStreamers) {
    roots.autoLaunchStreamers = createRoot(autoLaunchContainer);
  }

  try {
    const popup = container.resolve<Popup>(InjectTokens.Popup);
    const streamers = await popup.getFollowingStreamers();
    roots.autoLaunchStreamers.render(<AutoLaunchStreamerGrid streamers={streamers} />);
  } catch (e) {
    console.log(e);
  }
}

function AutoLaunchStreamerGrid({ streamers }: { streamers: StreamerModel[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {streamers.map((p) => (
        <Streamer streamer={p} key={p.id} />
      ))}
    </div>
  );
}

async function toggleSuspended() {
  const popup = container.resolve<Popup>(InjectTokens.Popup);
  const isSuspended = await popup.isSuspended();
  await popup.setSuspended(!isSuspended);
}

async function updateSuspendButton() {
  const popup = container.resolve<Popup>(InjectTokens.Popup);
  const isSuspended = await popup.isSuspended();
  const suspendIcon = document.getElementById("suspend-icon") as HTMLSpanElement;
  const suspendButton = document.getElementById(SUSPEND_BUTTON_ID) as HTMLButtonElement;
  suspendIcon.textContent = isSuspended ? "sensors_off" : "sensors";
  suspendButton.textContent = `Auto Launch: ${isSuspended ? "Off" : "On"}`;
}

async function refreshCurrentTab() {
  const tabName = document.querySelector(".tab-button.active")?.getAttribute("data-tab");
  if (tabName === null) {
    return;
  }
  if (tabName === "following-streams") {
    await updateFollowingStreams();
  } else if (tabName === "trending-streams") {
    await updateTrendingStreams();
  } else if (tabName === "auto-launch") {
    await updateAutoLaunch();
  }
}

function addEventListeners() {
  document.addEventListener("DOMContentLoaded", async () => {
    await renderPage();
  });
}

configureDefaultContainer();
addEventListeners();
