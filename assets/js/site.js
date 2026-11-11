/**
 * Sutram - Client Interactive Behaviors
 * Handles theme toggle (Dark/Light), text direction (RTL/LTR),
 * mobile navigation, form validations, and interactive toasts.
 */

// Toast notification helper
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(window._toast);
  window._toast = setTimeout(() => {
    t.style.display = "none";
  }, 3000);
}

// Preferences: Theme (Dark/Light) and Direction (LTR/RTL)
function applyPrefs() {
  const dark = localStorage.getItem("sutram-theme") === "dark";
  document.body.classList.toggle("dark", dark);
  document.documentElement.dir = localStorage.getItem("sutram-dir") || "ltr";
  document
    .querySelectorAll("#themeToggle, .theme-toggle")
    .forEach((b) => (b.textContent = dark ? "☀" : "☾"));
  document
    .querySelectorAll("#dirToggle, .dir-toggle")
    .forEach((b) => (b.textContent = "RTL"));
}

applyPrefs();

document.querySelectorAll("#themeToggle, .theme-toggle").forEach((b) =>
  b.addEventListener("click", () => {
    localStorage.setItem(
      "sutram-theme",
      document.body.classList.contains("dark") ? "light" : "dark",
    );
    applyPrefs();
  }),
);

document.querySelectorAll("#dirToggle, .dir-toggle").forEach((b) =>
  b.addEventListener("click", () => {
    localStorage.setItem(
      "sutram-dir",
      document.documentElement.dir === "rtl" ? "ltr" : "rtl",
    );
    applyPrefs();
  }),
);

// Mobile navigation menu toggle
document
  .getElementById("menuToggle")
  ?.addEventListener("click", () =>
    document.getElementById("navLinks")?.classList.toggle("open"),
  );

// Dashboard mobile sidebar menu toggle
document
  .getElementById("dashMenuToggle")
  ?.addEventListener("click", () =>
    document.getElementById("sideLinks")?.classList.toggle("open"),
  );

// Dashboard sidebar active link switching
document.querySelectorAll(".side-links > a").forEach((a) =>
  a.addEventListener("click", () => {
    document
      .querySelectorAll(".side-links > a")
      .forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
    document.getElementById("sideLinks")?.classList.remove("open");
  }),
);

// Quick search form (Home page)
document.getElementById("quickSearch")?.addEventListener("submit", (e) => {
  e.preventDefault();
  location.href = "search-profiles.html";
});

// Profile filter form (Search Profiles page)
document.getElementById("profileFilters")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast(
    "Filters captured in the preview. Connect a profile database for real results.",
  );
});

// Contact consultation form
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast(
    "Thank you. Demo form validated; connect a backend to receive this enquiry.",
  );
  e.target.reset();
});

// Authentication form (Login / Signup validation)
document.getElementById("authForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = document.getElementById("authFeedback");
  const pwd = e.target.elements.password?.value;
  const cpwd = e.target.elements.confirmPassword?.value;
  if (cpwd !== undefined && pwd !== cpwd) {
    if (f) {
      f.textContent = "Passwords do not match. Please check and try again.";
      f.style.color = "var(--red)";
    }
    return;
  }
  if (f) {
    f.textContent =
      "Form validated in preview mode. No account was created and no credentials were transmitted.";
    f.style.color = "var(--red)";
  }
});

// Password visibility toggle
document.querySelectorAll(".pwd-toggle").forEach((b) =>
  b.addEventListener("click", () => {
    const inp = b.parentElement.querySelector("input");
    if (!inp) return;
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    b.classList.toggle("showing", show);
    b.title = show ? "Hide password" : "Show password";
  }),
);

// Interactive preview toasts
document
  .querySelectorAll(".oauth-btn")
  .forEach((b) =>
    b.addEventListener("click", () =>
      toast(
        `${b.dataset.provider || "OAuth"} sign-in preview — connect OAuth service before launch.`,
      ),
    ),
  );

document
  .querySelectorAll(".interest")
  .forEach((b) =>
    b.addEventListener("click", () =>
      toast(
        "Preview only: sign-in and a secure interest workflow are required.",
      ),
    ),
  );

document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast("Thank you for subscribing to the Sutram newsletter.");
  e.target.reset();
});

document.querySelectorAll(".social-icon").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    toast(
      `${a.title || "Social link"} preview — connect official social page before launch.`,
    );
  }),
);
