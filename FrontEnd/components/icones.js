const selectIcon = (iconeFamily, iconeName) => {
	const icon = document.createElement("i");
	icon.classList.add(iconeFamily, iconeName);
	return icon;
};
/**
 *
 * @param {str} iconeFamily Ex: fa-regular
 * @param {str} iconeName Ex : fa-pen-to-square
 * @param {Element} element Choisir l'element parent de l'icone
 */
export const addIconTo = (iconeFamily, iconeName, element) => {
	const icon = selectIcon(iconeFamily, iconeName);
	element.appendChild(icon);
};
