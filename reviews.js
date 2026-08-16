// ======================================================
// BEQUEM SCRUBS — REVIEWS
// ======================================================

const SUPABASE_URL =
    "https://pakwsesbisdkgtoeywam.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_-efPH13YWeBGHCuid9sYWw_Nm_vaaz9";

// Storage bucket used for the photos attached to a review.
// It must exist in Supabase and be public, otherwise the review
// is still saved but without its photos.
const PHOTO_BUCKET = "review-photos";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

let reviews = [];
let photos = [];
let currentIndex = 0;
let currentPhotoIndex = 0;
let cachedSupabaseClient = null;

function getSupabaseClient() {
    if (cachedSupabaseClient) {
        return cachedSupabaseClient;
    }

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {
        console.error(
            "Supabase library not loaded. Check the CDN script tag."
        );
        return null;
    }

    cachedSupabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    return cachedSupabaseClient;
}


// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("BEQUEM REVIEWS JS LOADED");

    initStars();
    initForm();
    initPhotoPreview();
    initReviewSlider();
    initPhotoSlider();

    loadApprovedReviews();
});


// ======================================================
// STARS
// ======================================================

function initStars() {
    const stars = document.querySelectorAll("#ratingStars .star");
    const ratingInput = document.getElementById("reviewRating");

    if (!stars.length || !ratingInput) {
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
        });
    });
}

function resetStars() {
    const ratingInput = document.getElementById("reviewRating");

    if (ratingInput) {
        ratingInput.value = "0";
    }

    document
        .querySelectorAll("#ratingStars .star")
        .forEach(function (star) {
            star.classList.remove("selected");
        });
}


// ======================================================
// FORM
// ======================================================

function initForm() {
    const form = document.getElementById("reviewForm");

    if (!form) {
        return;
    }

    const message = document.getElementById("reviewMessage");
    const button = form.querySelector(".submit-review");
    const defaultButtonText = button
        ? button.textContent.trim()
        : "SEND REVIEW →";

    function setMessage(text) {
        if (message) {
            message.textContent = text;
        }
    }

    function setLoading(isLoading) {
        if (!button) {
            return;
        }

        button.disabled = isLoading;
        button.textContent = isLoading ? "SENDING..." : defaultButtonText;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("reviewName").value.trim();
        const city = document.getElementById("reviewCity").value.trim();
        const review = document.getElementById("reviewText").value.trim();
        const rating = Number(
            document.getElementById("reviewRating").value
        );

        // VALIDATION

        if (!name) {
            setMessage("Please enter your first name.");
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            setMessage("Please choose your rating.");
            return;
        }

        if (!review) {
            setMessage("Please write your review.");
            return;
        }

        const client = getSupabaseClient();

        if (!client) {
            setMessage(
                "Connection unavailable. Please refresh the page and try again."
            );
            return;
        }

        setLoading(true);
        setMessage("");

        // PHOTOS

        const fileInput = document.getElementById("reviewPhotos");
        const files = fileInput ? Array.from(fileInput.files) : [];
        let photoUrls = [];

        if (files.length) {
            setMessage("Uploading your photos...");
            photoUrls = await uploadPhotos(client, files);
        }

        // INSERT
        // No .select() here: the public SELECT policy only
        // returns approved reviews, so it would come back empty.

        const { error } = await client.from("reviews").insert([
            {
                name: name,
                city: city,
                rating: rating,
                review: review,
                photo_urls: photoUrls,
                approved: false
            }
        ]);

        if (error) {
            console.error("SUPABASE INSERT ERROR:", error);
            setMessage("Something went wrong. Please try again.");
            setLoading(false);
            return;
        }

        // SUCCESS

        setMessage(
            "Thank you! Your review has been submitted for approval."
        );

        form.reset();
        resetStars();

        const preview = document.getElementById("photoPreview");

        if (preview) {
            preview.innerHTML = "";
        }

        setLoading(false);
    });
}


// ======================================================
// PHOTO UPLOAD
// ======================================================

async function uploadPhotos(client, files) {
    const urls = [];

    for (const file of files) {
        if (!file.type.startsWith("image/")) {
            continue;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            console.warn("Photo skipped, larger than 5 MB:", file.name);
            continue;
        }

        const extension = (file.name.split(".").pop() || "jpg")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        const path =
            Date.now() +
            "-" +
            Math.random().toString(36).slice(2, 10) +
            "." +
            (extension || "jpg");

        const { error } = await client.storage
            .from(PHOTO_BUCKET)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            console.warn(
                "PHOTO UPLOAD FAILED (bucket \"" +
                    PHOTO_BUCKET +
                    "\"):",
                error.message
            );
            continue;
        }

        const { data } = client.storage
            .from(PHOTO_BUCKET)
            .getPublicUrl(path);

        if (data && data.publicUrl) {
            urls.push(data.publicUrl);
        }
    }

    return urls;
}


// ======================================================
// PHOTO PREVIEW
// ======================================================

