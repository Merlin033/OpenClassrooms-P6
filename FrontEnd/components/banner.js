import { addIconTo } from "./icones.js";
export const createBanner = () => {
	const editBanner = document.createElement("div");
	editBanner.classList.add("edit-banner"); // Ajoute une classe CSS pour styliser l'élément

	addIconTo("fa-regular", "fa-pen-to-square", editBanner);

	const editText = document.createElement("span");
	editText.textContent = "Mode édition"; // Ajoute le texte "Mode édition"
	editBanner.appendChild(editText);

	const publishButton = document.createElement("button");
	publishButton.textContent = "Publier les changements"; // Ajoute le bouton "publier les changements"
	// publishButton.addEventListener("click", publishChanges); // Ajoute un écouteur d'événements pour déclencher l'action de publication des changements
	editBanner.appendChild(publishButton);

	document.body.prepend(editBanner); // Ajoute l'élément à la fin du corps du document
};
