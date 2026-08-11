document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SUPABASE
    ===================================================== */

    const SUPABASE_URL =
        "https://pakwsesbisdkgtoeywam.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";


    /* =====================================================
       RATING — STARS
    ===================================================== */

    const stars =
        document.querySelectorAll(".star");

    const ratingInput =
        document.getElementById("reviewRating");


    stars.forEach(function (star) {

        star.addEventListener("click", function () {

            const rating =
                Number(star.dataset.rating);

            ratingInput.value = rating;


            stars.forEach(function (item) {

                const itemRating =
                    Number(item.dataset.rating);

                if (itemRating <= rating) {

                    item.classList.add("selected");

                } else {

                    item.classList.remove("selected");

                }

            });

        });

    });


    /* =====================================================
       PHOTO PREVIEW
    ===================================================== */

    const photoInput =
        document.getElementById("reviewPhotos");

    const photoPreview =
        document.getElementById("photoPreview");


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function () {

                photoPreview.innerHTML = "";

                const files =
                    Array.from(photoInput.files);


                files.forEach(function (file) {

                    if (!file.type.startsWith("image/")) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const img =
                                document.createElement("img");

                            img.src =
                                event.target.result;

                            img.alt =
                                "BEQUEM customer photo";

                            photoPreview.appendChild(img);

                        };


                    reader.readAsDataURL(file);

                });

            }
        );

    }


    /* =====================================================
       REVIEWS
    ===================================================== */

    let reviews = [];

    let currentReview = 0;


    const reviewCard =
        document.getElementById("reviewCard");

    const displayStars =
        document.getElementById("displayStars");

    const displayReview =
        document.getElementById("displayReview");

    const displayName =
        document.getElementById("displayName");

    const displayCity =
        document.getElementById("displayCity");

    const reviewCurrent =
        document.getElementById("reviewCurrent");

    const reviewTotal =
        document.getElementById("reviewTotal");


    /* =====================================================
       DISPLAY REVIEW
    ===================================================== */

    function displayReviewItem(index) {

        if (!reviews.length) {

            displayStars.textContent =
                "★★★★★";

            displayReview.textContent =
                '"Your review will appear here."';

            displayName.textContent =
                "BEQUEM CUSTOMER";

            displayCity.textContent =
                "—";

            reviewCurrent.textContent =
                "01";

            reviewTotal.textContent =
                "01";

            return;

        }


        if (index >= reviews.length) {
            index = 0;
        }


        if (index < 0) {
            index = reviews.length - 1;
        }


        const review =
            reviews[index];


        let rating =
            Number(review.rating);


        if (!Number.isFinite(rating)) {
            rating = 0;
        }


        rating =
            Math.max(0, Math.min(5, rating));


        displayStars.textContent =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);


        displayReview.textContent =
            '"' + (review.review || "") + '"';


        displayName.textContent =
            review.name ||
            "BEQUEM CUSTOMER";


        displayCity.textContent =
            review.city
                ? "— " + review.city
                : "—";


        reviewCurrent.textContent =
            String(index + 1).padStart(2, "0");


        reviewTotal.textContent =
            String(reviews.length).padStart(2, "0");


        currentReview =
            index;


        if (reviewCard) {

            reviewCard.style.opacity = "0";


            setTimeout(function () {

                reviewCard.style.opacity = "1";

            }, 100);

        }

    }


    /* =====================================================
       LOAD APPROVED REVIEWS
    ===================================================== */

    async function loadReviews() {

        try {

            console.log("BEQUEM: chargement des avis...");


            const response =
                await fetch(
                    SUPABASE_URL +
                    "/rest/v1/reviews" +
                    "?select=id,name,city,rating,review,photo_urls,approved,created_at" +
                    "&approved=eq.true" +
                    "&order=created_at.desc",
                    {
                        method: "GET",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                "Bearer " +
                                SUPABASE_KEY,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "SUPABASE LOAD ERROR:",
                    response.status,
                    errorText
                );

                return;

            }


            const data =
                await response.json();


            console.log(
                "BEQUEM: avis approuvés reçus :",
                data
            );


            reviews =
                Array.isArray(data)
                    ? data
                    : [];


            currentReview = 0;


            displayReviewItem(0);


        } catch (error) {

            console.error(
                "BEQUEM: erreur de connexion Supabase :",
                error
            );

        }

    }


    /* =====================================================
       NEXT REVIEW
    ===================================================== */

    const reviewNext =
        document.getElementById("reviewNext");


    if (reviewNext) {

        reviewNext.addEventListener(
            "click",
            function () {

                if (!reviews.length) {
                    return;
                }


                currentReview++;


                if (currentReview >= reviews.length) {
                    currentReview = 0;
                }


                displayReviewItem(currentReview);

            }
        );

    }


    /* =====================================================
       PREVIOUS REVIEW
    ===================================================== */

    const reviewPrev =
        document.getElementById("reviewPrev");


    if (reviewPrev) {

        reviewPrev.addEventListener(
            "click",
            function () {

                if (!reviews.length) {
                    return;
                }


                currentReview--;


                if (currentReview < 0) {

                    currentReview =
                        reviews.length - 1;

                }


                displayReviewItem(currentReview);

            }
        );

    }


    /* =====================================================
       AUTOMATIC REVIEW SLIDER
    ===================================================== */

    setInterval(
        function () {

            if (!reviews.length) {
                return;
            }


            currentReview++;


            if (currentReview >= reviews.length) {
                currentReview = 0;
            }


            displayReviewItem(currentReview);

        },
        5000
    );


    /* =====================================================
       REVIEW FORM
    ===================================================== */

    const reviewForm =
        document.getElementById("reviewForm");

    const reviewMessage =
        document.getElementById("reviewMessage");


    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* ===============================
                   GET VALUES
                =============================== */

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


                const text =
                    document
                        .getElementById("reviewText")
                        .value
                        .trim();


                /* ===============================
                   VALIDATION
                =============================== */

                if (!name) {

                    reviewMessage.textContent =
                        "Please enter your first name.";

                    return;

                }


                if (!rating || rating < 1 || rating > 5) {

                    reviewMessage.textContent =
                        "Please choose a rating.";

                    return;

                }


                if (!text) {

                    reviewMessage.textContent =
                        "Please write your review.";

                    return;

                }


                /* ===============================
                   BUTTON
                =============================== */

                const submitButton =
                    reviewForm.querySelector(
                        ".submit-review"
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "SENDING...";

                }


                reviewMessage.textContent =
                    "Sending your review...";


                /* ===============================
                   INSERT INTO SUPABASE
                =============================== */

                try {

                    console.log(
                        "BEQUEM: envoi de l'avis..."
                    );


                    const response =
                        await fetch(
                            SUPABASE_URL +
                            "/rest/v1/reviews",
                            {
                                method: "POST",

                                headers: {

                                    "apikey":
                                        SUPABASE_KEY,

                                    "Authorization":
                                        "Bearer " +
                                        SUPABASE_KEY,

                                    "Content-Type":
                                        "application/json",

                                    "Prefer":
                                        "return=representation"
                                },

                                body:
                                    JSON.stringify({

                                        name:
                                            name,

                                        city:
                                            city || null,

                                        rating:
                                            rating,

                                        review:
                                            text,

                                        photo_urls:
                                            null,

                                        approved:
                                            false

                                    })
                            }
                        );


                    /* ===============================
                       ERROR
                    =============================== */

                    if (!response.ok) {

                        const errorText =
                            await response.text();


                        console.error(
                            "SUPABASE INSERT ERROR:",
                            response.status,
                            errorText
                        );


                        reviewMessage.textContent =
                            "Something went wrong. Please try again.";


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                            submitButton.textContent =
                                "SEND REVIEW →";

                        }


                        return;

                    }


                    /* ===============================
                       SUCCESS
                    =============================== */

                    const insertedReview =
                        await response.json();


                    console.log(
                        "BEQUEM: avis envoyé à Supabase :",
                        insertedReview
                    );


                    reviewMessage.textContent =
                        "Thank you! Your review has been submitted for approval.";


                    reviewForm.reset();


                    ratingInput.value =
                        0;


                    stars.forEach(function (star) {

                        star.classList.remove(
                            "selected"
                        );

                    });


                    if (photoPreview) {

                        photoPreview.innerHTML =
                            "";

                    }


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "SEND REVIEW →";

                    }


                } catch (error) {

                    console.error(
                        "BEQUEM: SUPABASE CONNECTION ERROR:",
                        error
                    );


                    reviewMessage.textContent =
                        "Connection error. Please try again.";


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "SEND REVIEW →";

                    }

                }

            }
        );

    }


    /* =====================================================
       CUSTOMER PHOTOS
       TEMPORARILY DISABLED
    ===================================================== */

    const customerPhotos = [];


    const displayPhoto =
        document.getElementById("displayPhoto");


    let currentPhoto = 0;


    function displayCustomerPhoto(index) {

        if (
            !displayPhoto ||
            !customerPhotos.length
        ) {
            return;
        }


        displayPhoto.src =
            customerPhotos[index];

    }


    const photoNext =
        document.getElementById("photoNext");


    if (photoNext) {

        photoNext.addEventListener(
            "click",
            function () {

                if (!customerPhotos.length) {
                    return;
                }


                currentPhoto++;


                if (
                    currentPhoto >=
                    customerPhotos.length
                ) {

                    currentPhoto = 0;

                }


                displayCustomerPhoto(
                    currentPhoto
                );

            }
        );

    }


    const photoPrev =
        document.getElementById("photoPrev");


    if (photoPrev) {

        photoPrev.addEventListener(
            "click",
            function () {

                if (!customerPhotos.length) {
                    return;
                }


                currentPhoto--;


                if (currentPhoto < 0) {

                    currentPhoto =
                        customerPhotos.length - 1;

                }


                displayCustomerPhoto(
                    currentPhoto
                );

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    displayReviewItem(0);

    loadReviews();

});
