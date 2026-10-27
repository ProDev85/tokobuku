
"use strict";

/*
 * BOOKSPACE FRONTEND
 * Data pada versi ini masih berupa data demo.
 * Belum terhubung ke backend atau database.
 */

/* ========================================
   DATA DEMO BUKU
======================================== */

const demoBooks = [
  {
    id: 1,
    title: "Ruang untuk Bertumbuh",
    author: "Penulis Contoh",
    category: "Pengembangan Diri",
    cover: "#315e49",
    background: "#e5eddf",
    textColor: "#ffffff",
    description:
      "Buku digital untuk membantu pembaca mengenali potensi diri, membangun kebiasaan positif, dan mengembangkan perspektif baru.",
    format: "PDF"
  },
  {
    id: 2,
    title: "Berani Memulai",
    author: "Penulis Contoh",
    category: "Bisnis",
    cover: "#65527f",
    background: "#e9e1f5",
    textColor: "#ffffff",
    description:
      "Panduan pengantar untuk memahami ide bisnis, menyusun langkah awal, dan membangun keberanian dalam memulai usaha.",
    format: "PDF"
  },
  {
    id: 3,
    title: "Ide yang Menjadi Nyata",
    author: "Penulis Contoh",
    category: "Kreativitas",
    cover: "#a75d3f",
    background: "#f8dfcf",
    textColor: "#ffffff",
    description:
      "Eksplorasi proses kreatif untuk mengembangkan gagasan, menyelesaikan masalah, dan mewujudkan ide menjadi karya.",
    format: "PDF"
  },
  {
    id: 4,
    title: "Belajar Tanpa Batas",
    author: "Penulis Contoh",
    category: "Pendidikan",
    cover: "#315f83",
    background: "#dce9f5",
    textColor: "#ffffff",
    description:
      "Bacaan tentang pembelajaran berkelanjutan, pengembangan pengetahuan, dan cara membangun kebiasaan belajar.",
    format: "PDF"
  },
  {
    id: 5,
    title: "Teknologi untuk Semua",
    author: "Penulis Contoh",
    category: "Teknologi",
    cover: "#3d625b",
    background: "#dcebe4",
    textColor: "#ffffff",
    description:
      "Pengantar mengenai peran teknologi digital dalam kehidupan sehari-hari, pekerjaan, dan perkembangan masyarakat.",
    format: "PDF"
  },
  {
    id: 6,
    title: "Senja di Kota Lama",
    author: "Penulis Contoh",
    category: "Fiksi",
    cover: "#995b50",
    background: "#f5e0e6",
    textColor: "#ffffff",
    description:
      "Kisah fiksi tentang perjalanan, kenangan, dan pertemuan yang mengubah cara seseorang memandang kehidupan.",
    format: "EPUB"
  },
  {
    id: 7,
    title: "Membangun Kebiasaan",
    author: "Penulis Contoh",
    category: "Pengembangan Diri",
    cover: "#876c36",
    background: "#f5edc8",
    textColor: "#ffffff",
    description:
      "Bacaan tentang konsistensi, pembentukan rutinitas, dan langkah-langkah kecil untuk mencapai tujuan.",
    format: "PDF"
  },
  {
    id: 8,
    title: "Strategi Bisnis Modern",
    author: "Penulis Contoh",
    category: "Bisnis",
    cover: "#355c83",
    background: "#dce9f5",
    textColor: "#ffffff",
    description:
      "Pengantar strategi bisnis, pengenalan peluang, dan pendekatan untuk menghadapi perubahan pasar.",
    format: "EPUB"
  }
];

let toastTimeout;

/* ========================================
   UTILITAS DOM
======================================== */

/**
 * Membuat elemen HTML dengan teks biasa.
 * Teks pengguna tidak dimasukkan sebagai HTML mentah.
 */
function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined && textContent !== null) {
    element.textContent = textContent;
  }

  return element;
}

/* ========================================
   NOTIFIKASI
======================================== */

