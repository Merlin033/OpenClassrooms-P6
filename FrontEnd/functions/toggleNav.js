export const toggleNavActiveClass = () => {
	const currentPage = window.location.pathname;
	const indexLink = document.getElementById("index");
	const loginLink = document.getElementById("login");

	indexLink.classList.remove("active");
	loginLink.classList.remove("active");

	if (currentPage.includes("index")) {
		indexLink.classList.add("active");
	} else if (currentPage.includes("login")) {
		loginLink.classList.add("active");
	}
};
