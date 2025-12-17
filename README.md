# Ticketshop SPA

## Project Setup
### **Tools & Tech**

- Vanilla JavaScript (ES Modules)
- HTML / CSS
- Fetch API for HTTP requests
- History API (pushState, popState) for SPA routing

### **Running the Project**
npx vite

## SPA Routing Logic

### Core Concepts
- URLs are updated using history.pushState
- Views are rendered dynamically based on window.location.pathname
- Browser back/forward buttons are handled via the popstate event

### Navigation Flow
1. Programmic navigation (buttons, pagination)
2. Anchor (<a>) navigation intercepted globally
3. Browser history navigation (back/forwards)

All three paths are triggered in the same render() function

## API Integration

### API Configuration
>export const API_URL =
>"https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets";
>export const PAGE_SIZE = 12;

### Fetching Ticket Lists

>export async function fetchTickets({ featuredOnly = false, page = 1 }) {
>const url = new URL(API_URL);
>url.searchParams.set("_page", page);
>url.searchParams.set("_limit", PAGE_SIZE);
>if (featuredOnly) url.searchParams.set("isFeatured", "true");
>
>const res = await fetch(url);
>if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
>
>const tickets = await res.json();
>const totalCount = Number(res.headers.get("X-Total-Count"));
>
>return { tickets, totalCount };
>}

## Loading States

### Loading Helper
>export function showLoading(outputId = "output") {
>const output = document.getElementById(outputId);
>if (output) output.innerHTML = "<p>Loading tickets…</p>";
>}

## Major Problems encourtered and learnings
During the project I encountered some problems where I implemented stuff incorrectly at first which I then had to fix. One example is that I firstly added the whole array of data in an db.json file that I used instead of fetching it from the API. After a bit of reading I understood how I should correctly call and use the API to fetch the data