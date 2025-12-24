// AUTH GUARD
(function () {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const onLoginPage = location.pathname.includes("login.html");

  if (!loggedIn && !onLoginPage) {
    location.replace("login.html");
  }

  if (loggedIn && onLoginPage) {
    location.replace("index.html");
  }
})();

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ email, password }));
  alert("Account created. Now login.");
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Wrong credentials");
    return;
  }

  localStorage.setItem("loggedIn", "true");

  setTimeout(() => {
    location.replace("index.html");
  }, 100);
}
