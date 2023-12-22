import styles from "./Avatar.module.css";
import ProfileImg from "../../../assets/img_Profile.png";
import { useNavigate } from "react-router-dom";


function Avatar(props:any) {
    const navigate = useNavigate();

    function onClick () {
        navigate(`/FriendProfile/${props.id}`);
    }

    function onClickMy () {
        navigate(`/MyProfile`);
    }

    // window.onload is optional since it depends on the way in which you fire events
    window.onload = function () {

        // selecting the elements for which we want to add a tooltip
        const target:any = document.getElementById("tooltip-avatar");
        const tooltip:any = document.getElementById("tooltip-text");

        console.log(target);
        console.log(tooltip);
        // change display to 'block' on mouseover
        target.addEventListener('mouseover', () => {
            console.log("mouseover");
            tooltip.style.display = 'block';
        }, false);
        
        // change display to 'none' on mouseleave
        target.addEventListener('mouseleave', () => {
            console.log("mouseleave");
            tooltip.style.display = 'none';
        }, false);

    }

    const avatarState = () => {
        const res = [];
        
        if (props.state == "0")
            res.push(<div className={`${styles.avatar_online}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "1")
            res.push(<div className={`${styles.avatar_online}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "2")
            res.push(<div className={`${styles.avatar_online}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "3")
            res.push(<div className={`${styles.avatar_online}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "4")
            res.push(<div className={`${styles.avatar_online}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "5")
            res.push(<div className={`${styles.avatar_playing}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);
        if (props.state == "6")
            res.push(<div className={`${styles.avatar_offline}`}><img id="tooltip-avatar" className={`${styles.avatar}`} src={props.img} onClick={props.flag ? onClickMy : onClick} /></ div>);

        return res;
    };

    return (
        <div className={`${styles.friend_container} ${styles.tooltip}`} data-tip={props.name} >
            {props.op && <img className={styles.op_crown} src="./src/assets/Chat_Avatar_crown.png" />}
            {avatarState()}
        </div>
    );
  }
  
  export default Avatar;
