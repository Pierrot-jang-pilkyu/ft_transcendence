import React, { useRef, useEffect, useState, useContext } from 'react';
import styles from "./Gaming.module.css"
import { GameContext, socket } from '../Utils';
import { useNavigate } from 'react-router-dom';
import ChattingRoom from '../ChattingRoom/ChattingRoom';
import AnnounceBar from '../AnnounceBar/AnnounceBar';
import BorderButton from '../../../components/BorderButton/BorderButton';

function Gaming() {
	const canvasRef = useRef(null);
	const [end, setEnd] = useState(0);
	const navigate = useNavigate();
	const [game, setGame] = useContext<any>(GameContext);
	const {isLeft, room } = game;
	const {score, option } = room;
	const start_ball = room.gameInfo.ball;

	useEffect(() => {
		const canvas:any = canvasRef.current;
		const width = 800;
		const height = 700;
		// 디스플레이 크기 설정 (css 픽셀)
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		// 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
		const dpr = window.devicePixelRatio;

		canvas.width =  width * dpr;
		canvas.height = height * dpr;

		// CSS에서 설정한 크기와 맞춰주기 위한 scale 조정

		const context = canvas.getContext("2d");
		context.scale(dpr, dpr);
		context.font = 	"bold 50px sans-serif";

		function moveUser(event:any) {
			const rect = canvas.getBoundingClientRect();
			socket.emit("PING", {bar: event.clientY - rect.top - 70, isLeft: isLeft})
		}

		function drawRect(x:number, y:number, w:number, h:number, color:string) {
			context.fillStyle = color;
			context.fillRect(x, y, w, h);
		}

		function drawCircle(x:number, y:number, r:number, color:string) {
			context.fillStyle = color;
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, false);
			context.closePath();
			context.fill();
		}

		const barSizeRatio = option.barSize / 5;
		const ballSizeRatio = option.ballSize / 5;

		const left = {
			x : 40,
			y : canvas.height/2 - 70,
			width : 16,
			height : 140 * barSizeRatio,
			color : "#397DFF",
		}
		
		const right = {
			x : width - 16 - 40,
			y : canvas.height/2 - 70,
			width : 16,
			height : 140 * barSizeRatio,
			color : "#FFB359",
		}
		
		const ball = {
			x : start_ball.x,
			y : start_ball.y,
			radius : 10 * ballSizeRatio,
			color : "white",
		}

		function render() {
			context.clearRect(0, 0, width, height)
			context.fillText(score.left, width/4, height/4);
			context.fillText(score.right, width/4 * 3 - 50, height/4);
			drawRect(0, height/2 - 1, width, 2, "#FFFFFF");
			drawRect(left.x, left.y, left.width, left.height, left.color);
			drawRect(right.x, right.y, right.width, right.height, right.color);
			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		}

		function renderPause()
		{
			context.fillStyle = "rgba(255, 255, 255, 0.6)";
			context.fillRect(0, 0, width, height);
		}


		//main
		canvas.addEventListener("mousemove", moveUser);
		render();
		if (game.room.stop == true)
		{
			socket.emit("RESUME");
			renderPause();
		}

		//socket_on
		socket.on("PONG", (data) => {
			ball.x = data.ball.x;
			ball.y = data.ball.y;
			left.y = data.left;
			right.y = data.right;
			render();
		});

		socket.on("SCORE", (data) => {
			score.left = data.left;
			score.right = data.right;
		})

		socket.on("END", (data) => {
			if (data.winnerIsLeft === isLeft)
				setEnd(1);
			else
				setEnd(2);
		})

		socket.on("PAUSE", ()=>{
			renderPause();
		})
		
		socket.on("RESUME", ()=>{
			render();
			console.log("resume");
		})

		return (()=>{
			socket.off("PONG");
			socket.off("SCORE");
			socket.off("END");
			socket.off("PAUSE");
			socket.off("RESUME");
		})

	}, []);

	function clickButton() {
		navigate("/Lobby");
	}

	return (
		<div className={`${styles.container}`}>
			{ !end && <canvas className={`${styles.canvas}`} ref={canvasRef}></canvas> }
			{ !end && <AnnounceBar/>}
			{ !end && <ChattingRoom isLeft={isLeft}/>}
			{ end == 1 && <div className={`${styles.end}`}>Win</div>}
			{ end == 2 && <div className={`${styles.end}`}>Lose</div>}
			{ end && <BorderButton title="BACK TO LOBBY" onClick={clickButton}/>}
		</div>
	);
}

export default Gaming;
