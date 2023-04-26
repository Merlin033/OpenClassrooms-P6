import { clearModalContent } from "./modal1.js";
import { stopPropagation } from "./modal1.js";
import { addIconTo } from "./icones.js";

let modal = null;

export async function openModal2() {
	const target = document.createElement("aside");
	const modalWrapper = document.createElement("div");
	const modalTitle = document.createElement("h2");
	const modalBox = document.createElement("div");
	const modalFileInputWrapper = document.createElement("div");
	const modalButtonAdd = document.createElement("input");
	const modalLabelAdd = document.createElement("label");
	const modalPara = document.createElement("p");
	const modalForm = document.createElement("form");
	const modalLabelTitle = document.createElement("label");
	const modalLabelCat = document.createElement("label");
	const modalInputTitle = document.createElement("input");
	const modalInputCat = document.createElement("select");
	const modalOption1 = document.createElement("option");
	const modalOption2 = document.createElement("option");
	const modalOption3 = document.createElement("option");
	const modalButton = document.createElement("button");
	const modalBar = document.createElement("div");

	addIconTo("fa-solid", "fa-xmark", modalWrapper);
	addIconTo("fa-solid", "fa-arrow-left", modalWrapper);
	addIconTo("fa-regular", "fa-image", modalBox);

	target.classList.add("modal");
	modalWrapper.classList.add("modal-wrapper", "modal-content");
	modalTitle.classList.add("modal__title");
	modalBox.classList.add("modal__box");
	modalFileInputWrapper.classList.add("file-input-wrapper");
	modalButton.classList.add("modal__btn", "modal__btn--inactive");
	modalForm.classList.add("modal__form");
	modalLabelTitle.classList.add("modal__label");
	modalInputTitle.classList.add("modal__input");
	modalLabelCat.classList.add("modal__label");
	modalInputCat.classList.add("modal__input");
	modalBar.classList.add("modal__bar");

	target.appendChild(modalWrapper);
	document.body.prepend(target);
	modalWrapper.appendChild(modalTitle);
	modalWrapper.appendChild(modalBox);
	modalBox.appendChild(modalFileInputWrapper);
	modalFileInputWrapper.appendChild(modalButtonAdd);
	modalFileInputWrapper.appendChild(modalLabelAdd);
	modalBox.appendChild(modalPara);
	modalWrapper.appendChild(modalButton);
	modalWrapper.appendChild(modalForm);
	modalForm.appendChild(modalLabelTitle);
	modalForm.appendChild(modalInputTitle);
	modalForm.appendChild(modalLabelCat);
	modalForm.appendChild(modalInputCat);
	modalInputCat.appendChild(modalOption1);
	modalInputCat.appendChild(modalOption2);
	modalInputCat.appendChild(modalOption3);
	modalWrapper.appendChild(modalBar);
	modalWrapper.appendChild(modalButton);

	const xMark = document.querySelector(".fa-xmark");
	xMark.addEventListener("click", closeModal2);

	modalTitle.innerText = "Ajout photo";
	modalPara.innerText = "jpg. png: 4mo max";
	modalLabelAdd.textContent = "+ Ajouter photo";
	modalButton.textContent = "Valider";
	modalLabelTitle.textContent = "Titre";
	modalLabelCat.textContent = "Catégorie";
	modalOption1.textContent = "Objets";
	modalOption2.textContent = "Appartements";
	modalOption3.textContent = "Hôtels & restaurants";

	modalButtonAdd.setAttribute("id", "file-input");
	modalButtonAdd.setAttribute("name", "file-input");
	modalButtonAdd.setAttribute("type", "file");
	modalLabelAdd.setAttribute("for", "file-input");
	modalOption1.setAttribute("value", "1");
	modalOption2.setAttribute("value", "2");
	modalOption3.setAttribute("value", "3");

	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
	modal = target;
	modal.addEventListener("click", closeModal2);
	modalWrapper.addEventListener("click", stopPropagation);

	// ajoutez un gestionnaire d'événements pour le bouton "+ Ajouter photo"
	modalButtonAdd.addEventListener("click", () => {
		modalButtonAdd.click();
	});

	// ajoutez un gestionnaire d'événements pour le champ de saisie de fichier
	modalButtonAdd.addEventListener("change", (e) => {
		const file = e.target.files[0];
		modalBox.innerHTML = "";
		// faites quelque chose avec le fichier sélectionné, par exemple l'afficher dans la modale
		const img = document.createElement("img");
		img.classList.add("loaded-img");
		img.src = URL.createObjectURL(file);
		modalBox.appendChild(img);
		checkInputs();
	});

	modalInputTitle.addEventListener("input", checkInputs);
	modalInputCat.addEventListener("input", checkInputs);

	function checkInputs() {
		if (modalBox.querySelector("img") !== null && modalInputTitle.value !== "" && modalInputCat.value !== "") {
			modalButton.classList.remove("modal__btn--inactive");
		} else if (!modalButton.classList.contains("modal__btn--inactive")) {
			modalButton.classList.add("modal__btn--inactive");
		}
	}
	// ajoutez un gestionnaire d'événements pour le bouton "Valider"
	modalForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const img = modalButton.files[0];
		const title = modalInputTitle.value;
		const category = modalInputCat.value;

		// Vérifier si tous les champs sont remplis
		if (modalButton.classList.contains("modal__btn--inactive")) {
			return;
		}

		// Créer l'objet de données pour la requête POST
		const formData = new FormData();
		formData.append("image", img);
		formData.append("title", title);
		formData.append("category", category);

		try {
			// Envoyer la requête POST avec Fetch
			const response = await fetch("/url-de-votre-api", {
				method: "POST",
				body: formData,
			});

			// Vérifier si la requête a réussi
			if (!response.ok) {
				throw new Error("Erreur de serveur");
			}

			// Fermer la modale après l'ajout du nouveau travail
			closeModal2();

			// Mettre à jour la galerie avec le nouveau travail ajouté
			await displayWorks(allWorks);
		} catch (error) {
			console.error(error);
		}
	});
}
const closeModal2 = (e) => {
	clearModalContent();
	modal.remove();
};
