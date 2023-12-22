import { useContext, useEffect } from "react";
import { GameContext, socket } from "../Utils";

function FriendMatch({invite} : {invite:any})
{
    const [game, setGame] = useContext<any>(GameContext);

    useEffect(()=>{
        socket.on("LOAD", (data) => {
            setGame(data);
        });

        socket.emit("JOIN_GAME", invite);

        return (()=>{
            socket.off("LOAD");
        })
    }, [])

    return (
        <></>
    );
}

export default FriendMatch;
