function Outside()
{
    const toggle: any = document.getElementById("menu");
    const menu: any = document.getElementById("main_nav");

    document.onclick = function (e: any) {
        if (e.target.id !== "toggle" && e.target.id !== "menu") {
            toggle.classList.remove("active");
            menu.classList.remove("active");
        }
    }
    
    return (
		<Outside />
	)
}

export default Outside;
