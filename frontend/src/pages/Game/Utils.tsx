import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET + "/games", {
    autoConnect: false,
	withCredentials: true,
});

export interface Player {
	id: number,
	name: string,
	status: number,
	avatar: string
}

export interface PingPongPlayer {
	player: Player,
	isReady: boolean,
	isPause: boolean,
	pause: number
}

export interface GameInfo {
	ball: { x: number, xv: number, y: number, yv: number}
	right: number,
	left: number
}

export interface GameRoom {
	roomId: string,
	left: PingPongPlayer,
	right: PingPongPlayer;  
	score: { left: number, right: number },
	option: { speed: number, ballSize: number, barSize: number },
	gameInfo: GameInfo
	stop: boolean
	start: boolean
}

export const GameContext = createContext(null);
export const GameModalContext = createContext(null);

export function isOnlyBlank(str) {
	const blank_pattern = /^\s+|\s+$/g;
	if(!str || str.replace(blank_pattern, '') == "" ){
		return true;
	}
	return false;
}
