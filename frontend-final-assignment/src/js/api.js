// ---------------------
// API CONFIG
// ---------------------
export const API_URL =
  "https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets";

export const PAGE_SIZE = 12;

// ---------------------
// FETCH LIST OF TICKETS
// ---------------------
export async function fetchTickets({ featuredOnly = false, page = 1 }) {
  const url = new URL(API_URL);
  url.searchParams.set("_page", page);
  url.searchParams.set("_limit", PAGE_SIZE);
  if (featuredOnly) url.searchParams.set("isFeatured", "true");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  const tickets = await res.json();
  const totalCount = Number(res.headers.get("X-Total-Count"));

  return { tickets, totalCount };
}

// ---------------------
// FETCH SINGLE TICKET DETAIL
// ---------------------
export async function fetchTicketDetail(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return await res.json();
}
