// ======================================================
// BEQUEM SCRUBS — ADMIN
// ======================================================
//
// READ THIS BEFORE CHANGING ANYTHING.
//
// The login below is a convenience gate, NOT security. The username
// and password sit in this file, which anyone can read from the
// browser, and the RLS policies let the public key read, approve and
// delete reviews on its own. Someone who opens the console can do
// everything this page does without ever seeing the password.
//
// This is a deliberate trade-off to avoid creating a Supabase Auth
// account for now. To make it actually safe later:
//   1. run the "SECURE VERSION" block in supabase-setup.sql
//   2. create a user in Supabase -> Authentication -> Users
//   3. swap this gate for client.auth.signInWithPassword()
//
// ======================================================

const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

// Change these two. They are public, so do not reuse a password
// you use anywhere else.
const ADMIN_USERNAME = "bequem";
const ADMIN_PASSWORD = "bequem2026";

const SESSION_KEY = "bequem_admin_session";

let client = null;
let currentFilter = "pending";
let allReviews = [];

document.addEventListener("DOMContentLoaded", init);


// ======================================================
// START
// ======================================================

function init() {
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

    if (localStorage.getItem(SESSION_KEY) === ADMIN_USERNAME) {
        showDashboard(ADMIN_USERNAME);
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

    const message = document.getElementById("loginMessage");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const user = document.getElementById("loginUser").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (user !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            setMessage(message, "Wrong username or password.", true);
            return;
        }

        setMessage(message, "");

        document.getElementById("loginPassword").value = "";

        localStorage.setItem(SESSION_KEY, ADMIN_USERNAME);

        showDashboard(ADMIN_USERNAME);
    });
}

function initLogout() {
    const button = document.getElementById("logoutButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", function () {
        localStorage.removeItem(SESSION_KEY);
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
    document.getElementById("adminUser").textContent = "";
}

function showDashboard(user) {
    document.getElementById("loginSection").hidden = true;
    document.getElementById("dashboardSection").hidden = false;
    document.getElementById("logoutButton").hidden = false;

    document.getElementById("adminUser").textContent = user;

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
            "Permanently delete the review from " +
                (name || "this customer") +
                "?"
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
