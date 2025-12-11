
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".fade").forEach(el => observer.observe(el));

  const cartDrawer = document.getElementById("cart-drawer");
  const cartTrigger = document.querySelector("[data-cart-trigger]");
  const cartItemsContainer = cartDrawer.querySelector("[data-cart-items]");
  const cartTotalEl = cartDrawer.querySelector("[data-cart-total]");
  const cartCountEls = document.querySelectorAll("[data-cart-count]");
  const closeBtn = cartDrawer.querySelector(".cart-drawer__close");
  const addButtons = document.querySelectorAll(".btn-add-to-cart");

  const cart = [];

  function formatPrice(cents) {
    const euros = cents / 100;
    return euros.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      const row = document.createElement("div");
      row.className = "cart-drawer__item";
      row.innerHTML = `
        <div>
          <div>${item.title}</div>
          <div style="font-size:0.85rem;color:#6b7280;">${formatPrice(item.price)}</div>
        </div>
        <button class="cart-drawer__item-remove" data-index="${index}">×</button>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalEl.textContent = formatPrice(total);
    cartCountEls.forEach(el => (el.textContent = cart.length));

    cartItemsContainer.querySelectorAll(".cart-drawer__item-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index, 10);
        cart.splice(i, 1);
        renderCart();
      });
    });
  }

  function toggleCart(show) {
    if (show === true) cartDrawer.style.display = "flex";
    else if (show === false) cartDrawer.style.display = "none";
    else cartDrawer.style.display = cartDrawer.style.display === "flex" ? "none" : "flex";
  }

  cartTrigger.addEventListener("click", () => toggleCart());
  closeBtn.addEventListener("click", () => toggleCart(false));

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const title = card.querySelector(".product-card__title").textContent.trim();
      const priceAttr = card.querySelector("[data-price]").dataset.price;
      const priceCents = parseInt(priceAttr, 10) || 0;
      cart.push({ title, price: priceCents });
      renderCart();
      toggleCart(true);
    });
  });
});
