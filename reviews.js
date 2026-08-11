```javascript
// ======================================================
// BEQUEM SCRUBS — REVIEWS SYSTEM
// ======================================================

// ------------------------------------------------------
// SUPABASE
// ------------------------------------------------------

const SUPABASE_URL = "https://pakwsesbisdkgtoeywam.supabase.co";

// ⚠️ Mets ici TA clé Publishable / anon.
// Ne mets JAMAIS une service_role / secret key.
const SUPABASE_ANON_KEY = sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ======================================================
// GLOBAL DATA
// ======================================================

let approvedReviews = [];
let currentReviewIndex = 0;


// ======================================================
// DOM READY
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("BEQUEM REVIEWS SYSTEM LOADED");

    setupStars();
    setupReviewForm();
    setupPhotoPreview();

    loadApprovedReviews();
    loadPendingReviews();

    setupReviewSlider();
    setupPhotoSlider();
});


// ======================================================
// ⭐ STAR RATING
// ======================================================

function setupStars() {

    const stars = document.querySelectorAll(
        "#reviewForm .star"
    );

    const ratingInput =
        document.getElementById("reviewRating");

    if (!stars.length || !ratingInput) {
        return;
    }

    stars.forEach(function (star) {

        star.addEventListener("click", function (event) {

            event.preventDefault();

            const rating = Number(
                star.dataset.rating
            );

            ratingInput.value = rating;

            updateStars(rating);

            console.log(
                "Selected rating:",
                rating
            );

        });

    });
}


function updateStars(rating) {

    const stars = document.querySelectorAll(
        "#reviewForm .star"
    );

    stars.forEach(function (star) {

        const starRating =
            Number(star.dataset.rating);

        star.classList.toggle(
            "active",
            starRating <= rating
        );

    });
}


// ======================================================
// 📝 REVIEW FORM
// ======================================================

function setupReviewForm() {

    const form =
        document.getElementById("reviewForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("reviewName")
                    .value
                    .trim();

            const city =
                document
                    .getElementById("reviewCity")
                    .value
                    .trim();

            const rating =
                Number(
                    document
                        .getElementById("reviewRating")
                        .value
                );

            const reviewText =
                document
                    .getElementById("reviewText")
                    .value
                    .trim();

            const message =
                document.getElementById(
                    "reviewMessage"
                );

            const button =
                form.querySelector(
                    ".submit-review"
                );


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!name) {

                showMessage(
                    message,
                    "Please enter your first name."
                );

                return;
            }


            if (!rating || rating < 1) {

                showMessage(
                    message,
                    "Please choose a rating."
                );

                return;
            }


            if (!reviewText) {

                showMessage(
                    message,
                    "Please write your review."
                );

                return;
            }


            // ------------------------------------------
            // LOADING
            // ------------------------------------------

            button.disabled = true;
            button.textContent = "SENDING...";

            showMessage(
                message,
                ""
            );


            // ------------------------------------------
            // INSERT
            // ------------------------------------------

            const reviewData = {

                name: name,

                city: city,

                rating: rating,

                review: reviewText,

                approved: false

            };


            console.log(
                "Sending review:",
                reviewData
            );


            const {
                data,
                error
            } = await supabaseClient

                .from("reviews")

                .insert([reviewData])

                .select();


            // ------------------------------------------
            // ERROR
            // ------------------------------------------

            if (error) {

                console.error(
                    "SUPABASE INSERT ERROR:",
                    error
                );

                showMessage(
                    message,
                    "Something went wrong. Please try again."
                );

                button.disabled = false;
                button.textContent =
                    "SEND REVIEW →";

                return;
            }


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            console.log(
                "REVIEW SUCCESS:",
                data
            );


            showMessage(
                message,
                "Thank you! Your review has been submitted and is waiting for approval."
            );


            form.reset();

            // Reset rating
            const ratingInput =
                document.getElementById(
                    "reviewRating"
                );

            if (ratingInput) {
                ratingInput.value = "0";
            }

            updateStars(0);


            // Reset photo preview
            const preview =
                document.getElementById(
                    "photoPreview"
                );

            if (preview) {
                preview.innerHTML = "";
            }


            button.disabled = false;

            button.textContent =
                "SEND REVIEW →";

        }
    );
}


// ======================================================
// MESSAGE
// ======================================================

function showMessage(element, text) {

    if (!element) {
        return;
    }

    element.textContent = text;
}


// ======================================================
// 📸 PHOTO PREVIEW
// ======================================================

function setupPhotoPreview() {

    const input =
        document.getElementById(
            "reviewPhotos"
        );

    const preview =
        document.getElementById(
            "photoPreview"
        );

    if (!input || !preview) {
        return;
    }


    input.addEventListener(
        "change",
        function () {

            preview.innerHTML = "";


            Array.from(input.files).forEach(
                function (file) {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const img =
                                document.createElement(
                                    "img"
                                );

                            img.src =
                                event.target.result;

                            img.alt =
                                "Review photo";

                            preview.appendChild(
                                img
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }
    );
}


// ======================================================
// 🌐 LOAD APPROVED REVIEWS
// ======================================================

async function loadApprovedReviews() {

    const {
        data,
        error
    } = await supabaseClient

        .from("reviews")

        .select("*")

        .eq("approved", true)

        .order(
            "id",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "SUPABASE SELECT ERROR:",
            error
        );

        return;
    }


    approvedReviews =
        data || [];


    console.log(
        "APPROVED REVIEWS:",
        approvedReviews
    );


    currentReviewIndex = 0;


    renderCurrentReview();

    updateReviewCounter();
}


// ======================================================
// ⭐ RENDER CURRENT REVIEW
// ======================================================

function renderCurrentReview() {

    if (
        !approvedReviews.length
    ) {
        return;
    }


    const review =
        approvedReviews[
            currentReviewIndex
        ];


    const name =
        document.getElementById(
            "displayName"
        );

    const city =
        document.getElementById(
            "displayCity"
        );

    const text =
        document.getElementById(
            "displayReview"
        );

    const stars =
        document.getElementById(
            "displayStars"
        );


    if (name) {

        name.textContent =
            review.name ||
            "BEQUEM CUSTOMER";

    }


    if (city) {

        city.textContent =
            review.city ||
            "—";

    }


    if (text) {

        text.textContent =
            `"${review.review || ""}"`;

    }


    if (stars) {

        const rating =
            Number(
                review.rating || 0
            );

        stars.textContent =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);

    }


    updateReviewCounter();
}


// ======================================================
// ↔️ REVIEW SLIDER
// ======================================================

function setupReviewSlider() {

    const previous =
        document.getElementById(
            "reviewPrev"
        );

    const next =
        document.getElementById(
            "reviewNext"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            function () {

                if (
                    !approvedReviews.length
                ) {
                    return;
                }

                currentReviewIndex--;

                if (
                    currentReviewIndex < 0
                ) {

                    currentReviewIndex =
                        approvedReviews.length - 1;

                }

                renderCurrentReview();

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function () {

                if (
                    !approvedReviews.length
                ) {
                    return;
                }

                currentReviewIndex++;

                if (
                    currentReviewIndex >=
                    approvedReviews.length
                ) {

                    currentReviewIndex = 0;

                }

                renderCurrentReview();

            }
        );

    }
}


// ======================================================
// COUNTER
// ======================================================

function updateReviewCounter() {

    const current =
        document.getElementById(
            "reviewCurrent"
        );

    const total =
        document.getElementById(
            "reviewTotal"
        );


    if (current) {

        current.textContent =
            String(
                approvedReviews.length
                    ? currentReviewIndex + 1
                    : 0
            ).padStart(2, "0");

    }


    if (total) {

        total.textContent =
            String(
                approvedReviews.length
            ).padStart(2, "0");

    }
}


// ======================================================
// 👨‍💼 PENDING REVIEWS — ADMIN
// ======================================================

async function loadPendingReviews() {

    const container =
        document.getElementById(
            "pending-reviews"
        );


    // Ce bloc n'existe pas sur reviews.html.
    // Il existe uniquement sur ton application admin.
    if (!container) {
        return;
    }


    container.innerHTML =
        "Loading...";


    const {
        data,
        error
    } = await supabaseClient

        .from("reviews")

        .select("*")

        .eq("approved", false)

        .order(
            "id",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "SUPABASE PENDING ERROR:",
            error
        );

        container.innerHTML =
            "<p>Unable to load pending reviews.</p>";

        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML =
            "<p>No pending reviews.</p>";

        return;
    }


    container.innerHTML = "";


    data.forEach(
        function (review) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "pending-review";


            const rating =
                Number(
                    review.rating || 0
                );


            element.innerHTML = `

                <div class="review-content">

                    <h3>
                        ${escapeHTML(
                            review.name
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            review.review
                        )}
                    </p>

                    <small>
                        ${escapeHTML(
                            review.city || ""
                        )}
                        —
                        ${"★".repeat(rating)}
                    </small>

                </div>


                <div class="review-actions">

                    <button
                        type="button"
                        class="approve-review"
                        data-id="${review.id}">

                        Approve

                    </button>


                    <button
                        type="button"
                        class="reject-review"
                        data-id="${review.id}">

                        Reject

                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );


    // ------------------------------------------
    // APPROVE BUTTONS
    // ------------------------------------------

    container
        .querySelectorAll(
            ".approve-review"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        approveReview(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    // ------------------------------------------
    // REJECT BUTTONS
    // ------------------------------------------

    container
        .querySelectorAll(
            ".reject-review"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        rejectReview(
                            button.dataset.id
                        );

                    }
                );

            }
        );
}


