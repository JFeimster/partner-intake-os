const SIGNUP_URL = "https://tally.so/r/mOe658";

document.querySelectorAll("[data-signup-link]").forEach((link) => {
  link.setAttribute("href", SIGNUP_URL);
});

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Public pages must not store tokens, partner PII, lead PII, borrower data, admin sessions, audit logs, or commission data.
