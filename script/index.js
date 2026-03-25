
document.getElementById("login-button").addEventListener("click", function () {
  // 1.getting the username
  const usernameInput = document.getElementById("username-input");
  const userName = usernameInput.value;
  console.log(userName);

  // 2.getting the password
  const passwordInput = document.getElementById("password-input");
  const password = passwordInput.value;
  console.log(password);

  // matching values
  if (userName == "admin" && password == "admin123") {
    window.location.assign("home.html");
  } else {
    alert("Username or password is invalid");
    return;
  }
});