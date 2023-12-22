import styles from "./Input.module.css"
import ChattingInputButton from "../../../../assets/ChattingInputButton.svg"
import { useState } from "react";
import { isOnlyBlank, socket } from "../../Utils";

function Input({setLogs, isLeft}:{setLogs:any, isLeft:boolean})
{
    const [text, setText] = useState<any>();

    function typeMessage(e:any) {
        setText(e.target.value);
    }

    function sendMessage()
    {
        if (isOnlyBlank(text))
            return ;
        socket.emit("MSG", text);
        setLogs( (prev:any) => [
            ...prev,
            { content: text, isUser: true, isLeft: isLeft}
        ]);
        setText('');
    }

    function pressEnter(e:any) {
        if (e.key == "Enter")
            sendMessage();
    }

    return (
        <div className={`${styles.container}`}>
            <input type="text" value={text} className={`${styles.input}`} onChange={typeMessage} onKeyPress={pressEnter} autoFocus></input>
            <button className={`${styles.button}`} onClick={sendMessage}>
                <img src={ChattingInputButton}></img>
            </button>
        </div>
    );
}

export default Input;
