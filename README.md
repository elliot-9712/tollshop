# Final Assignment: Single Page Application (SPA) Ticketshop

Build a Single Page Application (SPA) that allows users to browse, search, and view details from a ticket API.

## Requirements

### 0. Fork gitlab repo

https://gitlab.mediacube.at/fhs47785/frontend-final-assignment

### 0.1 Design/Page Structure

https://www.figma.com/design/NWi8W3bxD9YcBbwW77Q15t/frontend-final-assignment?node-id=0-1&t=23qq3HaWoXHSon3v-1

### 1. Tooling & Project Setup

- Set up a fresh frontend environment using **Vite**.
- Configure development (`dev`) and build scripts.
- Add and configure at least:
  - **ESLint** and **Prettier** for linting and formatting.
  - **EditorConfig** for consistent editor settings.
  - (Optional) **TailwindCSS** and/or **PostCSS**
  - (Optional) you can use Typescript if you want to

### 2. SPA Routing (Manual, no libraries)

- Implement **client-side routing** yourself using the History API (`pushState`, `popstate`).
- Implement **three routes/views**:
  - **Portal page** (featured content)
  - **Overview/List page** (with pagination)
  - **Detail page**

### 3. API Integration

- Use the **API provided here: https://github.com/j-handlechner/ticket-fake-api**.
- Implement **asynchronous API fetching** for list and detail data (using Promises/async/await).
- For the **portal page**, fetch **only items marked `isFeatured`**.
- Implement **pagination** for overview/list pages and **only fetch the items needed per page** (max 12 per page)
  - pagination should work by both clicking on the arrows and the numbers.
  - style the active number different than the not-active ones
  - use the meta field in the api for finding out how many ticket products there are in total and render the pagination based on that (one page should show 12 items)
- Show loading states

### 4. Features

- **Portal Page with Featured Teasers**
  - Display only the teasers marked as featured.
  - Fetch only the data needed for the current page.

- **Overview/List Pages with Pagination**
  - Show 10 teasers per page.
  - Fetch only the data needed for the current page.

- **Detail Pages**
  - Display full details when clicking on a teaser from the portal or overview pages. (should mirror the design)

- **Complete Data Display**
  - Show all available information for each teaser and on detail pages where provided (should mirror the design)
    - for example: if there is a reducedPrice available, show the reduced price and the original price striked through

### 5. Code Structure

- Use JavaScript modules (`import`/`export`) and logical code organization (routing, API, UI).
- Demonstrate awareness of **scoping and module patterns**.

### 6. UI & UX

- Ensure functional navigation and loading feedback.
- Use CSS/Tailwind for styling as desired, somewhat adhere to the design

### 7. Documentation / Validation
Include a `README.md` describing:

- Project setup (tools, running instructions)
- SPA routing logic
- API integration and loading states
- **Major problems encountered and learnings**

### 8. Deployment
- Deploy the application to a public hosting platform such as **Netlify**, **Vercel**, or similar.
- Include deployment link in the README.
- Show me how you handle the proxy (redirecting all requests to index.html)
-- for example, instructions on how to do that with netlify: https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps

## Hints & Tips
- Take a look at the template component for rendering

```html
<!-- Template with placeholders -->
<template id="code-block-template">
  <article class="code-wrapper">
    <h3 class="title">TITLE_PLACEHOLDER</h3>
    <pre><code class="language-js">CODE_PLACEHOLDER</code></pre>
    <p class="description">DESC_PLACEHOLDER</p>
  </article>
</template>

<script>
  const template = document.getElementById("code-block-template");
  const output = document.getElementById("output");

  function renderCodeBlock({ title, code, description }) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").textContent = title;
    clone.querySelector("code").textContent = code;
    clone.querySelector(".description").textContent = description;

    output.appendChild(clone);
  }

  renderCodeBlock({
    title: "Simple greeting function",
    code: `function greet(name) {
  return "Hello " + name;
}`,
    description: "This snippet shows a tiny reusable function.",
  });
</script>
```

This can help you to render things through JS more easily (instead of having to create everything with DOM Nodes in your JS)

- use the icons given to you in the base assets, transform them into an iconfont (as shown in the lecture) and use them in your code that way (grants bonuspoints)
- Take a look at the documentation of the api, only fetch what you need on each page

## Submission Checklist

- Source code in a public or private repository with correct permissions set for me to view
- Documentation as described above
- Working demo 
- <span style="background-color:#c1121f; color: white; padding: 2px;">**Link to Repo and Link to deployed page submitted in Moodle Assignment**</span>

<!-- ticket-fake-api --!>
## ticket-fake-api — read-only JSON API for tickets

This repository hosts a small fake JSON API (powered by my-json-server) that serves a collection of ticket objects.

### Base endpoints

- Base URL for all tickets collection:

  `https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets`

- Single ticket (by id):

  `https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets/<id>`

### Querying and pagination examples

- Filter by field (example: price equals 10):

  `https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets?price=10`

- Pagination / limits:

  `https://my-json-server.typicode.com/j-handlechner/ticket-fake-api/tickets?_page=2&_limit=10`

### Images

The `img` attribute in the JSON refers to the **Unsplash ID** of the images. To build the URLs, use this schema:

- `https://images.unsplash.com/photo-<image id from json api>`
- for example: `https://images.unsplash.com/photo-1531436040007-7216019112d7`

### JSON structure (db.json)

The API serves a top-level object with a `tickets` array. Each ticket object contains the following fields:

- id (number) — unique identifier
- title (string) — short title of the ticket
- shortDescription (string) — brief summary
- detailledDescription (string) — longer description (note the spelling in the data)
- price (number) — regular price
- priceReduced (number, optional) — reduced price when available
- isFeatured (boolean, optional) — flag for featured tickets
- img (string, optional) — image filename or path

Example ticket object:

```json
{
  "id": 1,
  "title": "Day Ski Pass",
  "shortDescription": "Full-day access to all ski lifts.",
  "detailledDescription": "Enjoy unlimited skiing across the entire resort for one full day.",
  "price": 59,
  "priceReduced": 49,
  "isFeatured": true,
  "img": "unsplash-id"
}
```

### Notes

- This is a read-only fake API (my-json-server) — POST/PUT/PATCH/DELETE won't persist changes.
- Field names mirror `db.json` in this repo (see `db.json`).