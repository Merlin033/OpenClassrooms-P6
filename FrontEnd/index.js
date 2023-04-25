import { createBanner } from "./components/banner.js";
import { addIconTo } from "./components/icones.js";
import { addEditLinkTo } from "./components/modalLink.js";
import { toggleNavActiveClass } from "./functions/toggleNav.js";

const gallery = document.querySelector(".gallery");
const categoriesList = document.querySelector(".categories");
const allWorks = new Set();
const allCat = new Set();
const token = localStorage.getItem("token");

let modal = null;

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
	displayWorks(gallery);
	toggleNavActiveClass();

	if (token) {
		createBanner();

		const login = document.querySelector("#login");

		const introH2 = document.querySelector("#introduction article");
		const porteFolioH2 = document.querySelector("#portfolio h2");
		const imgProfil = document.querySelector("#introduction figure");

		login.firstElementChild.textContent = "logout";
		login.addEventListener("click", () => localStorage.clear());

		addEditLinkTo(introH2, "prepend");
		addEditLinkTo(imgProfil, "appendChild");
		addEditLinkTo(porteFolioH2, "appendChild");

		// On ouvre la modale en appelant la fonction openModal
		document.querySelectorAll(".modal-link").forEach((a) => {
			a.addEventListener("click", openModal);
		});
	} else {
		displayFilter();
	}
}
init();

function displayWorks(container, works = allWorks) {
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
	container.innerHTML = "";
	container.appendChild(fragment);
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
				displayWorks(gallery);
			} else {
				const filtredWorks = [...allWorks].filter((work) => work.categoryId == categoryId);
				displayWorks(gallery, filtredWorks);
			}
		});
	}
}
//**************** LOG IN *******************************************************/

console.log(token);

// ****************** MODAL *****************/

const openModal = (e) => {
	e.preventDefault();

	const target = document.createElement("aside");
	const modalWrapper = document.createElement("div");
	const modalTitle = document.createElement("h2");
	const modalGrid = document.createElement("div");
	const modalButton = document.createElement("button");
	const modalDelete = document.createElement("a");

	addIconTo("fa-solid", "fa-xmark", modalWrapper);

	target.classList.add("modal");
	modalWrapper.classList.add("modal-wrapper");
	modalTitle.classList.add("modal__title");
	modalGrid.classList.add("modal__grid");
	modalButton.classList.add("modal__btn");
	modalDelete.classList.add("modal__delete");

	target.appendChild(modalWrapper);
	document.body.prepend(target);
	modalWrapper.appendChild(modalTitle);
	modalWrapper.appendChild(modalGrid);
	modalWrapper.appendChild(modalButton);
	modalWrapper.appendChild(modalDelete);

	modalTitle.innerText = "Galerie Photo";
	modalButton.textContent = "Ajouter une photo";
	modalDelete.innerText = "Supprimer la galerie";

	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
	modal = target;
	modal.addEventListener("click", closeModal);
	modalWrapper.addEventListener("click", stopPropagation);

	displayWorks(modalGrid);
	const figures = document.querySelectorAll("figure");

	function changeFigcaption() {
		const figcaption = document.querySelectorAll("figcaption");
		for (const fig of figcaption) {
			fig.textContent = "éditer";
			fig.classList.add("modal__grid__figure--edit");
		}
	}
	changeFigcaption();
	function addIconToFig(figures) {
		for (const fig of figures) {
			addIconTo("fa-regular", "fa-trash-can", fig);
		}
	}
	addIconToFig(figures);
};

const closeModal = (e) => {
	if (modal === null) return;
	e.preventDefault();
	modal.remove();
};

const stopPropagation = (e) => e.stopPropagation();