function initPhotoPreview() {
    const input = document.getElementById("reviewPhotos");
    const preview = document.getElementById("photoPreview");

    if (!input || !preview) {
        return;
    }

    input.addEventListener("change", function () {
        preview.innerHTML = "";

        Array.from(input.files).forEach(function (file) {
            if (!file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const img = document.createElement("img");

                img.src = event.target.result;
                img.alt = "Review photo";

                preview.appendChild(img);
            };

            reader.readAsDataURL(file);
        });
    });
}


// ======================================================
// LOAD APPROVED REVIEWS
// ======================================================

async function loadApprovedReviews() {
    const client = getSupabaseClient();

    if (!client) {
        displayReview();
        return;
    }

    const { data, error } = await client
        .from("reviews")
        .select(
            "id,name,city,rating,review,photo_urls,approved,created_at"
        )
        .eq("approved", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("SELECT REVIEWS ERROR:", error);
        displayReview();
        return;
    }

    reviews = data || [];
    currentIndex = 0;

    photos = [];

    reviews.forEach(function (review) {
        const list = Array.isArray(review.photo_urls)
            ? review.photo_urls
            : [];

        list.forEach(function (url) {
            if (typeof url === "string" && url) {
                photos.push(url);
            }
        });
    });

    currentPhotoIndex = 0;

    displayReview();
    displayPhoto();
}


// ======================================================
// DISPLAY REVIEW
// ======================================================

function displayReview() {
    const name = document.getElementById("displayName");
    const city = document.getElementById("displayCity");
    const text = document.getElementById("displayReview");
    const stars = document.getElementById("displayStars");

    // EMPTY STATE

    if (!reviews.length) {
        if (name) {
            name.textContent = "BEQUEM SCRUBS";
        }

        if (city) {
            city.textContent = "—";
        }

        if (text) {
            text.textContent =
                "\"No reviews yet. Be the first to share your experience.\"";
        }

        if (stars) {
            stars.textContent = "☆☆☆☆☆";
        }

        setArrowsEnabled("reviewPrev", "reviewNext", false);
        updateCounter();

        return;
    }

    const review = reviews[currentIndex];

    if (name) {
        name.textContent = review.name || "BEQUEM CUSTOMER";
    }

    if (city) {
        city.textContent = review.city || "—";
    }

    if (text) {
        text.textContent = "\"" + (review.review || "") + "\"";
    }

    if (stars) {
        const rating = Math.max(
            0,
            Math.min(5, Number(review.rating || 0))
        );

        stars.textContent =
            "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    setArrowsEnabled("reviewPrev", "reviewNext", reviews.length > 1);
    updateCounter();
}


// ======================================================
// REVIEW SLIDER
// ======================================================

function initReviewSlider() {
    const previous = document.getElementById("reviewPrev");
    const next = document.getElementById("reviewNext");

    if (previous) {
        previous.addEventListener("click", function () {
            if (!reviews.length) {
                return;
            }

            currentIndex =
                (currentIndex - 1 + reviews.length) % reviews.length;

            displayReview();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            if (!reviews.length) {
                return;
            }

            currentIndex = (currentIndex + 1) % reviews.length;

            displayReview();
        });
    }
}

function updateCounter() {
    const current = document.getElementById("reviewCurrent");
    const total = document.getElementById("reviewTotal");

    if (current) {
        current.textContent = String(
            reviews.length ? currentIndex + 1 : 0
        ).padStart(2, "0");
    }

    if (total) {
        total.textContent = String(reviews.length).padStart(2, "0");
    }
}

function setArrowsEnabled(previousId, nextId, isEnabled) {
    [previousId, nextId].forEach(function (id) {
        const arrow = document.getElementById(id);

        if (arrow) {
            arrow.disabled = !isEnabled;
            arrow.style.opacity = isEnabled ? "" : "0.3";
            arrow.style.cursor = isEnabled ? "" : "default";
        }
    });
}


// ======================================================
// CUSTOMER PHOTO SLIDER
// ======================================================

function initPhotoSlider() {
    const previous = document.getElementById("photoPrev");
    const next = document.getElementById("photoNext");

    if (previous) {
        previous.addEventListener("click", function () {
            if (!photos.length) {
                return;
            }

            currentPhotoIndex =
                (currentPhotoIndex - 1 + photos.length) % photos.length;

            displayPhoto();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            if (!photos.length) {
                return;
            }

            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;

            displayPhoto();
        });
    }
}

function displayPhoto() {
    const section = document.querySelector(".customer-photos");
    const image = document.getElementById("displayPhoto");

    // No customer photo yet: hide the whole section instead of
    // showing a broken placeholder image.

    if (!photos.length) {
        if (section) {
            section.hidden = true;
        }

        return;
    }

    if (section) {
        section.hidden = false;
    }

    if (image) {
        image.src = photos[currentPhotoIndex];
        image.alt = "BEQUEM customer photo";
    }

    setArrowsEnabled("photoPrev", "photoNext", photos.length > 1);
}
