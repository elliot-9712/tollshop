import { fetchTickets, fetchTicketDetail, PAGE_SIZE } from "./api.js";
import {
  renderCodeBlock,
  renderTicketDetailUI,
  renderPagination,
  showLoading,
} from "./ui.js";

// ---------------------
// APP ROOT
// ---------------------
export const app = document.body;

// ---------------------
// SPA NAVIGATION
// ---------------------
export function navigateTo(url) {
  history.pushState(null, null, url);
  render(window.location.pathname + window.location.search);
}

window.addEventListener("popstate", () => {
  render(window.location.pathname + window.location.search);
});

// ---------------------
// SPA LINK HANDLER
// ---------------------
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href.startsWith("/")) return;

  e.preventDefault();
  navigateTo(href);
});

// ---------------------
// HELPERS
// ---------------------
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("_page")) || 1;
}

// ---------------------
// ROUTES DEFINITION
// ---------------------
const routes = {
  "/": async () => await loadHTML("/src/views/home.html"),
  "/tickets": async () => await loadHTML("/src/views/tickets.html"),
  "/details/:id": async () => await loadHTML("/src/views/details.html"),
  "*": () => "<h2>404 - Page Not Found</h2>",
};

// ---------------------
// LOAD HTML FILE
// ---------------------
async function loadHTML(path) {
  const res = await fetch(path);
  return await res.text();
}

// ---------------------
// RENDER FUNCTION
// ---------------------
export async function render(pathWithSearch) {
  const pathname = pathWithSearch.split("?")[0];

  const route =
    Object.keys(routes).find(
      (r) => r.includes(":") && pathname.startsWith(r.split("/:")[0])
    ) || pathname;

  const view = routes[route] || routes["*"];
  app.innerHTML = await view();

  // ---------------------
  // HOMEPAGE
  // ---------------------
  if (pathname === "/") {
    showLoading();
    const { tickets } = await fetchTickets({ featuredOnly: true, page: 1 });
    const template = document.getElementById("code-block-template");
    const output = document.getElementById("output");
    output.innerHTML = "";
    tickets.forEach((ticket) => renderCodeBlock({ ticket, template, output }));
  }

  // ---------------------
  // TICKETS LIST PAGE
  // ---------------------
  if (pathname.startsWith("/tickets")) {
    showLoading();
    const currentPage = getPageFromURL();
    const { tickets, totalCount } = await fetchTickets({
      featuredOnly: false,
      page: currentPage,
    });
    const template = document.getElementById("code-block-template");
    const output = document.getElementById("output");
    output.innerHTML = "";
    tickets.forEach((ticket) => renderCodeBlock({ ticket, template, output }));
    renderPagination({
      currentPage,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    });
  }

  // ---------------------
  // DETAILS PAGE
  // ---------------------
  if (pathname.startsWith("/details/")) {
    showLoading("details-output");
    const id = pathname.split("/")[2];
    const ticket = await fetchTicketDetail(id);
    renderTicketDetailUI(ticket);
  }
}
