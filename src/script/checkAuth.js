
export default function checkAuth (res) {
  if (res.status === 401 || res.status === 403) {
    alert("Session expired or unauthorized. Please log in again.");
    window.location.href = "./login.html";
    return false;
  }
  return true;
};

