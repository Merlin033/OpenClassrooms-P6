import { openModal2 } from "./modal2.js";
import { addIconTo } from "./icones.js";
import { getAllDatabaseInfo } from "../index.js";
import { init } from "../index.js";
import { displayWorks } from "../index.js";
let modal = null;

export async function openModal() {
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

	//Ouvrir une autre Modale
	modalButton.addEventListener("click", (e) => {
		closeModal();
		openModal2();
	});
}
export const closeModal = (e) => {
	clearModalContent();
	modal.remove();
};

export function clearModalContent() {
	const modalContent = document.querySelector(".modal-content");
	modalContent.innerHTML = "";
}
export const stopPropagation = (e) => e.stopPropagation();
