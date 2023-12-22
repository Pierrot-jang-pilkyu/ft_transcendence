import styles from "./LoadingAnimation.module.css"

function LoadingAnimation() {
    return (
        <div className={`${styles.typing_indicator}`}>
                <div className={`${styles.typing_circle}`} />
                <div className={`${styles.typing_circle}`} />
                <div className={`${styles.typing_circle}`} />
                <div className={`${styles.typing_shadow}`} />
                <div className={`${styles.typing_shadow}`} />
                <div className={`${styles.typing_shadow}`} />
        </div>
    );
}

export default LoadingAnimation
