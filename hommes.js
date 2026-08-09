/* =========================================
   BEQUEM SCRUBS — MEN'S COLLECTION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const tops = Array.from(
        document.querySelectorAll("#tops .product")
    );

    const pants = Array.from(
        document.querySelectorAll("#pants .product")
    );

    let topIndex = 0;
    let pantIndex = 0;


    /* =========================================
       DISPLAY TOPS
    ========================================= */

    function displayTops() {

        tops.forEach((product, index) => {

            product.classList.remove("active");

            if (index === topIndex) {
                product.classList.add("active");
            }

        });

        document.getElementById("summaryTop").textContent =
            tops[topIndex].dataset.name;

    }


    /* =========================================
       DISPLAY PANTS
    ========================================= */

    function displayPants() {

        pants.forEach((product, index) => {

            product.classList.remove("active");

            if (index === pantIndex) {
                product.classList.add("active");
            }

        });

        document.getElementById("summaryPant").textContent =
            pants[pantIndex].dataset.name;

    }


    /* =========================================
       NEXT / PREVIOUS TOP
    ========================================= */

    window.nextTop = function () {

        topIndex++;

        if (topIndex >= tops.length) {
            topIndex = 0;
        }

        displayTops();

    };


    window.previousTop = function () {

        topIndex--;

        if (topIndex < 0) {
            topIndex = tops.length - 1;
        }

        displayTops();

    };


    /* =========================================
       NEXT / PREVIOUS PANTS
    ========================================= */

    window.nextPant = function () {

        pantIndex++;

        if (pantIndex >= pants.length) {
            pantIndex = 0;
        }

        displayPants();

    };


    window.previousPant = function () {

        pantIndex--;

        if (pantIndex < 0) {
            pantIndex = pants.length - 1;
        }

        displayPants();

    };


    /* =========================================
       CLICK DIRECTLY ON A TOP
    ========================================= */

    tops.forEach((product, index) => {

        product.addEventListener("click", () => {

            topIndex = index;

            displayTops();

        });

    });


    /* =========================================
       CLICK DIRECTLY ON PANTS
    ========================================= */

    pants.forEach((product, index) => {

        product.addEventListener("click", () => {

            pantIndex = index;

            displayPants();

        });

    });


    /* =========================================
       COLOR SELECTION
    ========================================= */

    const colorButtons =
        document.querySelectorAll(".option:nth-of-type(1) .choices button");

    let selectedColor = "BLACK";


    colorButtons.forEach(button => {

        button.addEventListener("click", () => {

            colorButtons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            selectedColor = button.textContent.trim();

        });

    });


    /* =========================================
       SIZE SELECTION
    ========================================= */

    const sizeButtons =
        document.querySelectorAll(".option:nth-of-type(2) .choices button");

    let selectedSize = "M";


    sizeButtons.forEach(button => {

        button.addEventListener("click", () => {

            sizeButtons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            selectedSize = button.textContent.trim();

        });

    });


    /* =========================================
       ADD TO CART
    ========================================= */

    const cartButton =
        document.querySelector(".cart");


    cartButton.addEventListener("click", () => {

        const product = {

            category: "HOMMES",

            top: tops[topIndex].dataset.name,

            pants: pants[pantIndex].dataset.name,

            color: selectedColor,

            size: selectedSize,

            quantity: 1

        };


        /* Get existing cart */

        let cart =
            JSON.parse(localStorage.getItem("bequemCart")) || [];


        /* Add product */

        cart.push(product);


        /* Save cart */

        localStorage.setItem(
            "bequemCart",
            JSON.stringify(cart)
        );


        /* Confirmation */

        cartButton.textContent =
            "ADDED ✓";


        setTimeout(() => {

            cartButton.textContent =
                "ADD TO CART →";

        }, 1800);


        console.log(
            "Added to cart:",
            product
        );

    });


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    displayTops();

    displayPants();

});
