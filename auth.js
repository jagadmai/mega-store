const isLoggedIn = localStorage.getItem("loggedIn") === "true";
const isLoginPage = location.pathname.includes("login.html");

if (!isLoggedIn && !isLoginPage) {
  location.replace("login.html");
}

if (isLoggedIn && isLoginPage) {
  location.replace("index.html");
}

function signup() {
  const email = emailInput();
  const pass = passInput();

  if (!email || !pass) return alert("Fill all fields");

  localStorage.setItem("user", JSON.stringify({ email, pass }));
  alert("Account created. Login now.");
}

function login() {
  const email = emailInput();
  const pass = passInput();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.email !== email || user.pass !== pass) {
    return alert("Invalid credentials");
  }

  localStorage.setItem("loggedIn", "true");
  location.replace("index.html");
}

function emailInput() {
  return document.getElementById("email").value.trim();
}

function passInput() {
  return document.getElementById("password").value.trim();
}
