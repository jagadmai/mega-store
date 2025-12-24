// ===============================
// AUTH SYSTEM (FRONTEND ONLY)
// ===============================

// Run this on every page load
(function authGuard() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const isLoginPage = location.pathname.includes("login.html");

  if (!loggedIn && !isLoginPage) {
    window.location.replace("login.html");
  }

  if (loggedIn && isLoginPage) {
    window.location.replace("index.html");
  }
})();

// ===============================
// SIGN UP
// ===============================
function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const user = { email, password };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Account created. Now log in.");
}

// ===============================
// LOGIN
// ===============================
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (user.email !== email || user.password !== password) {
    alert("Invalid email or password");
    return;
  }

  // ✅ SET LOGIN STATE
  localStorage.setItem("loggedIn", "true");

  // ✅ SAFE REDIRECT
  setTimeout(() => {
    window.location.replace("index.html");
  }, 100);
}

// ===============================
// LOGOUT (for later use)
// ===============================
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.replace("login.html");
}
