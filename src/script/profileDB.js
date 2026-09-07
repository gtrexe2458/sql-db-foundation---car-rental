
import checkAuth from "./checkAuth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("profileForm");
  const statusDiv = document.getElementById("status");

  // Helper function to safely set element value
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val ?? "";
  };

  // Helper function to safely get element value
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : null;
  };

  // 1. Fetch current profile data
  try {
    const res = await fetch("/api/auth/profile", { credentials: "include" });
    if (!checkAuth(res)) return;

    const result = await res.json();
    const user = result.data || result.user || result;

    if (result.success !== false && user) {
      setVal("email", user.email);
      setVal("full_name", user.full_name || user.fullName);
      setVal("contact", user.contact || user.contact_number);
      setVal("id", user.id || user.passport);
      setVal("country", user.country);
    } else if (statusDiv) {
      statusDiv.innerText = "Error: " + (result.error || "Failed to load user data");
    }
  } catch (err) {
    console.error("Profile load error:", err);
    if (statusDiv) statusDiv.innerText = "Failed to load profile.";
  }

  // 2. Handle profile update submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (statusDiv) statusDiv.innerText = "Saving...";

      const updatedData = {
        full_name: getVal("full_name"),
        contact: getVal("contact"),
        id: getVal("id"),
        country: getVal("country")
      };

      try {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData)
        });

        if (!checkAuth(res)) return;

        const result = await res.json();
        if (!res.ok || result.success === false) {
          if (statusDiv) statusDiv.innerText = "Update failed: " + (result.error || "Server error");
          return;
        }

        if (statusDiv) statusDiv.innerText = "Profile updated successfully!";
      } catch (err) {
        console.error("Profile update error:", err);
        if (statusDiv) statusDiv.innerText = "Network error occurred.";
      }
    });
  }
});

