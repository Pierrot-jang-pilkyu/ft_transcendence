import styles from "./UserRanking.module.css";

function UserRanking(props: any) {
  return (
    <div className={`${styles.userRanking_container}`}>
      <div className={`${styles.userRanking_rank}`}>{props.rank}</div>
      <div className={`${styles.userRanking_nickname}`}>{props.nickname}</div>
      <div className={`${styles.userRanking_lose}`}>{props.score}</div>
    </div>
  );
}

export default UserRanking;
