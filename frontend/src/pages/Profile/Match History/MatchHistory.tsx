import styles from "./MatchHistory.module.css";
import HistoryTable from "./Table";

function MatchHistory(props: any) {
  return (
    <div className={`${styles.Historycontainer}`}>
      <div className={`${styles.Historytitle}`}>Match History</div>
      <HistoryTable id={props.id} />
    </div>
  );
}

export default MatchHistory;
