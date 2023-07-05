const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector(".inventoryUpdate-button");
  updateBtn.removeAttribute("disabled");
});