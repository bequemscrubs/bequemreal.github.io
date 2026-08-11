```javascript
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

let reviews = [];
let currentIndex = 0;


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "BEQUEM REVIEWS JS LOADED"
        );

        initStars();
        initForm();
        initPhotoPreview();
        initReviewSlider();

        loadApprovedReviews();
        loadPendingReviews();

    }
);


// ======================================================
// ⭐ STARS
// ======================================================

function initStars() {

    const stars =
        document.querySelectorAll(
            "#ratingStars .star"
        );

    const ratingInput =
        document.getElementById(
            "reviewRating"
        );


    console.log(
        "Stars found:",
        stars.length
    );


    if (
        !stars.length ||
        !ratingInput
    ) {
        console.error(
            "Star system could not start."
        );

        return;
    }


    stars.forEach(
        function (star) {

            star.addEventListener(
                "click",
                function () {

                    const rating =
                        Number(
                            this.dataset.rating
                        );


                    ratingInput.value =
                        rating;


                    stars.forEach(
                        function (item) {

                            const value =
                                Number(
                                    item.dataset.rating
                                );


                            if (
                                value <= rating
                            ) {

                                item.classList.add(
                                    "selected"
                                );

                            } else {

                                item.classList.remove(
                                    "selected"
                                );

                            }

                        }
                    );


                    console.log(
                        "Selected rating:",
                        rating
                    );

                }
            );

        }
    );

}


// ======================================================
// 📝 FORM
// ======================================================

function initForm() {

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
                document.getElementById(
                    "reviewName"
                ).value.trim();


            const city =
                document.getElementById(
                    "reviewCity"
                ).value.trim();


            const rating =
                Number(
                    document.getElementById(
                        "reviewRating"
                    ).value
                );


            const review =
                document.getElementById(
                    "reviewText"
                ).value.trim();


            const message =
                document.getElementById(
                    "reviewMessage"
                );


            const button =
                form.querySelector(
                    ".submit-review"
                );


            // VALIDATION

            if (!name) {

                message.textContent =
                    "Please enter your first name.";

                return;
            }


            if (
                !rating ||
                rating < 1 ||
                rating > 5
            ) {

                message.textContent =
                    "Please choose your rating.";

                return;
            }


            if (!review) {

                message.textContent =
                    "Please write your review.";

                return;
            }


            // LOADING

            button.disabled = true;

            button.textContent =
                "SENDING...";


            message.textContent =
                "";


            // DATA

            const reviewData = {

                name: name,

                city: city,

                rating: rating,

                review: review,

                photo_urls: [],

                approved: false

            };


            console.log(
                "Submitting:",
                reviewData
            );


            // INSERT
            // IMPORTANT:
            // No .select() here because
            // the public SELECT policy only
            // allows approved reviews.

            const {
                error
            } = await supabaseClient

                .from("reviews")

                .insert([
                    reviewData
                ]);


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


            // SUCCESS

            console.log(
                "REVIEW SENT SUCCESSFULLY"
            );


            message.textContent =
                "Thank you! Your review has been submitted for approval.";


            form.reset();


            document.getElementById(
                "reviewRating"
            ).value = "0";


            document
                .querySelectorAll(
                    "#ratingStars .star"
                )
                .forEach(
                    function (star) {

                        star.classList.remove(
                            "selected"
                        );

                    }
                );


            document.getElementById(
                "photoPreview"
            ).innerHTML = "";


            button.disabled = false;

            button.textContent =
                "SEND REVIEW →";

        }
    );

}


// ======================================================
// 📸 PHOTO PREVIEW
// ======================================================

function initPhotoPreview() {

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
            ).forEach(
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
            "SELECT REVIEWS ERROR:",
            error
        );

        return;
    }


    reviews =
        data || [];


    console.log(
        "Approved reviews:",
        reviews
    );


    currentIndex = 0;

    displayReview();

}


// ======================================================
// DISPLAY REVIEW
// ======================================================

function displayReview() {

    if (!reviews.length) {
        return;
    }


    const review =
        reviews[currentIndex];


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
            `"${review.review}"`;

    }


    if (stars) {

        const rating =
            Number(
                review.rating || 0
            );


        stars.textContent =
            "★".repeat(
                rating
            ) +
            "☆".repeat(
                5 - rating
            );

    }


    updateCounter();

}


// ======================================================
// REVIEW SLIDER
// ======================================================

function initReviewSlider() {

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

                if (!reviews.length) {
                    return;
                }


                currentIndex--;


                if (
                    currentIndex < 0
                ) {

                    currentIndex =
                        reviews.length - 1;

                }


                displayReview();

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function () {

                if (!reviews.length) {
                    return;
                }


                currentIndex++;


                if (
                    currentIndex >=
                    reviews.length
                ) {

                    currentIndex = 0;

                }


                displayReview();

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
                currentIndex + 1
            ).padStart(
                2,
                "0"
            );

    }


    if (total) {

        total.textContent =
            String(
                reviews.length
            ).padStart(
                2,
                "0"
            );

    }

}


// ======================================================
// 👨‍💼 PENDING REVIEWS
// ======================================================

async function loadPendingReviews() {

    const container =
        document.getElementById(
            "pending-reviews"
        );


    // Pas présent sur reviews.html.
    // Présent sur ton application admin.

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
            "PENDING REVIEWS ERROR:",
            error
        );


        container.innerHTML =
            "<p>Unable to load pending reviews.</p>";


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
                        ${"☆".repeat(5 - rating)}
                    </small>

                </div>

                <div class="review-actions">

                    <button
                        type="button"
                        class="approve-btn"
                        data-id="${review.id}">
                        Approve
                    </button>

                    <button
                        type="button"
                        class="reject-btn"
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


    // APPROVE

    container
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        approveReview(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    // REJECT

    container
        .querySelectorAll(
            ".reject-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        rejectReview(
                            this.dataset.id
                        );

                    }
                );

            }
        );

}


// ======================================================
// APPROVE
// ======================================================

async function approveReview(id) {

    const {
        error
    } = await supabaseClient

        .from("reviews")

        .update({
            approved: true
        })

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "APPROVE ERROR:",
            error
        );


        alert(
            "Something went wrong."
        );


        return;
    }


    alert(
        "Review approved!"
    );


    loadPendingReviews();

}


// ======================================================
// REJECT
// ======================================================

async function rejectReview(id) {

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
            id
        );


    if (error) {

        console.error(
            "REJECT ERROR:",
            error
        );


        alert(
            "Something went wrong."
        );


        return;
    }


    alert(
        "Review rejected."
    );


    loadPendingReviews();

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
