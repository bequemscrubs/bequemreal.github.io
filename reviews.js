document.addEventListener("DOMContentLoaded", async function () {

    // =========================
    // SUPABASE
    // =========================
const SUPABASE_URL = "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_KEY = "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
    );


    // =========================
    // STARS
    // =========================

    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("reviewRating");

    stars.forEach(function (star) {

        star.addEventListener("click", function () {

            const rating = Number(star.dataset.rating);

            ratingInput.value = rating;

            stars.forEach(function (item) {

                if (Number(item.dataset.rating) <= rating) {
                    item.classList.add("selected");
                } else {
                    item.classList.remove("selected");
                }

            });

        });

    });


    // =========================
    // PHOTO PREVIEW
    // =========================

    const photoInput = document.getElementById("reviewPhotos");
    const photoPreview = document.getElementById("photoPreview");

    photoInput.addEventListener("change", function () {

        photoPreview.innerHTML = "";

        Array.from(photoInput.files).forEach(function (file) {

            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();

            reader.onload = function (event) {

                const img = document.createElement("img");

                img.src = event.target.result;
                img.alt = "Customer photo";

                photoPreview.appendChild(img);

            };

            reader.readAsDataURL(file);

        });

    });


    // =========================
    // LOAD REVIEWS
    // =========================

    let reviews = [];

    async function loadReviews() {

        const { data, error } = await supabaseClient
            .from("reviews")
            .select("*")
            .eq("approved", true)
            .order("created_at", { ascending: false });

        if (error) {

            console.error("LOAD REVIEWS ERROR:", error);

            return;

        }

        reviews = data || [];

        displayReview(0);

        loadPhotos();

    }


    // =========================
    // DISPLAY REVIEWS
    // =========================

    const displayStars =
        document.getElementById("displayStars");

    const displayReviewText =
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


    function displayReview(index) {

        if (!reviews.length) {

            displayStars.textContent = "☆☆☆☆☆";

            displayReviewText.textContent =
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

        const review = reviews[index];

        displayStars.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        displayReviewText.textContent =
            `"${review.review}"`;

        displayName.textContent =
            review.name;

        displayCity.textContent =
            review.city ? `— ${review.city}` : "—";

        reviewCurrent.textContent =
            String(index + 1).padStart(2, "0");

        reviewTotal.textContent =
            String(reviews.length).padStart(2, "0");

    }


    document
        .getElementById("reviewNext")
        .addEventListener("click", function () {

            if (!reviews.length) return;

            currentReview++;

            if (currentReview >= reviews.length) {
                currentReview = 0;
            }

            displayReview(currentReview);

        });


    document
        .getElementById("reviewPrev")
        .addEventListener("click", function () {

            if (!reviews.length) return;

            currentReview--;

            if (currentReview < 0) {
                currentReview = reviews.length - 1;
            }

            displayReview(currentReview);

        });


    // =========================
    // PHOTOS
    // =========================

    let customerPhotos = [];
    let currentPhoto = 0;

    const displayPhoto =
        document.getElementById("displayPhoto");


    function loadPhotos() {

        customerPhotos = [];

        reviews.forEach(function (review) {

            if (
                Array.isArray(review.photo_urls)
            ) {

                review.photo_urls.forEach(function (url) {

                    if (url) {
                        customerPhotos.push(url);
                    }

                });

            }

        });

        displayPhotoItem(0);

    }


    function displayPhotoItem(index) {

        if (!customerPhotos.length) {

            displayPhoto.src =
                "images/placeholder.jpg";

            return;

        }

        displayPhoto.src =
            customerPhotos[index];

    }


    document
        .getElementById("photoNext")
        .addEventListener("click", function () {

            if (!customerPhotos.length) return;

            currentPhoto++;

            if (currentPhoto >= customerPhotos.length) {
                currentPhoto = 0;
            }

            displayPhotoItem(currentPhoto);

        });


    document
        .getElementById("photoPrev")
        .addEventListener("click", function () {

            if (!customerPhotos.length) return;

            currentPhoto--;

            if (currentPhoto < 0) {
                currentPhoto = customerPhotos.length - 1;
            }

            displayPhotoItem(currentPhoto);

        });


    // =========================
    // SUBMIT REVIEW
    // =========================

    const reviewForm =
        document.getElementById("reviewForm");

    const reviewMessage =
        document.getElementById("reviewMessage");


    reviewForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("reviewName").value.trim();

        const city =
            document.getElementById("reviewCity").value.trim();

        const rating =
            Number(
                document.getElementById("reviewRating").value
            );

        const reviewText =
            document.getElementById("reviewText").value.trim();


        // VALIDATION

        if (!name) {

            reviewMessage.textContent =
                "Please enter your first name.";

            return;

        }


        if (rating < 1 || rating > 5) {

            reviewMessage.textContent =
                "Please choose a rating.";

            return;

        }


        if (!reviewText) {

            reviewMessage.textContent =
                "Please write your review.";

            return;

        }


        reviewMessage.textContent =
            "Sending your review...";


        try {

            // =========================
            // UPLOAD PHOTOS
            // =========================

            const photoUrls = [];

            for (const file of Array.from(photoInput.files)) {

                if (!file.type.startsWith("image/")) {
                    continue;
                }

                const extension =
                    file.name.split(".").pop();

                const fileName =
                    crypto.randomUUID() + "." + extension;

                const filePath =
                    "customers/" + fileName;


                const { error: uploadError } =
                    await supabaseClient
                        .storage
                        .from("reviews-photo")
                        .upload(
                            filePath,
                            file
                        );


                if (uploadError) {

                    console.error(
                        "PHOTO UPLOAD ERROR:",
                        uploadError
                    );

                    throw uploadError;

                }


                const { data } =
                    supabaseClient
                        .storage
                        .from("reviews-photo")
                        .getPublicUrl(filePath);


                photoUrls.push(
                    data.publicUrl
                );

            }


            // =========================
            // INSERT REVIEW
            // =========================

            const { error } =
                await supabaseClient
                    .from("reviews")
                    .insert({

                        name: name,

                        city: city,

                        rating: rating,

                        review: reviewText,

                        photo_urls: photoUrls,

                        approved: false

                    });


            if (error) {

                console.error(
                    "INSERT REVIEW ERROR:",
                    error
                );

                throw error;

            }


            // SUCCESS

            reviewMessage.textContent =
                "Thank you! Your review has been submitted for approval.";


            reviewForm.reset();

            ratingInput.value = 0;

            stars.forEach(function (star) {
                star.classList.remove("selected");
            });

            photoPreview.innerHTML = "";


        } catch (error) {

            console.error(
                "SUBMIT REVIEW ERROR:",
                error
            );

            reviewMessage.textContent =
                "Something went wrong. Please try again.";

        }

    });


    // =========================
    // START
    // =========================

    await loadReviews();

});
