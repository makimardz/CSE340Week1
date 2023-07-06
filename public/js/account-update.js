const form = document.querySelector(".updateAccountForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector(".updateAccount-button");
  updateBtn.removeAttribute("disabled");
});