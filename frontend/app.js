// API Configuration
const API = window.API_BASE || "https://websitecchs.onrender.com/api"; // Shared backend base URL

// --- Utility Functions ---
const getToken = () => localStorage.getItem("token");

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// --- Admin Auth ---
async function loginAdmin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    showNotification("Logged in successfully!", "success");
    window.location.href = "admin.html";

  } catch (err) {
    console.error(err);
    showNotification(err.message, "error");
  }
}

function logout() {
  localStorage.removeItem("token");
  showNotification("Logged out!", "success");
  window.location.href = "login.html";
}

// --- Section Management ---
function showAddGame() {
  document.getElementById("addGameSection").style.display = "block";
  document.getElementById("editGameSection").style.display = "none";
  document.getElementById("gameListSection").style.display = "none";
}

function showGameList() {
  document.getElementById("addGameSection").style.display = "none";
  document.getElementById("editGameSection").style.display = "none";
  document.getElementById("gameListSection").style.display = "block";
  loadGameList();
}

// --- CRUD Operations ---
async function addGame() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const html = document.getElementById("html").value.trim();
  const token = getToken();

  if (!title || !html) {
    showNotification("Title and HTML cannot be empty", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, html, description, category })
    });

    if (!res.ok) throw new Error("Failed to add test");

    showNotification("Test added successfully!", "success");
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("html").value = "";
    loadGameList();

  } catch (err) {
    console.error(err);
    showNotification(err.message, "error");
  }
}

async function loadGameList() {
  const listContainer = document.getElementById("gameList");
  const token = getToken();
  listContainer.innerHTML = "<p>Loading tests...</p>";

  try {
    const res = await fetch(`${API}/games`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load tests");

    const games = await res.json();
    listContainer.innerHTML = "";

    if (!games.length) {
      listContainer.innerHTML = "<p>No tests added yet. Use \"Add Test\" to create your first one.</p>";
      return;
    }

    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${escapeHtml(game.title)}</h3>
        <div style="display:flex;gap:5px;">
          <button onclick="editGame('${game._id}')">Edit</button>
          <button onclick="deleteGame('${game._id}')">Delete</button>
        </div>
      `;
      listContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    listContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

async function deleteGame(id) {
  if (!confirm("Are you sure you want to delete this test?")) return;
  const token = getToken();

  try {
    const res = await fetch(`${API}/games/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to delete test");

    showNotification("Test deleted!", "success");
    loadGameList();
  } catch (err) {
    console.error(err);
    showNotification(err.message, "error");
  }
}

async function editGame(id) {
  window.currentEditGameId = id;
  const token = getToken();
  try {
    // Fetch current data
    const res = await fetch(`${API}/games/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
      showNotification("This test could not be found (it may have been deleted).", "error");
      return;
    }
    const game = await res.json();

    // Populate edit form
    document.getElementById("editTitle").value = game.title || "";
    document.getElementById("editDescription").value = game.description || "";
    document.getElementById("editCategory").value = game.category || "";
    document.getElementById("editHtml").value = game.html || "";

    document.getElementById("addGameSection").style.display = "none";
    document.getElementById("editGameSection").style.display = "block";
    document.getElementById("gameListSection").style.display = "none";

  } catch (err) {
    console.error(err);
    showNotification(err.message, "error");
  }
}

async function saveEditedGame() {
  const id = window.currentEditGameId;
  if (!id) {
    showNotification("No test selected for editing.", "error");
    return;
  }

  const title = document.getElementById("editTitle").value.trim();
  const description = document.getElementById("editDescription").value.trim();
  const category = document.getElementById("editCategory").value.trim();
  const html = document.getElementById("editHtml").value.trim();
  const token = getToken();

  if (!title || !html) {
    showNotification("Title and HTML cannot be empty", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/games/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, html, description, category })
    });

    if (!res.ok) throw new Error("Failed to update test");

    showNotification("Test updated!", "success");
    window.currentEditGameId = null;
    document.getElementById("editGameSection").style.display = "none";
    document.getElementById("addGameSection").style.display = "none";
    document.getElementById("gameListSection").style.display = "block";
    loadGameList();
  } catch (err) {
    console.error(err);
    showNotification(err.message, "error");
  }
}

function cancelEdit() {
  window.currentEditGameId = null;
  document.getElementById("editGameSection").style.display = "none";
  document.getElementById("addGameSection").style.display = "block";
}

// --- Utility ---
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- On page load ---
document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  if (!token && window.location.pathname.includes("admin.html")) {
    showNotification("Please login first", "error");
    setTimeout(() => window.location.href = "login.html", 2000);
  }
});