function showToast(message) {
  const toast = document.getElementById("appToast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3500);
}

/* ========================================
   KARTU BUKU
======================================== */

function createBookCard(book) {
  const column = createElement("div", "col-12 col-sm-6 col-lg-3");
  const article = createElement("article", "book-card");

  const artwork = createElement("div", "book-art");
  artwork.style.setProperty("--book-bg", book.background);

  const cover = createElement("div", "book-art-inner");
  cover.style.setProperty("--book-cover", book.cover);
  cover.style.setProperty("--book-text", book.textColor);

  const brand = createElement("small", "", "BOOKSPACE");
  const coverTitle = createElement("strong", "", book.title);
  const edition = createElement("small", "", "DIGITAL EDITION");

  cover.append(brand, coverTitle, edition);
  artwork.appendChild(cover);

  const body = createElement("div", "book-card-body");
  const category = createElement("div", "book-category", book.category);
  const title = createElement("h3", "book-title", book.title);
  const author = createElement("p", "book-author", book.author);

  const footer = createElement("div", "book-card-footer");
  const format = createElement(
    "span",
    "small text-secondary",
    book.format || "Buku digital"
  );

  const button = createElement("a", "btn btn-outline-brand", "Detail buku");

  button.href = `book-detail.html?id=${encodeURIComponent(book.id)}`;
  button.setAttribute("aria-label", `Lihat detail buku ${book.title}`);

  footer.append(format, button);
  body.append(category, title, author, footer);
  article.append(artwork, body);
  column.appendChild(article);

  return column;
}

/* ========================================
   BERANDA
======================================== */

function renderFeaturedBooks() {
  const container = document.getElementById("featuredBooks");

  if (!container) return;

  container.replaceChildren();

  demoBooks.slice(0, 4).forEach((book) => {
    container.appendChild(createBookCard(book));
  });
}

/* ========================================
   KATALOG
======================================== */

function initializeCatalog() {
  const container = document.getElementById("catalogBooks");

  if (!container) return;

  const searchInput = document.getElementById("catalogSearch");
  const searchForm = document.getElementById("catalogSearchForm");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortBooks");
  const resultCount = document.getElementById("catalogResultCount");
  const emptyState = document.getElementById("catalogEmptyState");
  const resetButton = document.getElementById("resetCatalog");

  if (
    !searchInput ||
    !categoryFilter ||
    !sortSelect ||
    !resultCount ||
    !emptyState ||
    !resetButton
  ) {
    return;
  }

  // Membaca kategori dari URL, misalnya catalog.html?category=Bisnis.
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category");

  if (
    initialCategory &&
    Array.from(categoryFilter.options).some(
      (option) => option.value === initialCategory
    )
  ) {
    categoryFilter.value = initialCategory;
  }

  function updateCatalog() {
    const keyword = searchInput.value.trim().toLocaleLowerCase("id-ID");
    const selectedCategory = categoryFilter.value;
    const sortMode = sortSelect.value;

    let filteredBooks = demoBooks.filter((book) => {
      const searchableText = [
        book.title,
        book.author,
        book.category,
        book.description
      ]
        .join(" ")
        .toLocaleLowerCase("id-ID");

      const matchesKeyword = searchableText.includes(keyword);

      const matchesCategory =
        !selectedCategory || book.category === selectedCategory;

      return matchesKeyword && matchesCategory;
    });

    if (sortMode === "title-asc") {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title, "id"));
    } else if (sortMode === "title-desc") {
      filteredBooks.sort((a, b) => b.title.localeCompare(a.title, "id"));
    }

    container.replaceChildren();

    filteredBooks.forEach((book) => {
      container.appendChild(createBookCard(book));
    });

    resultCount.textContent = `${filteredBooks.length} buku ditemukan`;

    emptyState.classList.toggle("d-none", filteredBooks.length !== 0);
    container.classList.toggle("d-none", filteredBooks.length === 0);
  }

  searchInput.addEventListener("input", updateCatalog);
  categoryFilter.addEventListener("change", updateCatalog);
  sortSelect.addEventListener("change", updateCatalog);

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateCatalog();
    });
  }

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    sortSelect.value = "default";

    updateCatalog();
    searchInput.focus();
  });

  updateCatalog();
}

/* ========================================
   DETAIL BUKU
======================================== */

function initializeBookDetail() {
  const container = document.getElementById("bookDetailContent");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const book = demoBooks.find(
    (item) => String(item.id) === bookId
  );

  container.replaceChildren();

  if (!book) {
    const message = createElement(
      "div",
      "alert alert-light border",
      "Buku tidak ditemukan. Silakan kembali ke katalog."
    );

    const link = createElement(
      "a",
      "btn btn-brand mt-3",
      "Kembali ke katalog"
    );

    link.href = "catalog.html";
    container.append(message, link);

    return;
  }

  const row = createElement("div", "row g-4 g-lg-5 align-items-start");
  const artworkColumn = createElement("div", "col-12 col-md-5");
  const detailColumn = createElement("div", "col-12 col-md-7");

  const artwork = createElement("div", "book-detail-art");
  artwork.style.setProperty("--book-bg", book.background);

  const cover = createElement("div", "book-detail-cover");
  cover.style.setProperty("--book-cover", book.cover);
  cover.style.setProperty("--book-text", book.textColor);

  cover.append(
    createElement("small", "", "BOOKSPACE"),
    createElement("strong", "", book.title),
    createElement("small", "", "DIGITAL EDITION")
  );

  artwork.appendChild(cover);
  artworkColumn.appendChild(artwork);

  const category = createElement("p", "book-category", book.category);
  const title = createElement("h1", "display-6 fw-bold mb-3", book.title);
  const author = createElement(
    "p",
    "text-secondary mb-4",
    `Penulis: ${book.author}`
  );

  const descriptionHeading = createElement(
    "h2",
    "h5 fw-semibold mt-4",
    "Tentang buku ini"
  );

  const description = createElement(
    "p",
    "book-detail-description",
    book.description || "Deskripsi buku belum tersedia."
  );

  const format = createElement(
    "p",
    "small text-secondary",
    `Format: ${book.format || "Belum ditentukan"}`
  );

  const notice = createElement("div", "reader-notice");
  notice.appendChild(
    createElement(
      "p",
      "mb-0",
      "Akses baca memerlukan langganan yang memenuhi syarat. Status langganan belum diverifikasi pada versi demo ini."
    )
  );

  const subscribeLink = createElement(
    "a",
    "btn btn-brand mt-3",
    "Lihat paket langganan"
  );

  subscribeLink.href = "subscription.html";

  detailColumn.append(
    category,
    title,
    author,
    descriptionHeading,
    description,
    format,
    notice,
    subscribeLink
  );

  row.append(artworkColumn, detailColumn);
  container.appendChild(row);
}

