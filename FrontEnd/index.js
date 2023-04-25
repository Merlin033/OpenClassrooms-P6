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
			a.addEventListener("click", (e) => {
				e.preventDefault();
				openModal();
			});
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

		figure.setAttribute("data-id", work.id);

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

async function openModal() {
	const target = document.createElement("aside");
	const modalWrapper = document.createElement("div");
	const modalTitle = document.createElement("h2");
	const modalGrid = document.createElement("div");
	const modalButton = document.createElement("button");
	const modalDelete = document.createElement("a");
	addIconTo("fa-solid", "fa-xmark", modalWrapper);

	target.classList.add("modal");
	modalWrapper.classList.add("modal-wrapper", "modal-content");
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

	const xMark = document.querySelector(".fa-xmark");
	xMark.addEventListener("click", closeModal);

	modalTitle.innerText = "Galerie Photo";
	modalButton.textContent = "Ajouter une photo";
	modalDelete.innerText = "Supprimer la galerie";

	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
	modal = target;
	modal.addEventListener("click", closeModal);
	modalWrapper.addEventListener("click", stopPropagation);

	const allWorks = await getAllDatabaseInfo("works");
	displayWorks(modalGrid, allWorks);

	const figures = document.querySelectorAll(".modal__grid > figure");

	for (const fig of figures) {
		fig.classList.add("fig");
	}
	// Changer le texte des figcaptions pour "éditer"
	function changeFigcaption() {
		const figcaption = document.querySelectorAll(".fig > figcaption");
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
	// Cocher / Decocher les corbeilles
	const iconTrashes = document.querySelectorAll(".fa-trash-can");

	for (const trash of iconTrashes) {
		trash.addEventListener("click", () => {
			trash.classList.toggle("trash--active");
		});
	}

	//Supression des travaux

	const deleteLink = document.querySelector(".modal__delete");

	deleteLink.addEventListener("click", (event) => {
		event.preventDefault();
		const selectedWorks = getSelectedWorks();

		if (selectedWorks.length === 0) {
			alert("Veuillez sélectionner au moins un projet");
		} else {
			const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer les travaux sélectionnés ?");

			if (confirmDelete) {
				deleteWorks(selectedWorks);
			}
		}
	});

	function getSelectedWorks() {
		const selectedWorks = [];

		const works = document.querySelectorAll(".modal__grid > figure");

		for (const work of works) {
			const checkbox = work.querySelector("i");
			if (checkbox.classList.contains("trash--active")) {
				selectedWorks.push(work.dataset.id);
			}
		}
		return selectedWorks;
	}

	async function deleteWorks(workIds) {
		for (const workId of workIds) {
			const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				console.log(`Work with ID ${workId} has been deleted`);
			} else {
				console.error(`Failed to delete work with ID ${workId}`);
			}
		}
		closeModal();
		const allWorks = await getAllDatabaseInfo("works");
		displayWorks(gallery, allWorks);
	}
}

const closeModal = (e) => {
	if (modal === null) return;

	clearModalContent();
	modal.remove();
};

function clearModalContent() {
	const modalContent = document.querySelector(".modal-content");
	modalContent.innerHTML = "";
}
const stopPropagation = (e) => e.stopPropagation();
