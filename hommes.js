document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       VARIABLES
    ========================= */

    const topCards =
        document.querySelectorAll(
            '.product-card[data-type="top"]'
        );

    const pantsCards =
        document.querySelectorAll(
            '.product-card[data-type="pants"]'
        );


    let selectedTop = null;
    let selectedPants = null;

    let selectedColor = null;
    let selectedSize = null;

    let selectedMotif = "NO MOTIF";
    let selectedPlacement = null;


    /* =========================
       CAROUSEL
    ========================= */

    let topPosition = 0;
    let pantsPosition = 0;


    function moveTopCarousel() {

        const cardWidth =
            topCards[0].offsetWidth + 20;

        topPosition++;

        if (topPosition > 0) {
            topPosition = 0;
        }

        document.getElementById("topTrack").style.transform =
            `translateX(-${topPosition * cardWidth}px)`;
    }


    function movePantsCarousel() {

        const cardWidth =
            pantsCards[0].offsetWidth + 20;

        pantsPosition++;

        if (pantsPosition > 0) {
            pantsPosition = 0;
        }

        document.getElementById("pantsTrack").style.transform =
            `translateX(-${pantsPosition * cardWidth}px)`;
    }


    /*
       Les trois cartes restent visibles sur ordinateur.
       Les flèches sont conservées pour l'interface.
    */

    document.getElementById("topPrev")
        .addEventListener("click", function () {

            document.getElementById("topTrack").style.transform =
                "translateX(0)";

        });


    document.getElementById("topNext")
        .addEventListener("click", function () {

            document.getElementById("topTrack").style.transform =
                "translateX(0)";

        });


    document.getElementById("pantsPrev")
        .addEventListener("click", function () {

            document.getElementById("pantsTrack").style.transform =
                "translateX(0)";

        });


    document.getElementById("pantsNext")
        .addEventListener("click", function () {

            document.getElementById("pantsTrack").style.transform =
                "translateX(0)";

        });


    /* =========================
       TOP SELECTION
    ========================= */

    topCards.forEach(function (card) {

        card.addEventListener("click", function () {

            topCards.forEach(function (item) {

                item.classList.remove("selected");

            });


            card.classList.add("selected");


            selectedTop =
                card.dataset.value;


            document.getElementById("selectedTop")
                .textContent = selectedTop;


            document.getElementById("summaryTop")
                .textContent = selectedTop;


            updateStatus();

        });

    });


    /* =========================
       PANTS SELECTION
    ========================= */

    pantsCards.forEach(function (card) {

        card.addEventListener("click", function () {

            pantsCards.forEach(function (item) {

                item.classList.remove("selected");

            });


            card.classList.add("selected");


            selectedPants =
                card.dataset.value;


            document.getElementById("selectedPants")
                .textContent = selectedPants;


            document.getElementById("summaryPants")
                .textContent = selectedPants;


            updateStatus();

        });

    });


    /* =========================
       COLOR
    ========================= */

    document.querySelectorAll(".color-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".color-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedColor =
                    button.dataset.color;


                updateStatus();

            });

        });


    /* =========================
       SIZE
    ========================= */

    document.querySelectorAll(".size-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".size-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedSize =
                    button.dataset.size;


                updateStatus();

            });

        });


    /* =========================
       MOTIF
    ========================= */

    document.querySelectorAll(".motif-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".motif-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedMotif =
                    button.dataset.motif;

            });

        });


    /* =========================
       MOTIF PLACEMENT
    ========================= */

    document.querySelectorAll(".placement-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".placement-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedPlacement =
                    button.dataset.placement;

            });

        });


    /* =========================
       STATUS
    ========================= */

    function updateStatus() {

        const status =
            document.getElementById("selectionStatus");


        if (!selectedTop) {

            status.textContent =
                "Choose your top.";

            return;
        }


        if (!selectedPants) {

            status.textContent =
                "Choose your pants.";

            return;
        }


        if (!selectedColor) {

            status.textContent =
                "Choose a color.";

            return;
        }


        if (!selectedSize) {

            status.textContent =
                "Choose a size.";

            return;
        }


        status.textContent =
            "Your set is ready to add to cart.";

    }


    /* =========================
       ADD TO CART
    ========================= */

    document
        .getElementById("addToCart")
        .addEventListener("click", function () {


            /* TOP OBLIGATOIRE */

            if (!selectedTop) {

                alert(
                    "Please choose a top."
                );

                return;
            }


            /* PANTS OBLIGATOIRE */

            if (!selectedPants) {

                alert(
                    "Please choose your pants."
                );

                return;
            }


            /* COLOR OBLIGATOIRE */

            if (!selectedColor) {

                alert(
                    "Please choose a color."
                );

                return;
            }


            /* SIZE OBLIGATOIRE */

            if (!selectedSize) {

                alert(
                    "Please choose a size."
                );

                return;
            }


            /* MOTIF DESCRIPTION */

            const motifDescription =
                document
                    .getElementById("motifDescription")
                    .value
                    .trim();


            /* PRODUCT */

            const product = {

                category: "HOMMES",

                top: selectedTop,

                pants: selectedPants,

                color: selectedColor,

                size: selectedSize,

                motif: selectedMotif,

                placement:
                    selectedPlacement || "NONE",

                motifDescription:
                    motifDescription,

                quantity: 1

            };


            /* GET CART */

            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "bequemCart"
                    )
                ) || [];


            /* ADD */

            cart.push(product);


            /* SAVE */

            localStorage.setItem(
                "bequemCart",
                JSON.stringify(cart)
            );


            /* BUTTON */

            const button =
                document.getElementById(
                    "addToCart"
                );


            button.textContent =
                "ADDED ✓";


            setTimeout(function () {

                button.textContent =
                    "ADD TO CART →";

            }, 1800);


            console.log(
                "BEQUEM SCRUBS:",
                product
            );

        });


    /* =========================
       INITIAL STATUS
    ========================= */

    updateStatus();

});
