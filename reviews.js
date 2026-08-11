// ==========================================
// REVIEWS SYSTEM - SUPABASE
// ==========================================

const SUPABASE_URL = "https://pakwsesbisdkgtoeywam.supabase.co";
const SUPABASE_ANON_KEY = "TON_ANON_KEY_ICI";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==========================================
// 1. AJOUTER UNE REVIEW
// ==========================================

async function submitReview(name, reviewText) {

    if (!name || !reviewText) {
        alert("Please fill in all fields.");
        return false;
    }

    const { data, error } = await supabaseClient
        .from("reviews")
        .insert([
            {
                name: name,
                review: reviewText,
                approved: false
            }
        ])
        .select();

    if (error) {
        console.error("SUPABASE INSERT ERROR:", error);
        alert("Something went wrong. Please try again.");
        return false;
    }

    alert("Your review has been submitted!");

    return true;
}


// ==========================================
// 2. AFFICHER LES REVIEWS APPROUVÉES
// ==========================================

async function loadApprovedReviews() {

    const container = document.getElementById("reviews-container");

    if (!container) {
        console.error("reviews-container not found");
        return;
    }

    container.innerHTML = "Loading reviews...";

    const { data, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("id", { ascending: false });

    if (error) {
        console.error("SUPABASE SELECT ERROR:", error);
        container.innerHTML =
            "<p>Unable to load reviews.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No reviews yet.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(review => {

        const reviewElement = document.createElement("div");

        reviewElement.className = "review";

        reviewElement.innerHTML = `
            <h3>${escapeHTML(review.name)}</h3>
            <p>${escapeHTML(review.review)}</p>
        `;

        container.appendChild(reviewElement);
    });
}


// ==========================================
// 3. CHARGER LES REVIEWS EN ATTENTE
// ==========================================

async function loadPendingReviews() {

    const container = document.getElementById("pending-reviews");

    if (!container) {
        console.error("pending-reviews not found");
        return;
    }

    container.innerHTML = "Loading...";

    const { data, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .eq("approved", false)
        .order("id", { ascending: false });

    if (error) {
        console.error("SUPABASE PENDING ERROR:", error);
        container.innerHTML =
            "<p>Unable to load pending reviews.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No pending reviews.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(review => {

        const element = document.createElement("div");

        element.className = "pending-review";

        element.innerHTML = `
            <div class="review-content">
                <h3>${escapeHTML(review.name)}</h3>
                <p>${escapeHTML(review.review)}</p>
            </div>

            <div class="review-actions">
                <button onclick="approveReview('${review.id}')">
                    Approve
                </button>

                <button onclick="rejectReview('${review.id}')">
                    Reject
                </button>
            </div>
        `;

        container.appendChild(element);
    });
}


// ==========================================
// 4. APPROUVER UNE REVIEW
// ==========================================

async function approveReview(reviewId) {

    console.log("Approving review:", reviewId);

    const { data, error } = await supabaseClient
        .from("reviews")
        .update({
            approved: true
        })
        .eq("id", reviewId)
        .select();

    if (error) {

        console.error(
            "SUPABASE APPROVE ERROR:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

        return;
    }

    console.log(
        "Review approved successfully:",
        data
    );

    alert("Review approved!");

    await loadPendingReviews();
}


// ==========================================
// 5. REJETER / SUPPRIMER UNE REVIEW
// ==========================================

async function rejectReview(reviewId) {

    const confirmation = confirm(
        "Are you sure you want to reject this review?"
    );

    if (!confirmation) {
        return;
    }

    const { error } = await supabaseClient
        .from("reviews")
        .delete()
        .eq("id", reviewId);

    if (error) {

        console.error(
            "SUPABASE DELETE ERROR:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

        return;
    }

    alert("Review rejected.");

    await loadPendingReviews();
}


// ==========================================
// 6. SÉCURITÉ HTML
// ==========================================

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


// ==========================================
// 7. INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Reviews system loaded.");

    loadApprovedReviews();
    loadPendingReviews();

});
