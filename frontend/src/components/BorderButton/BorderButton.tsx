import styles from "./BorderButton.module.css"

function BorderButton({title, onClick}:{title:string, onClick:any}) {

    return (
        <button className={`${styles.button}`} onClick={onClick}>{title}</button>
    )
}

export default BorderButton;
