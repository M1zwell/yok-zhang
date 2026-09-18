(() => {
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.action.includes("/cart/add")) return;
    event.preventDefault();
    const body = new FormData(form);
    fetch("/cart/add.js", { method: "POST", body })
      .then(() => fetch("/cart.js"))
      .then((res) => res.json())
      .then((cart) => {
        document.querySelectorAll("[data-cart-count]").forEach((node) => {
          node.textContent = String(cart.item_count);
        });
      })
      .catch(() => form.submit());
  });
})();
