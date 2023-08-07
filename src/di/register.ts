import { container } from "tsyringe";

import { BackgroundImpl } from "../domain/usecase/background";
import { OptionImpl } from "../domain/usecase/option";
import { PopupImpl } from "../domain/usecase/popup";
import { BrowserApiImpl } from "../infra/browser-api";
import { MessagingPortImpl, MessagingServiceImpl } from "../infra/service/messaging";
import { TwitchApiImpl } from "../infra/twitch-api";
import { InjectTokens } from "./inject-tokens";

export function configureDefaultContainer() {
  container.register(InjectTokens.Background, { useClass: BackgroundImpl });
  container.register(InjectTokens.BrowserApi, { useClass: BrowserApiImpl });
  container.register(InjectTokens.MessagingService, { useClass: MessagingServiceImpl });
  container.register(InjectTokens.MessagingPort, { useClass: MessagingPortImpl });
  container.register(InjectTokens.TwitchApi, { useClass: TwitchApiImpl });
  container.register(InjectTokens.Option, { useClass: OptionImpl });
  container.register(InjectTokens.Popup, { useClass: PopupImpl });
}
