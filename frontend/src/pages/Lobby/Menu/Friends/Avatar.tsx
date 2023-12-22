import styles from "./Avatar.module.css";
import ProfileImg from "../../../assets/img_Profile.png";
import { useNavigate } from "react-router-dom";


function Avatar(props:any) {

    const navigate = useNavigate();

    function onClick () {
        navigate(`/FriendProfile/${props.id}`);
    }

    const avatarState = () => {
        const res = [];
        
        if (props.state == "0")
            res.push(<div className={`${styles.avatar_online}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "1")
            res.push(<div className={`${styles.avatar_online}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "2")
            res.push(<div className={`${styles.avatar_online}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "3")
            res.push(<div className={`${styles.avatar_online}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "4")
            res.push(<div className={`${styles.avatar_online}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "5")
            res.push(<div className={`${styles.avatar_playing}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);
        if (props.state == "6")
            res.push(<div className={`${styles.avatar_offline}`}><img className={`${styles.avatar}`} src={props.img} onClick={onClick} /></ div>);


        return res;
    };

    return (
        <button className={`${styles.friend_container}`} onClick={onClick} >
            {/* <div className={`${styles.avatar_online}`}>
                <img className={`${styles.avatar}`} src={props.img} />
            </div> */}
            {avatarState()}
            <div className={styles.friend_font}>{props.name}</div>
        </button>
    );
  }
  
  export default Avatar;
