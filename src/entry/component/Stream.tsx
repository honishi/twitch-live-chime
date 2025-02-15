import React from "react";

import { Stream } from "../../domain/model/stream";

const gridItemWidth = 200;

export default function Stream(props: { stream: Stream }) {
  const onClick = async function () {
    console.log("onclick");
    await chrome.tabs.create({ active: true, url: makeStreamLink(props.stream) });
  };
  return (
    <div className="mb-2">
      <a href="" onClick={onClick} className="block transition-transform hover:scale-[1.03]">
        {/* Thumbnail */}
        <Thumbnail
          imageUrl={props.stream.thumbnailUrl}
          viewerCount={props.stream.viewerCount}
          startedAt={props.stream.startedAt}
        />
        {/* Stream info */}
        <div className="flex overflow-hidden" style={{ maxWidth: `${gridItemWidth}px` }}>
          <ProfileImage imageUrl={props.stream.profileImageUrl} />
          {/* Stream text */}
          <div className="ml-2 flex min-w-0 flex-col">
            <Title title={props.stream.title} />
            <UserName userName={props.stream.userName} />
            <GameName gameName={props.stream.gameName} />
          </div>
        </div>
      </a>
    </div>
  );
}

function Thumbnail(props: { imageUrl: string; viewerCount: number; startedAt: Date }) {
  const imageHeight = gridItemWidth * (9 / 16); // video ratio
  return (
    <div
      className="relative mb-2 rounded-md bg-black/10 dark:bg-white/10"
      style={{ width: `${gridItemWidth}px`, height: `${imageHeight}px` }}
    >
      {/* Thumbnail */}
      <img
        src={updateImageSize(props.imageUrl, gridItemWidth, imageHeight)}
        width={gridItemWidth}
        height={imageHeight}
        loading="lazy"
        alt=""
        className="rounded-md"
      />
      {/* Badges */}
      <span className="py-0.1 absolute top-1 left-1 rounded-sm bg-red-600 px-1 font-bold text-white">
        LIVE
      </span>
      <span className="py-0.1 absolute top-1 right-1 flex items-center gap-1 rounded-sm bg-black/70 px-1 text-white">
        <span className="material-icons">people</span> {props.viewerCount.toLocaleString()}
      </span>
      <span className="py-0.1 absolute right-1 bottom-1 flex items-center gap-1 rounded-sm bg-black/70 px-1 text-white">
        <span className="material-icons">schedule</span> {makeElapsedTime(props.startedAt)}
      </span>
    </div>
  );
}

function ProfileImage(props: { imageUrl?: string }) {
  return (
    <div className="w-10 min-w-10">
      <img src={props.imageUrl} alt={props.imageUrl} className="rounded-full" />
    </div>
  );
}

function Title(props: { title: string }) {
  return (
    <div className="line-clamp-2 overflow-hidden text-sm font-bold break-words text-ellipsis">
      {props.title}
    </div>
  );
}

function UserName(props: { userName: string }) {
  return <div className="text-sm">{props.userName}</div>;
}

function GameName(props: { gameName: string }) {
  if (props.gameName.length === 0) {
    return null;
  }
  return (
    <div>
      <span className="mt-1 inline-block max-w-full truncate rounded bg-black/10 px-2 py-0.5 text-xs text-black dark:bg-white/10 dark:text-white">
        {props.gameName}
      </span>
    </div>
  );
}

function makeStreamLink(stream: Stream) {
  return `https://www.twitch.tv/${stream.userLogin}`;
}

function updateImageSize(imageUrl: string, width: number, height: number) {
  // https://static-cdn.jtvnw.net/previews-ttv/live_user_220ninimaru-{width}x{height}.jpg
  const widthStr = (width * 2).toString();
  const heightStr = (height * 2).toString();
  const url = imageUrl.replace("{width}", widthStr).replace("{height}", heightStr);
  return url;
}

function makeElapsedTime(startedAt: Date) {
  const now = new Date();
  const elapsedTime = now.getTime() - startedAt.getTime();
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
