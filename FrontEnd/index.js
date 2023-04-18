import { createBanner } from "./components/banner.js";
import { addEditLinkTo } from "./components/modal.js";

const gallery = document.querySelector(".gallery");
const categoriesList = document.querySelector(".categories");
const allWorks = new Set();
const allCat = new Set();

async function getAllDatabaseInfo(type) {
	const response = await fetch("http://localhost:5678/api/" + type);
	return response.ok ? response.json() : console.log(response);
}

async function init() {
	const works = await getAllDatabaseInfo("works");
	for (const work of works) {
		allWorks.add(work);
	}
	const categories = await getAllDatabaseInfo("categories");
	for (const category of categories) {
		allCat.add(category);
	}
	displayWorks();
	displayFilter();
	toggleNavActiveClass();
}
init();

function displayWorks(works = allWorks) {
	const fragment = document.createDocumentFragment();
	for (const work of works) {
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		const figcaption = document.createElement("figcaption");

		img.src = work.imageUrl;
		img.alt = work.title;
		figcaption.textContent = work.title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		fragment.appendChild(figure);
	}
	gallery.innerHTML = "";
	gallery.appendChild(fragment);
}

function displayFilter() {
	const allOption = document.createElement("li");
	allOption.textContent = "Tous";
	allOption.setAttribute("data-category-id", "0");
	allOption.classList.add("active");
	categoriesList.appendChild(allOption);
	for (const category of allCat) {
		const li = document.createElement("li");
		li.setAttribute("data-category-id", category.id);
		li.textContent = category.name === "Hotels & restaurants" ? "Hôtels & restaurants" : category.name;
		categoriesList.appendChild(li);
	}
	setFilterListener();
}

function setFilterListener() {
	const categoryItems = document.querySelectorAll(".categories li");
	for (const item of categoryItems) {
		item.addEventListener("click", (e) => {
			const clickedItem = e.target;
			document.querySelector(".active").classList.remove("active");
			clickedItem.classList.add("active");
			const categoryId = parseInt(clickedItem.getAttribute("data-category-id"));
			if (categoryId == 0) {
				displayWorks();
			} else {
				const filtredWorks = [...allWorks].filter((work) => work.categoryId == categoryId);
				displayWorks(filtredWorks);
			}
		});
	}
}
//**************** LOG IN *******************************************************/
const token = localStorage.getItem("token");
console.log(token);
if (token) {
	createBanner();

	const login = document.querySelector("#login");

	const introH2 = document.querySelector("#introduction article");
	const porteFolioH2 = document.querySelector("#portfolio h2");
	const imgProfil = document.querySelector("#introduction figure");

	login.textContent = "logout";

	addEditLinkTo(introH2, "prepend");
	addEditLinkTo(imgProfil, "appendChild");
	addEditLinkTo(porteFolioH2, "appendChild");
}

//Fonction pour indiquer en gras sur quelle page on se trouve
const toggleNavActiveClass = () => {
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

// ****************** MODAL *****************/
const openModal = function (e) {
	e.preventDefault();

	const targetId = e.currentTarget.dataset.target;
	const modal = document.createElement("aside");
	const modalWrapper = document.createElement("div");
	modal.setAttribute("id", targetId);
	modal.classList.add("modal");
	modalWrapper.classList.add("modal-wrapper");

	modal.appendChild(modalWrapper);
	document.body.prepend(modal);

	const target = document.getElementById(targetId);

	target.style.display = null;
	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
};
document.querySelectorAll(".link-modal").forEach((a) => {
	a.addEventListener("click", openModal);
});
