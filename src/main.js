const app = document.body;

// ---------------------
// CONSTANTS & STATE
// ---------------------
const PAGE_SIZE = 12;
let currentPage = 1;
let totalPages = 1;

const data =
  "https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets";

// ---------------------
// ROUTES
// ---------------------
const routes = {
  "/": async () => await loadHTML("/src/views/home.html"),
  "/tickets": async () => await loadHTML("/src/views/tickets.html"),
  "/details/:id": async () => await loadHTML("/src/views/details.html"),
  "*": () => "<h2>404 - Page Not Found</h2>",
};

// ---------------------
// SPA NAVIGATION
// ---------------------
function navigateTo(url) {
  history.pushState(null, null, url);
  render(window.location.pathname + window.location.search);
}

window.addEventListener("popstate", () => {
  render(window.location.pathname + window.location.search);
});

// ---------------------
// LOAD EXTERNAL HTML
// ---------------------
async function loadHTML(path) {
  const res = await fetch(path);
  return await res.text();
}

// ---------------------
// HELPER: GET PAGE FROM URL
// ---------------------
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("_page")) || 1;
}

// ---------------------
// RENDER FUNCTION
// ---------------------
async function render(pathWithSearch) {
  const pathname = pathWithSearch.split("?")[0];

  // Match dynamic routes like /details/:id
  const route =
    Object.keys(routes).find(
      (r) => r.includes(":") && pathname.startsWith(r.split("/:")[0])
    ) || pathname;

  const view = routes[route] || routes["*"];
  app.innerHTML = await view();

  // Homepage: featured tickets
  if (pathname === "/") {
    fetchTickets({ featuredOnly: true, page: 1 });
  }

  // Tickets list page: paginated
  if (pathname.startsWith("/tickets")) {
    currentPage = getPageFromURL();
    fetchTickets({ featuredOnly: false, page: currentPage });
  }
}

// ---------------------
// LOADING STATE
// ---------------------
function showLoading() {
  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = "<p>Loading tickets…</p>";
  }
}

// ---------------------
// FETCH TICKETS
// ---------------------
async function fetchTickets({ featuredOnly, page }) {
  showLoading();

  try {
    const url = new URL(data);
    url.searchParams.set("_page", page);
    url.searchParams.set("_limit", PAGE_SIZE);

    if (featuredOnly) {
      url.searchParams.set("isFeatured", "true");
    }

    const res = await fetch(url);
    if (!res.ok) {
      console.error(res.status, res.statusText);
      return;
    }

    const tickets = await res.json();

    const totalCount = Number(res.headers.get("X-Total-Count"));
    totalPages = Math.ceil(totalCount / PAGE_SIZE);

    console.log("Current page:", page);
    console.log("Tickets on this page:", tickets.length);
    console.log("Total tickets in API:", totalCount);
    console.log("Total pages:", totalPages);

    const template = document.getElementById("code-block-template");
    const output = document.getElementById("output");
    if (!template || !output) return;

    output.innerHTML = "";

    tickets.forEach((ticket) => {
      renderCodeBlock({
        id: ticket.id,
        title: ticket.title,
        shortDescription: ticket.shortDescription,
        price: ticket.price,
        img: ticket.img,
        template,
        output,
      });
    });

    if (!featuredOnly) {
      renderPagination();
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

// ---------------------
// PAGINATION
// ---------------------
function renderPagination() {
  const paginatedList = document.getElementById("paginated-list");
  if (!paginatedList) return;

  paginatedList.innerHTML = "";

  const prevLink = document.createElement("a");
  prevLink.href = "#";
  prevLink.classList.add("lArrow");
  prevLink.innerHTML = '<i class="webfont webfont-arrow"></i>';
  if (currentPage === 1) prevLink.classList.add("disabled");

  prevLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      navigateTo(`/tickets?_page=${currentPage}&_limit=12`);
    }
  });

  paginatedList.appendChild(prevLink);

  for (let i = 1; i <= totalPages; i++) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = i;

    if (i === currentPage) a.classList.add("active");

    a.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      navigateTo(`/tickets?_page=${currentPage}&_limit=12`);
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
    if (currentPage < totalPages) {
      currentPage++;
      navigateTo(`/tickets?_page=${currentPage}&_limit=12`);
    }
  });

  paginatedList.appendChild(nextLink);
}

// ---------------------
// TEMPLATE LOGIC
// ---------------------
function renderCodeBlock({
  id,
  title,
  shortDescription,
  price,
  img,
  template,
  output,
}) {
  const clone = template.content.cloneNode(true);

  clone.querySelector(".title").textContent = title;
  clone.querySelector(".shortDescription").textContent = shortDescription;
  clone.querySelector(".price").textContent = `from ${price} €`;
  clone.querySelector(".img").src = `https://images.unsplash.com/photo-${img}`;

  const detailsBtn = clone.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => {
    navigateTo(`/details/${id}`);
  });

  output.appendChild(clone);
}

// ---------------------
// INITIAL LOAD
// ---------------------
render(window.location.pathname + window.location.search);