/* ========================================
   PEMBACA BUKU
======================================== */

function initializeReader() {
  const titleElement = document.getElementById("readerBookTitle");
  const accessStatus = document.getElementById("readerAccessStatus");
  const paper = document.getElementById("readerPaper");
  const message = document.getElementById("readerMessage");
  const pageStatus = document.getElementById("readerPageStatus");

  if (!titleElement && !paper && !message) return;

  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  const book = demoBooks.find(
    (item) => String(item.id) === bookId
  );

  if (titleElement) {
    titleElement.textContent = book ? book.title : "Buku tidak ditemukan";
  }

  if (accessStatus) {
    accessStatus.textContent = book
      ? "Demo — akses belum diverifikasi"
      : "Buku tidak ditemukan";
  }

  if (pageStatus) {
    pageStatus.textContent = "Konten pembaca belum tersedia";
  }

  if (message) {
    message.replaceChildren();

    message.appendChild(
      createElement(
        "h2",
        "h5 fw-semibold mb-3",
        book ? "Pembaca digital BookSpace" : "Buku tidak ditemukan"
      )
    );

    message.appendChild(
      createElement(
        "p",
        "mb-3",
        book
          ? "Tampilan pembaca sudah disiapkan. Integrasi file PDF/EPUB dan verifikasi hak akses melalui backend belum tersedia."
          : "Buku yang diminta tidak tersedia. Silakan kembali ke katalog."
      )
    );

    const link = createElement(
      "a",
      "btn btn-outline-brand",
      "Kembali ke katalog"
    );

    link.href = "catalog.html";
    message.appendChild(link);
  }

  if (!book) return;

  let fontSize = 16;

  const decreaseButton = document.getElementById("decreaseFont");
  const increaseButton = document.getElementById("increaseFont");

  if (decreaseButton) {
    decreaseButton.addEventListener("click", () => {
      fontSize = Math.max(12, fontSize - 1);

      if (message) {
        message.style.fontSize = `${fontSize}px`;
      }
    });
  }

  if (increaseButton) {
    increaseButton.addEventListener("click", () => {
      fontSize = Math.min(28, fontSize + 1);

      if (message) {
        message.style.fontSize = `${fontSize}px`;
      }
    });
  }

  // Navigasi halaman tetap belum aktif sampai mesin pembaca diintegrasikan.
  ["previousPage", "nextPage"].forEach((id) => {
    const button = document.getElementById(id);

    if (button) {
      button.disabled = true;
    }
  });
}

/* ========================================
   TOMBOL DEMO
======================================== */

function setupDemoActions() {
  document.querySelectorAll("[data-demo]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();

      const action = element.dataset.demo;

      const messages = {
        login:
          "Fitur masuk akan tersedia setelah backend autentikasi diintegrasikan.",
        contact:
          "Informasi kontak akan ditambahkan pada tahap berikutnya.",
        privacy:
          "Kebijakan privasi harus ditetapkan sebelum peluncuran.",
        terms:
          "Syarat dan ketentuan harus ditetapkan sebelum peluncuran."
      };

      showToast(
        messages[action] || "Fitur ini belum tersedia pada versi demo."
      );
    });
  });
}

/* ========================================
   TOMBOL PAKET LANGGANAN
======================================== */

function setupSubscriptionButtons() {
  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const planName = button.dataset.plan;

      showToast(
        `Paket ${planName} dipilih sebagai demo. ` +
          "Pembayaran belum tersedia sampai backend terintegrasi."
      );
    });
  });
}

/* ========================================
   FORMULIR PENERBITAN
======================================== */

function setupSubmissionForm() {
  const form = document.getElementById("submissionForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.reportValidity();
      return;
    }

    form.classList.add("was-validated");

    showToast(
      "Pemeriksaan demo berhasil. Data belum dikirim atau disimpan. " +
        "Pengajuan nyata memerlukan backend."
    );

    // Tidak ada data yang dikirim atau disimpan.
    // Integrasi API akan ditambahkan pada tahap backend.
  });
}

/* ========================================
   INISIALISASI WEBSITE
======================================== */

function initializeBookSpace() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  renderFeaturedBooks();
  initializeCatalog();
  initializeBookDetail();
  initializeReader();
  setupDemoActions();
  setupSubscriptionButtons();
  setupSubmissionForm();
}

document.addEventListener("DOMContentLoaded", initializeBookSpace);
