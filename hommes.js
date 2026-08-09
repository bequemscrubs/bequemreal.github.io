document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       VARIABLES
    ========================= */

    const topProducts = document.querySelectorAll("#tops .product");
    const pantProducts = document.querySelectorAll("#pants .product");

    let selectedTop = null;
    let selectedPant = null;
    let selectedColor = null;
    let selectedSize = null;
    let selectedMotif = "AUCUN";
    let selectedPlacement = "AUCUN";


    /* =========================
       TOPS
    ========================= */

    function updateTop() {

        topProducts.forEach(function (product) {
            product.style.display = "none";
        });

        if (selectedTop !== null) {

            topProducts[selectedTop].style.display = "block";

            document.getElementById("summaryTop").textContent =
                topProducts[selectedTop].dataset.name;
        }

    }


    window.nextTop = function () {

        if (selectedTop === null) {
            selectedTop = 0;
        } else {
            selectedTop++;

            if (selectedTop >= topProducts.length) {
                selectedTop = 0;
            }
        }

        updateTop();
    };


    window.previousTop = function () {

        if (selectedTop === null) {
            selectedTop = topProducts.length - 1;
        } else {
            selectedTop--;

            if (selectedTop < 0) {
                selectedTop = topProducts.length - 1;
            }
        }

        updateTop();
    };


    /* =========================
       PANTS
    ========================= */

    function updatePant() {

        pantProducts.forEach(function (product) {
            product.style.display = "none";
        });

        if (selectedPant !== null) {

            pantProducts[selectedPant].style.display = "block";

            document.getElementById("summaryPant").textContent =
                pantProducts[selectedPant].dataset.name;
        }

    }


    window.nextPant = function () {

        if (selectedPant === null) {
            selectedPant = 0;
        } else {
            selectedPant++;

            if (selectedPant >= pantProducts.length) {
                selectedPant = 0;
            }
        }

        updatePant();
    };


    window.previousPant = function () {

        if (selectedPant === null) {
            selectedPant = pantProducts.length - 1;
        } else {
            selectedPant--;

            if (selectedPant < 0) {
                selectedPant = pantProducts.length - 1;
            }
        }

        updatePant();
    };


    /* =========================
       COLOR
    ========================= */

    const colorButtons =
        document.querySelectorAll(".color-choice");


    colorButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            colorButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedColor =
                button.dataset.color;

        });

    });


    /* =========================
       SIZE
    ========================= */

    const sizeButtons =
        document.querySelectorAll(".size-choice");


    sizeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            sizeButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedSize =
                button.dataset.size;

        });

    });


    /* =========================
       MOTIF
    ========================= */

    const motifButtons =
        document.querySelectorAll(".motif-choice");


    motifButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            motifButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedMotif =
                button.dataset.motif;

        });

    });


    /* =========================
       PLACEMENT
    ========================= */

    const placementButtons =
        document.querySelectorAll(".placement-choice");


    placementButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            placementButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedPlacement =
                button.dataset.placement;

        });

    });


    /* =========================
       ADD TO CART
    ========================= */

    const addToCart =
        document.querySelector(".cart");


    addToCart.addEventListener("click", function () {

        /* Vérification haut */

        if (selectedTop === null) {

            alert("Veuillez choisir un tricot.");

            return;
        }


        /* Vérification pantalon */

        if (selectedPant === null) {

            alert("Veuillez choisir un pantalon.");

            return;
        }


        /* Vérification couleur */

        if (selectedColor === null) {

            alert("Veuillez choisir une couleur.");

            return;
        }


        /* Vérification taille */

        if (selectedSize === null) {

            alert("Veuillez choisir une taille.");

            return;
        }


        /* =========================
           MOTIF
           Facultatif
        ========================= */

        const motifText =
            document.getElementById("motifDescription")
                ?.value.trim() || "";


        const item = {

            category: "HOMMES",

            top:
                topProducts[selectedTop]
                    .dataset.name,

            pants:
                pantProducts[selectedPant]
                    .dataset.name,

            color:
                selectedColor,

            size:
                selectedSize,

            motif:
                selectedMotif,

            placement:
                selectedPlacement,

            motifDescription:
                motifText,

            quantity: 1

        };


        /* =========================
           SAVE CART
        ========================= */

        let cart =
            JSON.parse(
                localStorage.getItem("bequemCart")
            ) || [];


        cart.push(item);


        localStorage.setItem(
            "bequemCart",
            JSON.stringify(cart)
        );


        /* =========================
           SUCCESS
        ========================= */

        addToCart.textContent =
            "ADDED ✓";


        setTimeout(function () {

            addToCart.textContent =
                "ADD TO CART →";

        }, 1800);


        console.log(
            "BEQUEM SCRUBS CART:",
            item
        );

    });


    /* =========================
       INITIAL STATE
    ========================= */

    updateTop();
    updatePant();

});
