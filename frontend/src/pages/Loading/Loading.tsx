import Header from "../../components/Header";
import styles from "./Loading.module.css"


function Loading()
{
    return (
        <div className={`${styles.background}`}>
            <Header pageFlag={1}/>
        </div>
    )
}

export default Loading;
