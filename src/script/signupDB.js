
document.addEventListener("DOMContentLoaded", () => {



// ✅ scope variables
let valid = false;
let username = "";
let email = "";
let contact = "";
let license = "";
let id = "";
let country ="";
let password = "";

function validPass() {                                                             
        const log = document.querySelector('#passLog').querySelectorAll("input");

        log[0].checked = password.length >= 8;

        log[1].checked = /[A-Z]/.test(password);

        log[2].checked = /[a-z]/.test(password);                                                                                                                              log[3].checked = /[0-9]/.test(password);

        valid =
                log[0].checked &&
                log[1].checked &&
                log[2].checked &&
                log[3].checked;

}

async function handleSubmit(e) {

        e.preventDefault();

        if (! valid)
                return;

        try {

                const response =
                        await fetch("/api/auth/signup", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        name: username,
                                        email: email,
					contact: contact,
					license: license,
					id: id,
					country: country,
                                        password: password
                                })
                        });

                const data = await response.json();

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

		// Give user 1 second to read
                setTimeout(() => {
    
			window.location.href = "./searchCar.html";
                }, 
		999);
        }

        catch (error) {

                document.getElementById("msg").innerText = error.message;
        }

}




document.getElementById("signupForm").addEventListener("submit", handleSubmit);

document.getElementById("username").addEventListener("input", (e) => {

        username = e.target.value;
});

document.getElementById("email").addEventListener("input", (e) => {

        email = e.target.value;
});

document.getElementById("contact").addEventListener("input", (e) => {

        contact = e.target.value;
});

document.getElementById("id").addEventListener("input", (e) => {

        id = e.target.value;
});

document.getElementById("country").addEventListener("input", (e) => {

        country = e.target.value;
});

document.getElementById("password").addEventListener("input", (e) => {

        password = e.target.value;

        validPass();
});

});

