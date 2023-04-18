import { addIconTo } from "./icones.js";
/**
 *
 * @param {Element} parentElement Element du DOM
 * @param {AppendMode} where prepend ou appendChild
 */
export const addEditLinkTo = (parentElement, where) => {
	const editLink = document.createElement("a");
	const textLink = document.createElement("p");
	textLink.innerText = "modifier";
	editLink.appendChild(textLink);
	editLink.classList.add("link-modal");
	addIconTo("fa-regular", "fa-pen-to-square", editLink);
	if (parentElement.tagName === "H2") {
		editLink.classList.add("h2-edit-link");
	} else if (parentElement.tagName === "ARTICLE") {
		editLink.classList.add("article-edit-link");
	} else if (parentElement.tagName === "FIGURE") {
		editLink.classList.add("figure-edit-link");
	}
	if (where === "appendChild") {
		parentElement.appendChild(editLink);
	} else if (where === "prepend") {
		parentElement.prepend(editLink);
	}
};
