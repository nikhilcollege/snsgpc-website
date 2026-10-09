// Interactive features for the static college website concept.
// This project has no server/database. Demo profile information stays in this browser only.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
  }

  const themeButtons = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("snsgpc-theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  themeButtons.forEach(button => button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("snsgpc-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  }));

  // Lightweight hero carousel using generated local images.
  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = [
      "images/campus-hero.jpg",
      "images/campus-walkway.jpg",
      "images/students-campus.jpg"
    ];
    const dots = [...document.querySelectorAll(".hero-dots .dot")];
    let active = 0;
    const show = index => {
      active = (index + slides.length) % slides.length;
      hero.style.backgroundImage = `url("${slides[active]}")`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    };
    document.querySelector(".hero-arrow.prev")?.addEventListener("click", () => show(active - 1));
    document.querySelector(".hero-arrow.next")?.addEventListener("click", () => show(active + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  }

  // Department text search and category filters.
  const departmentSearch = document.getElementById("departmentSearch");
  const departmentCards = [...document.querySelectorAll(".department-card")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  let activeFilter = "all";
  function filterDepartments() {
    if (!departmentCards.length) return;
    const query = (departmentSearch?.value || "").trim().toLowerCase();
    let shown = 0;
    departmentCards.forEach(card => {
      const matchesText = card.textContent.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const visible = matchesText && matchesCategory;
      card.hidden = !visible;
      if (visible) shown++;
    });
    const empty = document.getElementById("noDepartments");
    if (empty) empty.hidden = shown !== 0;
  }
  departmentSearch?.addEventListener("input", filterDepartments);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("selected", item === button));
    filterDepartments();
  }));

  // Notice search.
  const newsSearch = document.getElementById("newsSearch");
  const noticeItems = [...document.querySelectorAll(".notice-item")];
  newsSearch?.addEventListener("input", () => {
    let shown = 0;
    const query = newsSearch.value.trim().toLowerCase();
    noticeItems.forEach(item => {
      const visible = item.textContent.toLowerCase().includes(query);
      item.hidden = !visible;
      if (visible) shown++;
    });
    const empty = document.getElementById("noNews");
    if (empty) empty.hidden = shown !== 0;
  });

  // Gallery lightbox.
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    document.querySelectorAll(".gallery-item").forEach(button => button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = button.querySelector("img")?.alt || "Expanded gallery image";
      lightbox.hidden = false;
    }));
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => { lightbox.hidden = true; });
    lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.hidden = true; });
    document.addEventListener("keydown", event => { if (event.key === "Escape") lightbox.hidden = true; });
  }

  // Contact form: client-side demonstration only; no message is sent anywhere.
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    const message = contactForm.querySelector(".form-message");
    if (!contactForm.reportValidity()) return;
    message.textContent = "Form validated successfully. This demo does not send or store your message.";
    contactForm.reset();
  });

  // Demo registration: saves only name + email, never the password.
  const registerForm = document.getElementById("registerForm");
  registerForm?.addEventListener("submit", event => {
    event.preventDefault();
    const message = registerForm.querySelector(".form-message");
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerConfirm").value;
    if (!registerForm.reportValidity()) return;
    if (password !== confirm) { message.textContent = "The demo passwords do not match."; return; }
    const profiles = JSON.parse(localStorage.getItem("snsgpc-demo-profiles") || "[]");
    if (profiles.some(profile => profile.email === email)) { message.textContent = "A demo profile with this email already exists in this browser."; return; }
    profiles.push({ name, email }); // Intentionally never store password.
    localStorage.setItem("snsgpc-demo-profiles", JSON.stringify(profiles));
    localStorage.setItem("snsgpc-demo-current", email);
    window.location.href = "dashboard.html";
  });

  // Demo login: accepts a non-empty password for an existing local demo profile.
  // This is NOT secure authentication and is only for testing the interface.
  const loginForm = document.getElementById("loginForm");
  loginForm?.addEventListener("submit", event => {
    event.preventDefault();
    const message = loginForm.querySelector(".form-message");
    if (!loginForm.reportValidity()) return;
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const profiles = JSON.parse(localStorage.getItem("snsgpc-demo-profiles") || "[]");
    const profile = profiles.find(item => item.email === email);
    if (!profile) { message.textContent = "No demo profile found in this browser. Create one first."; return; }
    localStorage.setItem("snsgpc-demo-current", profile.email);
    window.location.href = "dashboard.html";
  });

  const dashboardName = document.getElementById("dashboardName");
  if (dashboardName) {
    const email = localStorage.getItem("snsgpc-demo-current");
    const profiles = JSON.parse(localStorage.getItem("snsgpc-demo-profiles") || "[]");
    const profile = profiles.find(item => item.email === email);
    if (!profile) { window.location.href = "login.html"; return; }
    dashboardName.textContent = profile.name;
    const profileEmail = document.getElementById("profileEmail");
    if (profileEmail) profileEmail.textContent = profile.email;
  }
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    localStorage.removeItem("snsgpc-demo-current");
    window.location.href = "login.html";
  });
});
