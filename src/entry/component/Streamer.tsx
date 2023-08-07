import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import { container } from "tsyringe";

import { InjectTokens } from "../../di/inject-tokens";
import { Streamer } from "../../domain/model/streamer";
import { Popup } from "../../domain/usecase/popup";

export default function Streamer(props: { streamer: Streamer }) {
  const popup = container.resolve<Popup>(InjectTokens.Popup);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    async function fetchIsAutoOpen() {
      const isAutoOpen = await popup.isAutoOpenUser(props.streamer.id);
      setIsChecked(isAutoOpen);
    }
    fetchIsAutoOpen();
  }, [props.streamer.id]);

  async function handleChange(checked: boolean) {
    setIsChecked(checked);
    await popup.setAutoOpenUser(props.streamer.id, checked);
  }

  return (
    <div key={props.streamer.id} className="mb-1 box-border flex w-full items-center gap-2 pr-8">
      <a
        href={makeStreamerUrl(props.streamer)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <img
          src={props.streamer.profileImageUrl}
          alt={props.streamer.name}
          className="h-8 w-8 rounded-full"
          loading="lazy"
        />
        <span className="w-30 overflow-hidden text-ellipsis whitespace-nowrap">
          {props.streamer.name}
        </span>
      </a>
      <Switch
        checked={isChecked}
        onChange={handleChange}
        onColor="#a0a0a0"
        onHandleColor="#5c16c5"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={14}
        width={32}
      />
    </div>
  );
}

function makeStreamerUrl(streamer: Streamer) {
  return `https://www.twitch.tv/${streamer.login}`;
}
