import { navigateTo } from "./router.js";

// ---------------------
// SHOW LOADING STATE
// ---------------------
export function showLoading(outputId = "output") {
  const output = document.getElementById(outputId);
  if (output) output.innerHTML = "<p>Loading tickets…</p>";
}

// ---------------------
// RENDER TICKET CARD
// ---------------------
export function renderCodeBlock({ ticket, template, output }) {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".title").textContent = ticket.title;
  clone.querySelector(".shortDescription").textContent =
    ticket.shortDescription;
  clone.querySelector(".price").textContent = `from ${ticket.price}.00 €`;
  clone.querySelector(".img").src =
    `https://images.unsplash.com/photo-${ticket.img}`;

  const detailsBtn = clone.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => {
    navigateTo(`/details/${ticket.id}`);
  });

  output.appendChild(clone);
}

// ---------------------
// RENDER PRODUCT DETAILS
// ---------------------
export function renderTicketDetailUI(ticket) {
  const nav = document.getElementById("product-nav");
  if (nav)
    nav.style.backgroundImage = `url('https://images.unsplash.com/photo-${ticket.img}')`;

  const h1 = document.querySelector("#product-nav h1");
  if (h1) h1.textContent = ticket.title;

  const template = document.getElementById("details-template");
  const output = document.getElementById("details-output");
  if (!template || !output) return;

  output.innerHTML = "";

  const clone = template.content.cloneNode(true);
  clone.querySelector(".shortDescription").textContent =
    ticket.shortDescription;
  clone.querySelector(".detailledDescription").textContent =
    ticket.detailledDescription;

  const priceEl = clone.querySelector(".price");
  const priceReducedEl = clone.querySelector(".priceReduced");

  priceEl.textContent = `${ticket.price}.00 €`;
  if (ticket.priceReduced) {
    priceReducedEl.textContent = `${ticket.priceReduced}.00 €`;
    priceEl.classList.add("reduced");
  } else {
    priceReducedEl.textContent = "";
    priceEl.classList.remove("reduced");
  }

  output.appendChild(clone);
}

// ---------------------
// RENDER PAGINATION
// ---------------------
export function renderPagination({
  currentPage,
  totalPages,
  containerId = "paginated-list",
}) {
  const paginatedList = document.getElementById(containerId);
  if (!paginatedList) return;

  paginatedList.innerHTML = "";

  const prevLink = document.createElement("a");
  prevLink.href = "#";
  prevLink.classList.add("lArrow");
  prevLink.innerHTML = '<i class="webfont webfont-arrow"></i>';
  if (currentPage === 1) prevLink.classList.add("disabled");
  prevLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1)
      navigateTo(`/tickets?_page=${currentPage - 1}&_limit=${12}`);
  });
  paginatedList.appendChild(prevLink);

  for (let i = 1; i <= totalPages; i++) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = i;
    if (i === currentPage) a.classList.add("active");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(`/tickets?_page=${i}&_limit=${12}`);
    });
    paginatedList.appendChild(a);
  }

  const nextLink = document.createElement("a");
  nextLink.href = "#";
  nextLink.classList.add("rArrow");
  nextLink.innerHTML = '<i class="webfont webfont-arrow"></i>';
  if (currentPage === totalPages) nextLink.classList.add("disabled");
  nextLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages)
      navigateTo(`/tickets?_page=${currentPage + 1}&_limit=${12}`);
  });
  paginatedList.appendChild(nextLink);
}
