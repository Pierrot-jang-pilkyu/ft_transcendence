import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Loading()
{
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    

    function onChangeId(e:any)
    {
        setUserId(e.target.value);
    } 

    function enter() {
        navigate("/Chatting", {state: userId});
    }

    return (
        <div>
            userId: <input id="channel" type="text" onChange={onChangeId}/>
            <button onClick={enter}>enter room</button>
        </div>
    );
}

export default Loading;
