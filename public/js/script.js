const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburger.classList.toggle('toggle');
});

const pswdBtn = document.querySelector("#showPassBtn");
if (pswdBtn) {
  pswdBtn.addEventListener("click", function () {
    const pswdInput = document.getElementById("password");
    const type = pswdInput.getAttribute("type");
    if (type == "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide Password";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show Password";
    }
  });
}

// form validation
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    if (input.checkValidity()) {
      input.classList.remove("invalid-input");
      input.classList.add("valid-input");
    } else {
      input.classList.remove("valid-input");
      input.classList.add("invalid-input");
    }
  });
});