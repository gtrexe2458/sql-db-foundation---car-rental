
document.addEventListener("DOMContentLoaded", () => {

let email, password;

async function handleSubmit(e) {
        e.preventDefault();

        try {

                const response =
                        await fetch("/api/auth/login", {
                                method: "POST",
                                headers: {"Content-Type": "application/json" },
                                body: JSON.stringify({
                                        email: email,
                                        password: password
                                })
                        });

                const data = await response.json();

//alert("Status: " + response.status + "\nResponse: " + JSON.stringify(data));

                if (! response.ok) {

                        document.getElementById("msg").innerText =
                                data.message || data.error;
                        return;
                }

		if (data.token) {
			
			localStorage.setItem('token', data.token);
		}

                if (data.user) {

			localStorage.setItem('user', JSON.stringify(data.user));
		}

                document.getElementById("msg").innerText = data.message;

		window.location.href = "./searchCar.html";
        }

        catch (error) {

                document.getElementById("msg").innerText = error.message;
        }
}




document.getElementById("loginForm").addEventListener("submit", handleSubmit);

document.getElementById("email").addEventListener("input", (e) => {

        email = e.target.value;
});

document.getElementById("password").addEventListener("input", (e) => {

        password = e.target.value;
});

});
