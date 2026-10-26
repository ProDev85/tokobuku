
"use strict";

const demoBooks = [
  {
    id: 1,
    title: "Ruang untuk Bertumbuh",
    author: "Penulis Contoh",
    category: "Pengembangan Diri",
    cover: "#315e49",
    background: "#e5eddf",
    textColor: "#ffffff"
  },
  {
    id: 2,
    title: "Berani Memulai",
    author: "Penulis Contoh",
    category: "Bisnis",
    cover: "#65527f",
    background: "#e9e1f5",
    textColor: "#ffffff"
  },
  {
    id: 3,
    title: "Ide yang Menjadi Nyata",
    author: "Penulis Contoh",
    category: "Kreativitas",
    cover: "#a75d3f",
    background: "#f8dfcf",
    textColor: "#ffffff"
  },
  {
    id: 4,
    title: "Belajar Tanpa Batas",
    author: "Penulis Contoh",
    category: "Pendidikan",
    cover: "#315f83",
    background: "#dce9f5",
    textColor: "#ffffff"
  }
];

let toastTimeout;

function showToast(message) {
  const toast = document.getElementById("appToast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
}

function createBookCard(book) {
  const column = document.createElement("div");
  column.className = "col-12 col-sm-6 col-lg-3";

  const article = document.createElement("article");
  article.className = "book-card";

  const artwork = document.createElement("div");
  artwork.className = "book-art";
  artwork.style.setProperty("--book-bg", book.background);

  const cover = document.createElement("div");
  cover.className = "book-art-inner";
  cover.style.setProperty("--book-cover", book.cover);
  cover.style.setProperty("--book-text", book.textColor);

  const label = document.createElement("small");
  label.textContent = "BOOKSPACE";

  const titleOnCover = document.createElement("strong");
  titleOnCover.textContent = book.title;

  const edition = document.createElement("small");
  edition.textContent = "DIGITAL EDITION";

  cover.append(label, titleOnCover, edition);
  artwork.appendChild(cover);

  const body = document.createElement("div");
  body.className = "book-card-body";

  const category = document.createElement("div");
  category.className = "book-category";
  category.textContent = book.category;

  const title = document.createElement("h3");
  title.className = "book-title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "book-author";
  author.textContent = book.author;

  const footer = document.createElement("div");
  footer.className = "book-card-footer";

  const format = document.createElement("span");
  format.className = "small text-secondary";
  format.textContent = "Buku digital";

  const button = document.createElement("a");
  button.className = "btn btn-outline-brand";
  button.href = "subscription.html";
  button.textContent = "Mulai membaca";

  footer.append(format, button);
  body.append(category, title, author, footer);
  article.append(artwork, body);
  column.appendChild(article);

  return column;
}

function renderFeaturedBooks() {
  const container = document.getElementById("featuredBooks");

  if (!container) return;

  container.replaceChildren();

  demoBooks.forEach((book) => {
    container.appendChild(createBookCard(book));
  });
}

function setupDemoActions() {
  document.querySelectorAll("[data-demo]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();

      const action = element.dataset.demo;

      const messages = {
        login: "Fitur masuk akan tersedia setelah backend autentikasi diintegrasikan.",
        contact: "Informasi kontak akan ditambahkan pada tahap berikutnya.",
        privacy: "Kebijakan privasi perlu ditetapkan sebelum peluncuran.",
        terms: "Syarat dan ketentuan perlu ditetapkan sebelum peluncuran."
      };

      showToast(
        messages[action] || "Fitur ini belum tersedia pada versi demo."
      );
    });
  });
}

function initializeBookSpace() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  renderFeaturedBooks();
  setupDemoActions();
}

document.addEventListener("DOMContentLoaded", initializeBookSpace);
