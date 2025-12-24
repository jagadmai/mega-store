function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ email, password }));
  alert("Account created. You can now login.");
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Invalid login");
    return;
  }

  // ✅ SET LOGIN STATE FIRST
  localStorage.setItem("loggedIn", "true");

  // ✅ FORCE CLEAN REDIRECT
  window.location.replace("index.html");
}


  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Invalid login");
    return;
  }

  localStorage.setItem("loggedIn", "true");
  location.href = "index.html";