// ======================================================
// ✅ APPROVE REVIEW
// ======================================================

async function approveReview(
    reviewId
) {

    console.log(
        "APPROVING:",
        reviewId
    );


    const {
        data,
        error
    } = await supabaseClient

        .from("reviews")

        .update({
            approved: true
        })

        .eq(
            "id",
            reviewId
        )

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
        "APPROVED:",
        data
    );


    await loadPendingReviews();

    alert(
        "Review approved!"
    );
}


// ======================================================
// ❌ REJECT REVIEW
// ======================================================

async function rejectReview(
    reviewId
) {

    const confirmed =
        confirm(
            "Are you sure you want to reject this review?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await supabaseClient

        .from("reviews")

        .delete()

        .eq(
            "id",
            reviewId
        );


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


    await loadPendingReviews();


    alert(
        "Review rejected."
    );
}


// ======================================================
// 📸 CUSTOMER PHOTO SLIDER
// ======================================================

function setupPhotoSlider() {

    const previous =
        document.getElementById(
            "photoPrev"
        );

    const next =
        document.getElementById(
            "photoNext"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            function () {

                console.log(
                    "Previous photo"
                );

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function () {

                console.log(
                    "Next photo"
                );

            }
        );

    }
}


// ======================================================
// SECURITY
// ======================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}
```
