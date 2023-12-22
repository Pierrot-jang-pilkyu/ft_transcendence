import styles from "./GameModal.module.css"

function GameModal({ title, content, leftButton}
    :{ title:any, content:any, leftButton:{title:string, onClick:any} })
{
    return (
        <div className={`${styles.popup_wrap}`}>
            <div className={`${styles.popup}`}>
                <div className={`${styles.logo}`}>{title}</div>
                <div className={`${styles.logoline}`} />
                <div className={`${styles.content_container}`}>
                    {content}
                </div>
                <div className={`${styles.button_container}`}>
                <button className={`${styles.button_close}`} onClick={leftButton.onClick} disabled={leftButton.onClick ? false : true}>
                    {leftButton.title}
                </button>
                </div>
            </div>
        </div>
    )
}

export default GameModal;
