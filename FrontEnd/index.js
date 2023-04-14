const gallery = document.querySelector(".gallery");
const categoriesList = document.querySelector(".categories");
let works = [];
const allWorks = new Set();
const allCat = new Set();

async function getAllDatabaseInfo(type) {
	const response = await fetch("http://localhost:5678/api/" + type);
	if (response.ok) {
		return response.json();
	} else {
		console.log(response);
	}
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
}
init();

function displayFilter() {
	const allOption = document.createElement("li");
	allOption.textContent = "Tous";
	allOption.setAttribute("data-category-id", "0");
	allOption.classList.add("active");
	categoriesList.appendChild(allOption);
	allCat.forEach((category) => {
		const li = document.createElement("li");
		li.setAttribute("data-category-id", category.id);
		li.textContent = category.name === "Hotels & restaurants" ? "Hôtels & restaurants" : category.name;
		categoriesList.appendChild(li);
	});
	setFilterListener();
}

function setFilterListener() {
	const categoryItems = document.querySelectorAll(".categories li");
	categoryItems.forEach((item) => {
		item.addEventListener("click", (e) => {
			// On retire la classe "active" de l'élément actif
			const clickedItem = e.target;
			document.querySelector(".active").classList.remove("active");

			// On ajoute la classe "active" à l'élément cliqué
			clickedItem.classList.add("active");

			// On filtre les travaux en fonction de la catégorie sélectionnée
			const categoryId = parseInt(clickedItem.getAttribute("data-category-id"));
			if (categoryId == 0) {
				displayWorks();
			} else {
				const filtredWorks = [...allWorks].filter((work) => work.categoryId == categoryId);
				displayWorks(filtredWorks);
			}
		});
	});
}
// Récupération des travaux
/*fetch("http://localhost:5678/api/works")
	.then((response) => response.json())
	.then((data) => {
		works = data;
		displayWorks(works);
	})
	.catch((error) => console.error(error));

// Récupération des catégories et affichage dans la liste
fetch("http://localhost:5678/api/categories")
	.then((response) => response.json())
	.then((categories) => {
		const uniqueCategories = new Set(categories.map((category) => category.name));
		const allOption = document.createElement("li");
		allOption.textContent = "Tous";
		allOption.setAttribute("data-category-id", "all");
		allOption.classList.add("active");
		categoriesList.appendChild(allOption);
		uniqueCategories.forEach((category) => {
			const li = document.createElement("li");
			li.setAttribute("data-category-id", category === "Hotels & restaurants" ? "Hôtels & restaurants" : category);
			li.textContent = category === "Hotels & restaurants" ? "Hôtels & restaurants" : category;
			categoriesList.appendChild(li);
		});
	})
	.then(() => {
		// Ajout d'un événement de clic à chaque élément de la liste des catégories
		const categoryItems = document.querySelectorAll(".categories li");
		categoryItems.forEach((item) => {
			item.addEventListener("click", () => {
				// On retire la classe "active" de l'élément actif
				const activeItem = document.querySelector(".categories li.active");
				activeItem.classList.remove("active");

				// On ajoute la classe "active" à l'élément cliqué
				item.classList.add("active");

				// On filtre les travaux en fonction de la catégorie sélectionnée
				const categoryId = item.getAttribute("data-category-id");
				const filteredWorks = filterWorksByCategory(works, categoryId);

				// On affiche les travaux filtrés dans la galerie
				displayWorks(filteredWorks);
			});
		});
	})
	.catch((error) => console.error(error));*/

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works = allWorks) {
	gallery.innerHTML = "";
	for (const work of works) {
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		const figcaption = document.createElement("figcaption");

		img.src = work.imageUrl;
		img.alt = work.title;
		figcaption.textContent = work.title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		gallery.appendChild(figure);
	}
}

/*
// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(works, categoryId) {
	if (categoryId === 0) {
		return works;
	} else {
		return works.filter((work) => work.categoryId == categoryId);
	}
}*/
