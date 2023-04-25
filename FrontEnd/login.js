import { toggleNavActiveClass } from "./functions/toggleNav.js";

const loginForm = document.querySelector("#login form");

loginForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = loginForm.email.value;
	const password = loginForm.password.value;

	const user = {
		email,
		password,
	};

	try {
		const response = await fetch("http://localhost:5678/api/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(user),
		});

		if (!response.ok) {
			throw new Error(response.status);
		}

		const data = await response.json();
		console.log("Data received:", data);
		const { userId, token } = data; // destructuration de l'objet, revient à dire : const userId = data.userId; const token = data.token;
		localStorage.setItem("token", token);
		window.location.href = "index.html";
	} catch (error) {
		if (error.message === "404") {
			alert("Adresse email ou mot de passe incorrect.");
		} else {
			console.error(error);
		}
	}
});

toggleNavActiveClass();
