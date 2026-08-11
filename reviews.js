// ======================================================
// BEQUEM SCRUBS — REVIEWS
// ======================================================

const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// ======================================================
// VARIABLES
// ======================================================

let approvedReviews = [];
let currentReviewIndex = 0;


// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    setupStars();
    setupReviewForm();
    setupPhotoPreview();

    loadApprovedReviews();
    loadPendingReviews();

    setupReviewSlider();

});


// ======================================================
// ⭐ STARS
// ======================================================

function setupStars() {

    const stars =
        document.querySelectorAll(
            "#reviewForm .star"
        );

    const ratingInput =
        document.getElementById(
            "reviewRating"
        );

    if (!stars.length || !ratingInput) {
        return;
    }

    stars.forEach(star => {

        star.addEventListener(
            "click",
            function () {

                const rating =
                    Number(
                        this.dataset.rating
                    );

                ratingInput.value =
                    rating;

                stars.forEach(s => {

                    const value =
                        Number(
                            s.dataset.rating
                        );

                    if (value <= rating) {

                        s.classList.add(
                            "active"
                        );

                    } else {

                        s.classList.remove(
                            "active"
                        );

                    }

                });

                console.log(
                    "Rating selected:",
                    rating
                );

            }
        );

    });

}


// ======================================================
// 📝 SUBMIT REVIEW
// ======================================================

function setupReviewForm() {

    const form =
        document.getElementById(
            "reviewForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "reviewName"
                    )
                    .value
                    .trim();

            const city =
                document
                    .getElementById(
                        "reviewCity"
                    )
                    .value
                    .trim();

            const rating =
                Number(
                    document
                        .getElementById(
                            "reviewRating"
                        )
                        .value
                );

            const review =
                document
                    .getElementById(
                        "reviewText"
                    )
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

                message.textContent =
                    "Please enter your name.";

                return;
            }


            if (!rating || rating < 1) {

                message.textContent =
                    "Please choose a rating.";

                return;
            }


            if (!review) {

                message.textContent =
                    "Please write your review.";

                return;
            }


            // ------------------------------------------
            // LOADING
            // ------------------------------------------

            button.disabled = true;

            button.textContent =
                "SENDING...";

            message.textContent =
                "";


            // ------------------------------------------
            // DATA
            // ------------------------------------------

            const reviewData = {

                name: name,

                city: city,

                rating: rating,

                review: review,

                photo_urls: [],

                approved: false

            };


            console.log(
                "Sending review:",
                reviewData
            );


            // ------------------------------------------
            // INSERT
            // ------------------------------------------

            const {
                error
            } = await supabaseClient

                .from("reviews")

                .insert([
                    reviewData
                ]);


            // ------------------------------------------
            // ERROR
            // ------------------------------------------

            if (error) {

                console.error(
                    "SUPABASE INSERT ERROR:",
                    error
                );

                message.textContent =
                    "Something went wrong. Please try again.";

                button.disabled = false;

                button.textContent =
                    "SEND REVIEW →";

                return;
            }


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            console.log(
                "Review successfully submitted."
            );


            message.textContent =
                "Thank you! Your review has been submitted for approval.";


            // Reset form
            form.reset();


            // Reset rating
            document.getElementById(
                "reviewRating"
            ).value = "0";


            document
                .querySelectorAll(
                    "#reviewForm .star"
                )
                .forEach(star => {

                    star.classList.remove(
                        "active"
                    );

                });


            button.disabled = false;

            button.textContent =
                "SEND REVIEW →";

        }
    );

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

            preview.innerHTML =
                "";


            Array.from(
                input.files
            ).forEach(file => {

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

            });

        }
    );

}


// ======================================================
// 🌐 APPROVED REVIEWS
// ======================================================

async function loadApprovedReviews() {

    const {
        data,
        error
    } = await supabaseClient

        .from("reviews")

        .select(
            "id,name,city,rating,review,photo_urls,approved,created_at"
        )

        .eq(
            "approved",
            true
        )

        .order(
            "created_at",
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
        "Approved reviews:",
        approvedReviews
    );


    currentReviewIndex =
        0;


    displayCurrentReview();

}


// ======================================================
// ⭐ DISPLAY REVIEW
// ======================================================

function displayCurrentReview() {

    if (
        !approvedReviews.length
    ) {
        return;
    }


    const review =
        approvedReviews[
            currentReviewIndex
        ];


    const displayName =
        document.getElementById(
            "displayName"
        );

    const displayCity =
        document.getElementById(
            "displayCity"
        );

    const displayReview =
        document.getElementById(
            "displayReview"
        );

    const displayStars =
        document.getElementById(
            "displayStars"
        );


    if (displayName) {

        displayName.textContent =
            review.name ||
            "BEQUEM CUSTOMER";

    }


    if (displayCity) {

        displayCity.textContent =
            review.city ||
            "—";

    }


    if (displayReview) {

        displayReview.textContent =
            `"${review.review}"`;

    }


    if (displayStars) {

        const rating =
            Number(
                review.rating || 0
            );


        displayStars.textContent =
            "★".repeat(rating) +
            "☆".repeat(
                5 - rating
            );

    }


    updateCounter();

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


                displayCurrentReview();

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

                    currentReviewIndex =
                        0;

                }


                displayCurrentReview();

            }
        );

    }

}


// ======================================================
// COUNTER
// ======================================================

function updateCounter() {

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
                currentReviewIndex + 1
            ).padStart(
                2,
                "0"
            );

    }


    if (total) {

        total.textContent =
            String(
                approvedReviews.length
            ).padStart(
                2,
                "0"
            );

    }

}


// ======================================================
// 👨‍💼 PENDING REVIEWS — OTHER APP
// ======================================================

async function loadPendingReviews() {

    const container =
        document.getElementById(
            "pending-reviews"
        );


    // reviews.html n'a pas ce conteneur.
    // L'application admin l'a.
    if (!container) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient

        .from("reviews")

        .select(
            "id,name,city,rating,review,photo_urls,approved,created_at"
        )

        .eq(
            "approved",
            false
        )

        .order(
            "created_at",
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
            "<p>Unable to load reviews.</p>";

        return;
    }


    container.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML =
            "<p>No pending reviews.</p>";

        return;
    }


    data.forEach(review => {

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
                    ${"☆".repeat(5 - rating)}
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

    });


    // Approve
    container
        .querySelectorAll(
            ".approve-review"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    approveReview(
                        this.dataset.id
                    );

                }
            );

        });


    // Reject
    container
        .querySelectorAll(
            ".reject-review"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    rejectReview(
                        this.dataset.id
                    );

                }
            );

        });

}


// ======================================================
// ✅ APPROVE
// ======================================================

async function approveReview(
    reviewId
) {

    console.log(
        "Approving:",
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
        "Approved:",
        data
    );


    await loadPendingReviews();


    alert(
        "Review approved!"
    );

}


// ======================================================
// ❌ REJECT
// ======================================================

async function rejectReview(
    reviewId
) {

    if (
        !confirm(
            "Are you sure you want to reject this review?"
        )
    ) {
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
alert("REVIEWS.JS IS WORKING");
