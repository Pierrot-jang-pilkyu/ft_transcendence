import styles from "./Mode.module.css";
import Button from "./Button.tsx";
import Header from "../../../components/Header.tsx";
import Ball from "../../assets/img.png";

function Mode() {
  return (
    <div className={`${styles.background}`}>
      <img className={`${styles.img}`} src={Ball} />
      <Header />
      <div className={`${styles.main}`}>
        <div className={`${styles.title}`}>Select Mode</div>
        <Button name="Speed Mode" />
        <Button name="Ball Size Mode" />
        <Button name="Bar Size Mode" />
      </div>
    </div>
  );
}

export default Mode;
