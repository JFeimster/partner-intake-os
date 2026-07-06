(function () {
  const form = document.querySelector("[data-admin-login-form]");
  const status = document.querySelector("[data-login-status]");

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = `status ${type || ""}`.trim();
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const token = String(new FormData(form).get("token") || "").trim();

    if (!token) {
      setStatus("Admin token is required.", "error");
      return;
    }

    if (button) button.disabled = true;
    setStatus("Creating admin session…", "");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.message || "Login failed.");
      }

      setStatus("Session created. Redirecting to review queue…", "ok");
      window.setTimeout(() => {
        window.location.href = "./index.html";
      }, 450);
    } catch (error) {
      setStatus(error.message || "Login failed.", "error");
    } finally {
      if (button) button.disabled = false;
    }
  });
})();
