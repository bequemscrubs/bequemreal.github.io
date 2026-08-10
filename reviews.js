document.addEventListener("DOMContentLoaded", function () {


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



    /* =====================================
       SAMPLE REVIEWS
    ===================================== */

    const reviews = [

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


    reviewTotal.textContent =
        String(reviews.length).padStart(2, "0");


    function displayReviewItem(index) {

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


        /*
         * Small animation
         */

        reviewCard.style.opacity = "0";


        setTimeout(function () {

            reviewCard.style.opacity = "1";

        }, 100);

    }


    displayReviewItem(currentReview);



    /* =====================================
       NEXT REVIEW
    ===================================== */

    document
        .getElementById("reviewNext")
        .addEventListener("click", function () {

            currentReview++;

            if (currentReview >= reviews.length) {

                currentReview = 0;

            }

            displayReviewItem(currentReview);

        });



    /* =====================================
       PREVIOUS REVIEW
    ===================================== */

    document
        .getElementById("reviewPrev")
        .addEventListener("click", function () {

            currentReview--;

            if (currentReview < 0) {

                currentReview =
                    reviews.length - 1;

            }

            displayReviewItem(currentReview);

        });



    /* =====================================
       AUTOMATIC REVIEW SLIDER
    ===================================== */

    setInterval(function () {

        currentReview++;

        if (currentReview >= reviews.length) {

            currentReview = 0;

        }

        displayReviewItem(currentReview);

    }, 5000);



    /* =====================================
       CUSTOMER PHOTOS
    ===================================== */

    /*
     * Pour l'instant on utilise
     * tes images de démonstration.
     *
     * Plus tard, les photos envoyées
     * par les clients seront ajoutées
     * automatiquement après validation.
     */

    const customerPhotos = [

        "images/customer1.jpg",
        "images/customer2.jpg",
        "images/customer3.jpg"

    ];


    const displayPhoto =
        document.getElementById("displayPhoto");


    let currentPhoto = 0;


    function displayCustomerPhoto(index) {

        if (!customerPhotos.length) {
            return;
        }


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

    document
        .getElementById("photoNext")
        .addEventListener("click", function () {

            currentPhoto++;

            if (currentPhoto >= customerPhotos.length) {

                currentPhoto = 0;

            }

            displayCustomerPhoto(currentPhoto);

        });



    /* =====================================
       PREVIOUS PHOTO
    ===================================== */

    document
        .getElementById("photoPrev")
        .addEventListener("click", function () {

            currentPhoto--;

            if (currentPhoto < 0) {

                currentPhoto =
                    customerPhotos.length - 1;

            }

            displayCustomerPhoto(currentPhoto);

        });



    /* =====================================
       AUTOMATIC PHOTO SLIDER
    ===================================== */

    setInterval(function () {

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


    reviewForm.addEventListener(
        "submit",
        function (event) {

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


            /* =========================
               VALIDATION
            ========================= */

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


            /*
             * POUR LE MOMENT
             *
             * L'avis n'est pas encore
             * envoyé vers une base de données.
             *
             * On prépare simplement
             * le formulaire.
             */

            reviewMessage.textContent =
                "Thank you for your review. It has been submitted for approval.";


            reviewForm.reset();


            ratingInput.value = 0;


            stars.forEach(function (star) {

                star.classList.remove("selected");

            });


            photoPreview.innerHTML = "";

        }
    );

});
