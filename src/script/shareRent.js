
import checkAuth from "./checkAuth.js";

function formatDropboxUrl(url) {
  if (!url) return "";
  
  let formattedUrl = url.trim();

  if (formattedUrl.includes("dropbox.com")) {
    // Replace ?dl=0 or &dl=0 with raw=1
    formattedUrl = formattedUrl
      .replace(/\?dl=0$/, "?raw=1")
      .replace(/&dl=0$/, "&raw=1");

    // If no dl parameter existed at all, append ?raw=1
    if (!formattedUrl.includes("raw=1")) {
      formattedUrl += formattedUrl.includes("?") ? "&raw=1" : "?raw=1";
    }

    // Convert domain for direct serving
    formattedUrl = formattedUrl.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }

  return formattedUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("carForm") || document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents page refresh on submit

    const getValue = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    // Parse speed and compute unit conversion
    const rawSpeed = parseFloat(getValue("top_speed"));
    const unit = getValue("speedUnit"); // "kmh" or "mph"

    let topSpeedKmh = null;
    let topSpeedMph = null;

    if (!isNaN(rawSpeed)) {
      if (unit === "mph") {
        topSpeedMph = Math.round(rawSpeed);
        topSpeedKmh = Math.round(rawSpeed * 1.60934);
      } else {
        // default: kmh
        topSpeedKmh = Math.round(rawSpeed);
        topSpeedMph = Math.round(rawSpeed / 1.60934);
      }
    }

    const payload = {
      make: getValue("make"),
      model: getValue("model"),
      year: parseInt(getValue("year"), 10),
      color: getValue("color"),
      license_plate: getValue("license_plate"),
      category_name: getValue("category"),
      daily_rent_eur: parseFloat(getValue("daily_rent_eur")) || 0,
      engine: getValue("engine"),
      horsepower: parseInt(getValue("horsepower"), 10) || null,
      accel_0_100_sec: parseFloat(getValue("accel_0_100_sec")) || null,
      top_speed_kmh: topSpeedKmh,
      top_speed_mph: topSpeedMph,
      image_url: formatDropboxUrl(getValue("image_url")),
      description: getValue("description")
    };

    try {
      const res = await fetch("/api/car/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (! checkAuth(res)) return;

      const data = await res.json();

      if (! res.ok) {
          
	  alert(`Error: ${data.error || "Failed to add car"}`);
      }
        
      alert("Car listed successfully!");

      window.location.href = "./searchCar.html";
    } 
	
    catch (err) {

      console.error("Submission error:", err);

      alert("Network error: Could not reach server.");
    }
  });
});

