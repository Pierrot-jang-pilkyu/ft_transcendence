import { useEffect } from "react";
import { socket } from "../../../Utils";
import styles from "./Option.module.css"

function Option({option, name, author}:{option:{[index:string]:number, speed:number, ballSize:number, barSize:number}, name:string, author:boolean})
{
    function onLeft() {
        if (author && option[name] > 1)
        {
            socket.emit("OPTION", {[name]: option[name] - 1});
            console.log({[name]: option[name] + 1});
        }
    }

    function onRight() {
        if (author && option[name] < 9)
        {
            socket.emit("OPTION", {[name]: option[name] + 1});
            console.log({[name]: option[name] + 1});
        }
    }

    useEffect(()=>{console.log(author)})
    return (
        <div className={`${styles.container}`}>
            <div>{name.charAt(0).toUpperCase() + name.slice(1)}:</div>
            <div className={`${styles.select}`}>
                <button className={`${styles.button}`} onClick={onLeft}>&#60;</button>
                <div>{option[name]}</div>
                <button className={`${styles.button}`} onClick={onRight}>&#62;</button> 
            </div>
        </div>
    )

}

export default Option;
