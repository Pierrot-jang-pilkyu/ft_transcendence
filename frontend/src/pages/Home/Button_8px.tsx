import styles from "./Button_8px.module.css";

function Button(props: any) {
  const url =
    import.meta.env.VITE_AUTH;
  return (
    <a href={url} className={styles.button}>
      {props.name}
    </a>
  );
}

export default Button;
