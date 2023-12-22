import styles from "./Mode.module.css"
import Option from "./Option/Option";
import { socket } from "../../Utils";
import BorderButton from "../../../../components/BorderButton/BorderButton";

function Mode({option, author, ready}:{option:{speed:number, ballSize:number, barSize:number}, author:boolean, ready:{left:boolean, right:boolean}})
{
    function clickReady()
    {
        socket.emit("READY");
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.title}`}>Mode Setting</div>
            <div className={`${styles.options}`}>
                {Object.keys(option).map(key=>(
                    <Option option={option} name={key} author={author}/>
                ))}
            </div>
            <BorderButton title="Ready" onClick={clickReady}/>
            <div className={`${styles.readyBar}`}>
                <div className={`${ (ready.left) ? styles.ready : styles.unready}`}>READY!</div>
                <div className={`${ (ready.right) ? styles.ready : styles.unready}`}>READY!</div>
            </div>
        </div>
    );
}

export default Mode;
