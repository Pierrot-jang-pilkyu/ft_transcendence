import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

function Header() 
{
	const navigate = useNavigate();

	const handlerButton = () => {
		navigate('/Lobby')
	};


	return (
		<header className={`${styles.background}`}>
			<div className={`${styles.container}`}>
				<button className={`${styles.home} ${styles.button}`} onClick={handlerButton}>Deer Feer</button>
			</div>
		</header>
	);
}

export default Header;
