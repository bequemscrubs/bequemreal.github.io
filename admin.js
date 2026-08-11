// ======================================================
// BEQUEM SCRUBS — ADMIN
// ======================================================
//
// The password is NOT stored in this file. Authentication is
// handled by Supabase Auth, and what actually protects the data
// are the RLS policies on the "reviews" table: the public key
// alone can only read approved reviews and insert pending ones.
// Approving, editing and deleting require a logged in user.
//
// ======================================================

const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

let client = null;
let currentFilter = "pending";

document.addEventListener("DOMContentLoaded", init);


// ======================================================
// START
// ======================================================

async function init() {
    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {
        document.body.innerHTML =
            "<p style=\"padding:40px\">Supabase library failed to load.</p>";
        return;
    }

    client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    initLoginForm();
    initLogout();
    initTabs();

    const { data } = await client.auth.getSession();

    if (data && data.session) {
        showDashboard(data.session);
    } else {
        showLogin();
    }
}


// ======================================================
// LOGIN
// ======================================================

function initLoginForm() {
    const form = document.getElementById("loginForm");

    if (!form) {
        return;
    }

    const button = document.getElementById("loginButton");
    const message = document.getElementById("loginMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            setMessage(message, "Enter your email and password.", true);
            return;
        }

        button.disabled = true;
        button.textContent = "CHECKING...";
        setMessage(message, "");

        const { data, error } = await client.auth.signInWithPassword({
            email: email,
            password: password
        });

        button.disabled = false;
        button.textContent = "LOG IN →";

        if (error) {
            setMessage(message, "Login failed: " + error.message, true);
            return;
        }

        document.getElementById("loginPassword").value = "";

        showDashboard(data.session);
    });
}

function initLogout() {
    const button = document.getElementById("logoutButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", async function () {
        await client.auth.signOut();
        showLogin();
    });
}


// ======================================================
// VIEWS
// ======================================================

function showLogin() {
    document.getElementById("loginSection").hidden = false;
    document.getElementById("dashboardSection").hidden = true;
    document.getElementById("logoutButton").hidden = true;
    document.getElementById("adminEmail").textContent = "";
}

function showDashboard(session) {
    document.getElementById("loginSection").hidden = true;
    document.getElementById("dashboardSection").hidden = false;
    document.getElementById("logoutButton").hidden = false;

    document.getElementById("adminEmail").textContent =
        session && session.user ? session.user.email : "";

    loadReviews();
}


// ======================================================
// TABS
// ======================================================

function initTabs() {
    document.querySelectorAll(".tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            currentFilter = this.dataset.filter;

            document.querySelectorAll(".tab").forEach(function (item) {
                item.classList.toggle("active", item === tab);
            });

            renderList();
        });
    });

    const refresh = document.getElementById("refreshButton");

    if (refresh) {
        refresh.addEventListener("click", loadReviews);
    }
}


// ======================================================
// DATA
// ======================================================

let allReviews = [];

async function loadReviews() {
    const list = document.getElementById("reviewList");

    list.innerHTML = "<p class=\"empty\">Loading...</p>";

    const { data, error } = await client
        .from("reviews")
        .select(
            "id,name,city,rating,review,photo_urls,approved,created_at"
        )
        .order("created_at", { ascending: false });

    if (error) {
        console.error("LOAD REVIEWS ERROR:", error);

        list.innerHTML =
            "<p class=\"empty\">Unable to load reviews: " +
            escapeHTML(error.message) +
            "</p>";

        return;
    }

    allReviews = data || [];

    updateCounts();
    renderList();
}

function updateCounts() {
    const pending = allReviews.filter(function (review) {
        return !review.approved;
    }).length;

    document.getElementById("countPending").textContent = pending;

    document.getElementById("countApproved").textContent =
        allReviews.length - pending;
}


// ======================================================
// RENDER
// ======================================================

function renderList() {
    const list = document.getElementById("reviewList");

    const wantApproved = currentFilter === "approved";

    const visible = allReviews.filter(function (review) {
        return Boolean(review.approved) === wantApproved;
    });

    if (!visible.length) {
        list.innerHTML =
            "<p class=\"empty\">" +
            (wantApproved
                ? "No approved review yet."
                : "No pending review.") +
            "</p>";

        return;
    }

    list.innerHTML = "";

    visible.forEach(function (review) {
        list.appendChild(buildItem(review, wantApproved));
    });
}

function buildItem(review, isApproved) {
    const item = document.createElement("article");

    item.className = "review-item";

    const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));

    const photos = Array.isArray(review.photo_urls)
        ? review.photo_urls.filter(function (url) {
              return typeof url === "string" && url;
          })
        : [];

    const date = review.created_at
        ? new Date(review.created_at).toLocaleDateString()
        : "";

    item.innerHTML = `
        <header>
            <h3>${escapeHTML(review.name)}</h3>
            <span class="rating">${"★".repeat(rating)}${"☆".repeat(
        5 - rating
    )}</span>
            <span class="meta">
                ${escapeHTML(review.city || "—")} · ${escapeHTML(date)}
            </span>
        </header>

        <p class="text">${escapeHTML(review.review)}</p>

        ${
            photos.length
                ? '<div class="review-photos">' +
                  photos
                      .map(function (url) {
                          return (
                              '<img src="' +
                              escapeHTML(url) +
                              '" alt="Review photo">'
                          );
                      })
                      .join("") +
                  "</div>"
                : ""
        }

        <div class="review-actions">
            ${
                isApproved
                    ? '<button type="button" class="ghost-button unapprove-btn">UNPUBLISH</button>'
                    : '<button type="button" class="approve-btn">APPROVE</button>'
            }
            <button type="button" class="reject-btn">DELETE</button>
        </div>
    `;

    const approveButton = item.querySelector(".approve-btn");
    const unapproveButton = item.querySelector(".unapprove-btn");
    const deleteButton = item.querySelector(".reject-btn");

    if (approveButton) {
        approveButton.addEventListener("click", function () {
            setApproved(review.id, true, this);
        });
    }

    if (unapproveButton) {
        unapproveButton.addEventListener("click", function () {
            setApproved(review.id, false, this);
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            deleteReview(review.id, review.name, this);
        });
    }

    return item;
}


// ======================================================
// ACTIONS
// ======================================================

async function setApproved(id, approved, button) {
    button.disabled = true;

    const { error } = await client
        .from("reviews")
        .update({ approved: approved })
        .eq("id", id);

    button.disabled = false;

    if (error) {
        console.error("UPDATE ERROR:", error);
        alert("Could not update this review: " + error.message);
        return;
    }

    loadReviews();
}

async function deleteReview(id, name, button) {
    if (
        !confirm(
            "Permanently delete the review from " + (name || "this customer") + "?"
        )
    ) {
        return;
    }

    button.disabled = true;

    const { error } = await client.from("reviews").delete().eq("id", id);

    button.disabled = false;

    if (error) {
        console.error("DELETE ERROR:", error);
        alert("Could not delete this review: " + error.message);
        return;
    }

    loadReviews();
}


// ======================================================
// HELPERS
// ======================================================

function setMessage(element, text, isError) {
    if (!element) {
        return;
    }

    element.textContent = text;
    element.classList.toggle("error", Boolean(isError));
}

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
