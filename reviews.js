const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

let reviews = [];
let currentIndex = 0;
let cachedSupabaseClient = null;

function getSupabaseClient() {
    if (cachedSupabaseClient) {
        return cachedSupabaseClient;
    }

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {
        return null;
    }

    cachedSupabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    return cachedSupabaseClient;
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("BEQUEM REVIEWS JS LOADED");

    initStars();
    initForm();
    initPhotoPreview();
    initReviewSlider();

    loadApprovedReviews();
    loadPendingReviews();
});

function initStars() {
    const stars = document.querySelectorAll("#ratingStars .star");
    const ratingInput = document.getElementById("reviewRating");

    console.log("Stars found:", stars.length);

    if (!stars.length || !ratingInput) {
        console.error("Star system could not start.");
        return;
    }

    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            const rating = Number(this.dataset.rating || 0);

            ratingInput.value = String(rating);

            stars.forEach(function (item) {
                const value = Number(item.dataset.rating || 0);

                if (value <= rating) {
                    item.classList.add("selected");
                } else {
                    item.classList.remove("selected");
                }
            });

            console.log("Selected rating:", rating);
        });
    });
}

function initForm() {
    const form = document.getElementById("reviewForm");

    if (!form) {
        return;
    }

    const ratingInput = document.getElementById("reviewRating");
    const nameInput = document.getElementById("reviewName");
    const cityInput = document.getElementById("reviewCity");
    const reviewInput = document.getElementById("reviewText");
    const message = document.getElementById("reviewMessage");
    const button = form.querySelector(".submit-review");
    const defaultButtonText =
        button && button.textContent.trim()
            ? button.textContent
            : "SEND REVIEW →";

    function setMessage(text) {
        if (message) {
            message.textContent = text;
        }
