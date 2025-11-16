const app = document.body;

// ---------------------
// ROUTES
// ---------------------
const routes = {
  "/": async () => await loadHTML("/src/views/home.html"),
  "/tickets": async () => await loadHTML("/src/views/tickets.html"),
  "/details/:id": async () => loadHTML("/src/views/details.html"),
  "*": () => "<h2>404 - Page Not Found</h2>",
};

// ---------------------
// SPA NAVIGATION
// ---------------------
function navigateTo(url) {
  history.pushState(null, null, url);
  render(url);
}

window.addEventListener("popstate", () => {
  render(window.location.pathname);
});

// ---------------------
// LOAD EXTERNAL HTML
// ---------------------
async function loadHTML(path) {
  const res = await fetch(path);
  return await res.text();
}

// ---------------------
// RENDER FUNCTION
// ---------------------
async function render(path) {
  const view = routes[path] || routes["*"];
  app.innerHTML = await view();

  if (path === "/") fetchTickets({ featuredOnly: true });
  if (path === "/tickets") fetchTickets({ featuredOnly: false });
}

// ---------------------
// TICKETS LOGIC
// ---------------------
const data = "db.json";

async function fetchTickets({ featuredOnly }) {
  try {
    const res = await fetch(data);
    if (!res.ok) {
      console.log(res.status, res.statusText);
      return;
    }

    const product = await res.json();

    const template = document.getElementById("code-block-template");
    const output = document.getElementById("output");
    if (!template || !output) return;

    output.innerHTML = "";

    product.tickets
      .filter(ticket => (featuredOnly ? ticket.isFeatured : true))
      .forEach(ticket => {
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
  } catch (err) {
    console.log("Fetch failed:", err);
  }
}
// ---------------------
// TEMPLATE LOGIC
// ---------------------

function renderCodeBlock({ id, title, shortDescription, price, img, template, output }) {
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
render(window.location.pathname);
