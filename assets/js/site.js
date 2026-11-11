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
  ?.addEventListener("click", () => {
    document.getElementById("sideLinks")?.classList.toggle("open");
    document.getElementById("navLinks")?.classList.toggle("open");
  });

// Tab metadata for dynamic header updates
const dashTabMeta = {
  overview: {
    eyebrow: "Personalized Overview",
    title: "Welcome to Sutram",
    subtitle: "A real-time snapshot of your matchmaking progress, curated introductions and profile health.",
  },
  recommendations: {
    eyebrow: "Curated Connections",
    title: "Partner Recommendations",
    subtitle: "Profiles screened by our advisors for cultural alignment, mutual career respect and shared life values.",
  },
  interests: {
    eyebrow: "Connection Activity",
    title: "Interests Received & Sent",
    subtitle: "Manage pending introductions, mutual connections and your sent interest tracker.",
  },
  settings: {
    eyebrow: "Privacy & Account Governance",
    title: "Account Settings & Privacy",
    subtitle: "Comprehensive control over your profile visibility, confidential communication channels, and security preferences.",
  },
};

// Dashboard section tab switcher
function switchDashTab(targetId) {
  if (
    !targetId ||
    targetId === "#" ||
    targetId.startsWith("http") ||
    targetId.includes(".html")
  )
    return;
  const cleanId = targetId.startsWith("#") ? targetId.slice(1) : targetId;
  const targetSection = document.getElementById(cleanId);
  if (!targetSection || !targetSection.classList.contains("dash-section"))
    return;

  // Toggle active section
  document
    .querySelectorAll(".dash-section")
    .forEach((s) => s.classList.remove("active"));
  targetSection.classList.add("active");

  // Dynamically update dashboard header based on active tab
  const meta = dashTabMeta[cleanId];
  if (meta) {
    const eyebrowEl = document.getElementById("dashEyebrow");
    const titleEl = document.getElementById("dashTitle");
    const subtitleEl = document.getElementById("dashSubtitle");
    if (eyebrowEl) eyebrowEl.textContent = meta.eyebrow;
    if (titleEl) titleEl.textContent = meta.title;
    if (subtitleEl) subtitleEl.textContent = meta.subtitle;
  }

  // Update active navigation state
  document.querySelectorAll(".side-links > a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === `#${cleanId}`) {
      a.classList.add("active");
    } else if (href.startsWith("#")) {
      a.classList.remove("active");
    }
  });

  // Close mobile sidebar if open
  document.getElementById("navLinks")?.classList.remove("open");
  document.getElementById("sideLinks")?.classList.remove("open");

  // Scroll to top of dash-main
  const main = document.querySelector(".dash-main");
  if (main) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
window.switchDashTab = switchDashTab;

// Bind clicks on sidebar navigation links
document.querySelectorAll(".side-links > a").forEach((a) => {
  const href = a.getAttribute("href");
  if (href && href.startsWith("#")) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", href);
      switchDashTab(href);
    });
  }
});

// React to browser back/forward or hash changes
window.addEventListener("hashchange", () => {
  if (window.location.hash) {
    switchDashTab(window.location.hash);
  }
});

// Initialize on page load for dashboard
if (document.querySelector(".dashboard")) {
  const initialHash = window.location.hash || "#overview";
  switchDashTab(initialHash);
}

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
