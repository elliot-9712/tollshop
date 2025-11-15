const data = "db.json";

async function fetchTickets() {
  try {
    const res = await fetch(data);

    if (!res.ok) {
      console.log(res.status, res.statusText);
      return;
    }

    const product = await res.json();

    console.log(product);

  product.tickets.forEach(ticket => {
      renderCodeBlock({
        title: ticket.title,
        shortDescription: ticket.shortDescription,
        price: ticket.price,
        img: ticket.img,
      });
    });
  } catch (err) {
    console.log("Fetch failed:", err);
  }
}
fetchTickets();

const template = document.getElementById("code-block-template");
const output = document.getElementById("output");

function renderCodeBlock({ title, shortDescription, price, img }) {
  const clone = template.content.cloneNode(true);

  clone.querySelector(".title").textContent = title;
  clone.querySelector(".shortDescription").textContent = shortDescription;
  clone.querySelector(".price").textContent = `from ${price} €`;

  clone.querySelector(".img").src = `https://images.unsplash.com/photo-${img}`;

  clone.querySelector(".featured-btn");
  clone.querySelector(".details-btn");

  output.appendChild(clone);
}
