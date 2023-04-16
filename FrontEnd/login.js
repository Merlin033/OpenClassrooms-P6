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

		const data = await response.json();
		console.log("Data received:", data);
		const { userId, token } = data; // destructuration de l'objet, revient à dire : const userId = data.userId; const token = data.token;
		localStorage.setItem("token", token);
		window.location.href = "index.html";
	} catch (error) {
		console.error(error);
	}
});
