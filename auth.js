const isLoginPage = location.pathname.includes("login.html");

if (!localStorage.getItem("loggedIn") && !isLoginPage) {
  location.replace("login.html");
}

if (localStorage.getItem("loggedIn") && isLoginPage) {
  location.replace("index.html");
}

function signup() {
  const email = emailVal();
  const pass = passVal();
  if (!email || !pass) return alert("Fill all fields");

  localStorage.setItem("user", JSON.stringify({ email, pass }));
  alert("Account created");
}

function login() {
    localStorage.setItem("loggedIn", "true");

  const email = emailVal();
  const pass = passVal();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.pass !== pass) {
    alert("Wrong credentials");
    return;
  }

  localStorage.setItem("loggedIn", "true");
  location.replace("index.html");
  location.href = "index.html";

}

const emailVal = () => document.getElementById("email").value.trim();
const passVal = () => document.getElementById("password").value.trim();
