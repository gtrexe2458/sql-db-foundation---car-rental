
import checkAuth from "./checkAuth.js";

import carMap from "./carMap.js";

document.addEventListener("DOMContentLoaded", () => {

  let currentOffset = 0;
  const PAGE_LIMIT = 10;

  async function loadVehicles() {
    const searchInput = document.getElementById("searchCar");
    const displaySelect = document.getElementById("searchMode");
    const sortSelect = document.getElementById("sortBy");
    const carSeed = document.getElementById("carSeed");
    const prevBtn = document.getElementById("prevSeed");
    const nextBtn = document.getElementById("nextSeed");

    const query = searchInput ? searchInput.value.trim() : "";
    const mode = displaySelect ? displaySelect.value : "all"; // Get: "all" OR "my"
    const sortBy = sortSelect ? sortSelect.value : "vehicle_desc";

    if (carSeed) carSeed.innerHTML = "<p>Loading vehicles...</p>";

    try {
      const res = await fetch("/api/car/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
	credentials: "include",
        body: JSON.stringify({
          query: query,
	  mode: mode,
	  sortBy: sortBy,
          limit: PAGE_LIMIT,
          offset: currentOffset
        })
      });

      if (! checkAuth(res)) return;

      const responseData = await res.json();

      if (!responseData.success) {
        if (carSeed) carSeed.innerHTML = `<p>Error: ${responseData.error}</p>`;
        return;
      }

      const cars = responseData.data;

      if (carSeed) {
        if (cars.length === 0) {
          carSeed.innerHTML = "<p>No vehicles found.</p>";
        } else {

	  const isMyMode = String(mode).toLowerCase().includes("my");

          carSeed.innerHTML = carMap(cars, isMyMode);
        }
      }

      if (prevBtn) prevBtn.disabled = currentOffset === 0;
      if (nextBtn) nextBtn.disabled = cars.length < PAGE_LIMIT;

    } 

    catch (error) {
      console.error("Fetch error:", error.message);
      if (carSeed) carSeed.innerHTML = "<p>Failed to connect to server.</p>";
    }
  }




  // ===========================================
  // CLICK HANDLER (Edit Toggle, Cancel, Delete)
  // ===========================================
  document.getElementById("carSeed")?.addEventListener("click", async (e) => {

    const cardDiv = e.target.closest(".car-card");

    if (!cardDiv) return;

    const vehicleId = cardDiv.id;

    const editorForm = cardDiv.querySelector(".editorForm");

    // Open Edit Form
    if (e.target.classList.contains("toggle-edit-btn")) {

      if (editorForm) editorForm.style.display = "block";
    }

    // Hide Edit Form
    if (e.target.classList.contains("cancel-edit-btn")) {

      if (editorForm) editorForm.style.display = "none";
    }

    // Handle Delete
    if (e.target.classList.contains("delete-btn")) {

      if (confirm("Are you sure you want to delete this vehicle?")) {

        try {

          const res = await fetch("/api/car/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
	    credentials: "include",
            body: JSON.stringify({ vehicle_id: vehicleId })
          });

	  if (! checkAuth(res)) return;

          const data = await res.json();

          if (data.success) {

            loadVehicles();
          } 

	  else {

            alert("Error: " + (data.error || "Failed to delete"));
          }
        } 
	
	catch (err) {

          console.error("Delete request error:", err);
        }
      }
    }
  });




  // ================================
  // FORM SUBMIT HANDLER (Save Edits)
  // ================================
  document.getElementById("carSeed")?.addEventListener("submit", async (e) => {

    if (e.target.classList.contains("editorForm")) {

      e.preventDefault();

      const cardDiv = e.target.closest(".car-card");

      const vehicleId = cardDiv.id;

      const formData = new FormData(e.target);

      const payload = Object.fromEntries(formData.entries());

      payload.vehicle_id = vehicleId; // vehicle_id to payload

      try {

        const res = await fetch("/api/car/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
	  credentials: "include",
          body: JSON.stringify(payload)
        });

	if (! checkAuth(res)) return;

        const data = await res.json();

        if (data.success) {

          loadVehicles();
        } 

	else {

          alert("Update failed: " + (data.error || "Server error"));
        }
      } 

      catch (err) {

        console.error("Update request error:", err);
      }
    }
  });




async function logout() {

        try {

                const response =                                                                                      await fetch("/api/auth/logout", {
                                method: "POST"
                        });

		if(! checkAuth(response)) return;
                                                                                                              const data = await response.json();

                if (response.ok) {

                        document.body.innerHTML = "<h1>Logout Passed!</h1>";
                        window.location.href = "./login.html";
                }

                else {

                        alert(data.message || "Logout Failed!");
                }                                                                                     }

        catch (error) {

                alert(error.message);                                                                 }

        finally {

                window.location.href = './login.html';
        }
}




  document.getElementById("searchBtn")?.addEventListener("click", () => {

    currentOffset = 0;

    loadVehicles();
  });

  document.getElementById("resetSearch")?.addEventListener("click", () => {

    const input = document.getElementById("searchCar");

    if (input) input.value = "";

    currentOffset = 0;

    loadVehicles();
  });

  document.getElementById("searchMode")?.addEventListener("change", () => {

    currentOffset = 0;

    loadVehicles();
  });

  document.getElementById("sortBy")?.addEventListener("change", () => {

    currentOffset = 0;

    loadVehicles();
  });

  document.getElementById("prevSeed")?.addEventListener("click", () => {

    if (currentOffset >= PAGE_LIMIT) {

      currentOffset -= PAGE_LIMIT;

      loadVehicles();
    }
  });

  document.getElementById("nextSeed")?.addEventListener("click", () => {

    currentOffset += PAGE_LIMIT;

    loadVehicles();
  });

  document.getElementById("settings")?.addEventListener("click", () => {

    window.location.href = "./profile.html";
  });

  document.getElementById("logout")?.addEventListener("click", () => {

    logout();
  });

  loadVehicles();
});

