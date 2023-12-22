import styles from "./Header.module.css";

function Header() 
{
	return (
		<header className={`${styles.header}`}>
				<button className={`${styles.home} ${styles.button}`}>Deer Feer</button>
				{/* <button className={`${styles.logout} ${styles.button}`}>Logout</button> */}
		</header>
	);
}

export default Header;
