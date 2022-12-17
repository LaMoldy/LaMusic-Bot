import { Pause } from "../events/commands/pause";
import { Ping } from "../events/commands/ping";
import { Play } from "../events/commands/play";
import { Resume } from "../events/commands/resume";
import { Skip } from "../events/commands/skip";
import { Stop } from "../events/commands/stop";
import { Command } from "./command";

export const Commands: Command[] = [Ping, Play, Stop, Pause, Resume, Skip];
