```javascript
/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   VARIABLES
===================================================== */

let reviews = [];

let currentReview = 0;

let selectedPhoto = null;


/* =====================================================
   ELEMENTS
===================================================== */

const form =
    document.getElementById("reviewForm");

const nameInput =
    document.getElementById("reviewName");

const cityInput =
    document.getElementById("reviewCity");

const ratingInput =
    document.getElementById("reviewRating");

const reviewInput =
    document.getElementById("reviewText");

const photoInput =
    document.getElementById("reviewPhoto");

const photoPreview =
    document.getElementById("photoPreview");

const message =
    document.getElementById("reviewMessage");

const submitButton =
    document.getElementById("submitReview");


/* =====================================================
   RATING
===================================================== */

document
    .querySelectorAll(".stars button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const rating =
                Number(button.dataset.rating);

            ratingInput.value = rating;


            document
                .querySelectorAll(".stars button")
                .forEach(star => {

                    const value =
                        Number(star.dataset.rating);

                    if (value <= rating) {

                        star.classList.add(
                            "selected"
                        );

                    } else {

                        star.classList.remove(
                            "selected"
                        );

                    }

                });

        });

    });


/* =====================================================
   PHOTO PREVIEW
===================================================== */

photoInput.addEventListener(
    "change",
    () => {

        const file =
            photoInput.files[0];


        if (!file) {

            selectedPhoto = null;

            photoPreview.innerHTML = "";

            return;

        }


        /*
         * Limite simple pour éviter
         * d'envoyer des fichiers énormes.
         */

        if (file.size > 2 * 1024 * 1024) {

            message.textContent =
                "PHOTO MUST BE UNDER 2MB.";

            photoInput.value = "";

            selectedPhoto = null;

            photoPreview.innerHTML = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                selectedPhoto =
                    event.target.result;


                photoPreview.innerHTML = `
                    <img
                        src="${selectedPhoto}"
                        alt="Photo preview"
                    >
                `;

            };


        reader.readAsDataURL(file);

    }
);


/* =====================================================
   SEND REVIEW
===================================================== */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        message.textContent = "";


        const name =
            nameInput.value.trim();


        const city =
            cityInput.value.trim();


        const review =
            reviewInput.value.trim();


        const rating =
            Number(ratingInput.value);


        if (!name) {

            message.textContent =
                "PLEASE ENTER YOUR NAME.";

            return;

        }


        if (!review) {

            message.textContent =
                "PLEASE WRITE YOUR REVIEW.";

            return;

        }


        if (
            rating < 1 ||
            rating > 5
        ) {

            message.textContent =
                "PLEASE SELECT A RATING.";

            return;

        }


        submitButton.disabled = true;

        submitButton.textContent =
            "SENDING...";


        try {


            const newReview = {

                name: name,

                city:
                    city || null,

                rating: rating,

                review: review,

                photo_urls:
                    selectedPhoto || null,

                approved: false

            };


            console.log(
                "REVIEW BEING SENT:",
                newReview
            );


            const result =
                await supabaseClient
                    .from("reviews")
                    .insert([newReview])
                    .select()
                    .single();


            console.log(
                "SUPABASE RESULT:",
                result
            );


            if (result.error) {

                console.error(
                    "SUPABASE INSERT ERROR:",
                    result.error
                );


                message.textContent =
                    "SUPABASE ERROR: " +
                    result.error.message;


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "SEND REVIEW →";


                return;

            }


            /* =========================================
               SUCCESS
            ========================================= */

            message.textContent =
                "THANK YOU — YOUR REVIEW HAS BEEN SENT.";


            form.reset();


            ratingInput.value =
                "0";


            selectedPhoto =
                null;


            photoPreview.innerHTML =
                "";


            document
                .querySelectorAll(".stars button")
                .forEach(star => {

                    star.classList.remove(
                        "selected"
                    );

                });


            submitButton.disabled =
                false;


            submitButton.textContent =
                "SEND REVIEW →";


        } catch (error) {


            console.error(
                "JAVASCRIPT ERROR:",
                error
            );


            message.textContent =
                "ERROR: " +
                error.message;


            submitButton.disabled =
                false;


            submitButton.textContent =
                "SEND REVIEW →";

        }

    }
);


/* =====================================================
   LOAD APPROVED REVIEWS
===================================================== */

async function loadReviews() {


    const result =
        await supabaseClient
            .from("reviews")
            .select(
                "id, name, city, rating, review, photo_urls, approved, created_at"
            )
            .eq(
                "approved",
                true
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    console.log(
        "LOAD REVIEWS RESULT:",
        result
    );


    if (result.error) {

        console.error(
            "SUPABASE LOAD ERROR:",
            result.error
        );

        return;

    }


    reviews =
        result.data || [];


    currentReview =
        reviews.length - 1;


    if (currentReview < 0) {

        currentReview = 0;

    }


    displayReview();

}


/* =====================================================
   DISPLAY REVIEW
===================================================== */

function displayReview() {


    const image =
        document.getElementById(
            "displayPhoto"
        );


    const stars =
        document.getElementById(
            "displayStars"
        );


    const reviewText =
        document.getElementById(
            "displayReview"
        );


    const name =
        document.getElementById(
            "displayName"
        );


    const city =
        document.getElementById(
            "displayCity"
        );


    if (!reviews.length) {


        image.style.display =
            "none";


        stars.textContent =
            "☆☆☆☆☆";


        reviewText.textContent =
            '"Your review will appear here."';


        name.textContent =
            "BEQUEM CUSTOMER";


        city.textContent =
            "—";


        return;

    }


    if (
        currentReview >=
        reviews.length
    ) {

        currentReview = 0;

    }


    if (currentReview < 0) {

        currentReview =
            reviews.length - 1;

    }


    const review =
        reviews[currentReview];


    /* =========================================
       PHOTO
    ========================================= */

    if (review.photo_urls) {

        image.src =
            review.photo_urls;

        image.style.display =
            "block";

    } else {

        image.removeAttribute(
            "src"
        );

        image.style.display =
            "none";

    }


    /* =========================================
       STARS
    ========================================= */

    const rating =
        Number(review.rating);


    stars.textContent =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);


    /* =========================================
       REVIEW
    ========================================= */

    reviewText.textContent =
        `"${review.review}"`;


    /* =========================================
       NAME
    ========================================= */

    name.textContent =
        review.name;


    /* =========================================
       CITY
    ========================================= */

    city.textContent =
        review.city
            ? "— " + review.city
            : "—";

}


/* =====================================================
   NEXT
===================================================== */

document
    .getElementById("nextReview")
    .addEventListener(
        "click",
        () => {

            if (!reviews.length)
                return;


            currentReview++;


            if (
                currentReview >=
                reviews.length
            ) {

                currentReview = 0;

            }


            displayReview();

        }
    );


/* =====================================================
   PREVIOUS
===================================================== */

document
    .getElementById("previousReview")
    .addEventListener(
        "click",
        () => {

            if (!reviews.length)
                return;


            currentReview--;


            if (currentReview < 0) {

                currentReview =
                    reviews.length - 1;

            }


            displayReview();

        }
    );


/* =====================================================
   START
===================================================== */

loadReviews();
```
