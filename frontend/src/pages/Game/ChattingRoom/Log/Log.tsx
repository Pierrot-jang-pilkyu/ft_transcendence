import styles from "./Log.module.css"
import { isOnlyBlank } from "../../Utils";

function Log({logs, left, right} : {logs:any, left:any, right:any})
{ 
    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.nameBar}`}>
                <div>{left}</div>
                <div>{right}</div>
            </div>
            <div className={`${styles.logs}`}>
                {logs.slice(0).reverse().map(log => (
                    !isOnlyBlank(log.content) && <div className={`${styles.chatBox} ${log.isUser ? styles.user : styles.opposite} ${log.isLeft ? styles.left : styles.right}`}>{log.content}</div>
                ))}
            </div>
        </div>
    )
}

export default Log;
