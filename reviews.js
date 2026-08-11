document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================
       SUPABASE
    ===================================== */

    const SUPABASE_URL =
        "https://pakwsesbisdkgtoeywam.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";


    /* =====================================
       RATING — STARS
    ===================================== */

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



    /* =====================================
       PHOTO PREVIEW
    ===================================== */

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



    /* =====================================
       DEFAULT REVIEWS
    ===================================== */

    let reviews = [

        {
            name: "SARAH",
            city: "ORAN",
            rating: 5,
            text:
                "The most comfortable scrubs I've ever worn. They move with me during long shifts and still look great."
        },

        {
            name: "AMINE",
            city: "SIDI BEL ABBÈS",
            rating: 5,
            text:
                "Really comfortable and the fabric feels amazing. I can wear them for hours without feeling restricted."
        },

        {
            name: "LINA",
            city: "ALGIERS",
            rating: 5,
            text:
                "I love the fit. The scrub stays comfortable throughout my whole shift and the design is so clean."
        },

        {
            name: "YASMINE",
            city: "TLEMCEN",
            rating: 4,
            text:
                "The quality is exactly what I was looking for in medical wear. Comfortable, simple and easy to wear."
        }

    ];



    /* =====================================
       LOAD APPROVED REVIEWS
    ===================================== */

    async function getReviewsFromSupabase() {

        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/reviews" +
                "?select=name,city,rating,review,created_at" +
                "&approved=eq.true" +
                "&order=created_at.desc";


            const response =
                await fetch(url, {

                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY
                    }

                });


            if (!response.ok) {

                const error =
                    await response.text();

                console.error(
                    "SUPABASE GET ERROR:",
                    error
                );

                return [];

            }


            const data =
                await response.json();


            console.log(
                "APPROVED REVIEWS FROM SUPABASE:",
                data
            );


            if (!Array.isArray(data)) {
                return [];
            }


            return data.map(function (item) {

                return {

                    name:
                        item.name || "CUSTOMER",

                    city:
                        item.city || "",

                    rating:
                        Number(item.rating) || 5,

                    text:
                        item.review || ""

                };

            });


        } catch (error) {

            console.error(
                "SUPABASE CONNECTION ERROR:",
                error
            );

            return [];

        }

    }



    /* =====================================
       ADD SUPABASE REVIEWS
    ===================================== */

    const approvedReviews =
        await getReviewsFromSupabase();


    reviews =
        reviews.concat(approvedReviews);



    /* =====================================
       REVIEW SLIDER
    ===================================== */

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


    let currentReview = 0;


    function updateReviewCounter() {

        reviewTotal.textContent =
            String(reviews.length).padStart(2, "0");

    }


    function displayReviewItem(index) {

        if (!reviews.length) {
            return;
        }


        const review =
            reviews[index];


        displayStars.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);


        displayReview.textContent =
            `"${review.text}"`;


        displayName.textContent =
            review.name;


        displayCity.textContent =
            review.city;


        reviewCurrent.textContent =
            String(index + 1).padStart(2, "0");


        reviewCard.style.opacity = "0";


        setTimeout(function () {

            reviewCard.style.opacity = "1";

        }, 100);

    }


    updateReviewCounter();

    displayReviewItem(currentReview);



    /* =====================================
       NEXT REVIEW
    ===================================== */

    const reviewNext =
        document.getElementById("reviewNext");


    if (reviewNext) {

        reviewNext.addEventListener(
            "click",
            function () {

                currentReview++;

                if (currentReview >= reviews.length) {
                    currentReview = 0;
                }

                displayReviewItem(currentReview);

            }
        );

    }



    /* =====================================
       PREVIOUS REVIEW
    ===================================== */

    const reviewPrev =
        document.getElementById("reviewPrev");


    if (reviewPrev) {

        reviewPrev.addEventListener(
            "click",
            function () {

                currentReview--;

                if (currentReview < 0) {
                    currentReview =
                        reviews.length - 1;
                }

                displayReviewItem(currentReview);

            }
        );

    }



    /* =====================================
       AUTOMATIC REVIEW SLIDER
    ===================================== */

    setInterval(function () {

        if (!reviews.length) {
            return;
        }


        currentReview++;


        if (currentReview >= reviews.length) {
            currentReview = 0;
        }


        displayReviewItem(currentReview);

    }, 5000);



    /* =====================================
       CUSTOMER PHOTOS
    ===================================== */

    const customerPhotos = [];


    const displayPhoto =
        document.getElementById("displayPhoto");


    let currentPhoto = 0;


    function displayCustomerPhoto(index) {

        if (!customerPhotos.length) {

            if (displayPhoto) {
                displayPhoto.style.display = "none";
            }

            return;

        }


        displayPhoto.style.display = "block";

        displayPhoto.style.opacity = "0";


        setTimeout(function () {

            displayPhoto.src =
                customerPhotos[index];

            displayPhoto.style.opacity =
                "1";

        }, 150);

    }


    displayCustomerPhoto(currentPhoto);



    /* =====================================
       NEXT PHOTO
    ===================================== */

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

                if (currentPhoto >= customerPhotos.length) {
                    currentPhoto = 0;
                }

                displayCustomerPhoto(currentPhoto);

            }
        );

    }



    /* =====================================
       PREVIOUS PHOTO
    ===================================== */

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

                displayCustomerPhoto(currentPhoto);

            }
        );

    }



    /* =====================================
       AUTOMATIC PHOTO SLIDER
    ===================================== */

    setInterval(function () {

        if (!customerPhotos.length) {
            return;
        }

        currentPhoto++;

        if (currentPhoto >= customerPhotos.length) {
            currentPhoto = 0;
        }

        displayCustomerPhoto(currentPhoto);

    }, 4500);



    /* =====================================
       REVIEW FORM
    ===================================== */

    const reviewForm =
        document.getElementById("reviewForm");

    const reviewMessage =
        document.getElementById("reviewMessage");


    if (reviewForm) {

        reviewForm.addEventListener(
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


                const text =
                    document
                        .getElementById("reviewText")
                        .value
                        .trim();


                if (!name) {

                    reviewMessage.textContent =
                        "Please enter your first name.";

                    return;

                }


                if (!rating) {

                    reviewMessage.textContent =
                        "Please choose a rating.";

                    return;

                }


                if (!text) {

                    reviewMessage.textContent =
                        "Please write your review.";

                    return;

                }


                reviewMessage.textContent =
                    "Sending your review...";


                try {

                    const response =
                        await fetch(
                            SUPABASE_URL +
                            "/rest/v1/reviews",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "apikey":
                                        SUPABASE_KEY,

                                    "Prefer":
                                        "return=minimal"

                                },

                                body: JSON.stringify({

                                    name: name,

                                    city: city,

                                    rating: rating,

                                    review: text,

                                    approved: false

                                })

                            }
                        );


                    if (!response.ok) {

                        const error =
                            await response.text();

                        console.error(
                            "SUPABASE INSERT ERROR:",
                            error
                        );

                        throw new Error(
                            "Review could not be submitted."
                        );

                    }


                    reviewMessage.textContent =
                        "Thank you for your review. It has been submitted for approval.";


                    reviewForm.reset();


                    ratingInput.value = 0;


                    stars.forEach(function (star) {

                        star.classList.remove(
                            "selected"
                        );

                    });


                    photoPreview.innerHTML = "";


                } catch (error) {

                    console.error(
                        "REVIEW SUBMISSION ERROR:",
                        error
                    );


                    reviewMessage.textContent =
                        "Something went wrong. Please try again.";

                }

            }
        );

    }

});
