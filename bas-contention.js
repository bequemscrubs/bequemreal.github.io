document.addEventListener("DOMContentLoaded", function () {

    let selectedProduct = "CLASSIC";
    let selectedColor = null;
    let selectedSize = null;
    let quantity = 1;

    const products =
        document.querySelectorAll(".product-card");

    const selectedProductText =
        document.getElementById("selectedProduct");

    const summaryProduct =
        document.getElementById("summaryProduct");

    const summaryColor =
        document.getElementById("summaryColor");

    const summarySize =
        document.getElementById("summarySize");

    const summaryQuantity =
        document.getElementById("summaryQuantity");

    const status =
        document.getElementById("selectionStatus");


   /* ================= PRODUCT / SLIDER ================= */

const productsGrid =
    document.getElementById("productProducts");

const productCards =
    document.querySelectorAll(".product-card");

let currentProduct = 0;


/* Sélection d'un produit */

function selectProduct(index) {

    if (index < 0) {
        index = productCards.length - 1;
    }

    if (index >= productCards.length) {
        index = 0;
    }

    currentProduct = index;


    productCards.forEach(function (card) {

        card.classList.remove("selected");

    });


    const selectedCard =
        productCards[currentProduct];

    selectedCard.classList.add("selected");


    selectedProduct =
        selectedCard.dataset.value;


    selectedProductText.textContent =
        selectedProduct;


    summaryProduct.textContent =
        selectedProduct;


    /* Faire défiler jusqu'au produit */

    selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });

}


/* Produit suivant → */

document
    .getElementById("productNext")
    .addEventListener("click", function () {

        selectProduct(currentProduct + 1);

    });


/* Produit précédent ← */

document
    .getElementById("productPrev")
    .addEventListener("click", function () {

        selectProduct(currentProduct - 1);

    });


/* Cliquer directement sur une carte */

productCards.forEach(function (product, index) {

    product.addEventListener("click", function () {

        selectProduct(index);

    });

});


    /* ================= COLOR ================= */

    document
        .querySelectorAll(".color-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".color-choice")
                    .forEach(function (b) {
                        b.classList.remove("selected");
                    });

                button.classList.add("selected");

                selectedColor =
                    button.dataset.color;

                summaryColor.textContent =
                    selectedColor;

                updateStatus();

            });

        });


    /* ================= SIZE ================= */

    document
        .querySelectorAll(".size-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document
                    .querySelectorAll(".size-choice")
                    .forEach(function (b) {
                        b.classList.remove("selected");
                    });

                button.classList.add("selected");

                selectedSize =
                    button.dataset.size;

                summarySize.textContent =
                    selectedSize;

                updateStatus();

            });

        });


    /* ================= QUANTITY ================= */

    document
        .getElementById("plus")
        .addEventListener("click", function () {

            quantity++;

            summaryQuantity.textContent =
                quantity;

        });


    document
        .getElementById("minus")
        .addEventListener("click", function () {

            if (quantity > 1) {
                quantity--;
            }

            summaryQuantity.textContent =
                quantity;

        });


    /* ================= STATUS ================= */

    function updateStatus() {

        if (selectedColor && selectedSize) {

            status.textContent =
                "READY TO ADD TO CART.";

        } else {

            status.textContent =
                "Choose your color and size.";

        }

    }


    /* ================= ADD TO CART ================= */

    document
        .getElementById("addToCart")
        .addEventListener("click", function () {


            if (!selectedColor || !selectedSize) {

                alert(
                    "Please choose a color and a size."
                );

                return;

            }


            let cart = JSON.parse(
                localStorage.getItem("bequemCart") || "[]"
            );


            const item = {

                id:
                    "accessory-" +
                    Date.now(),

                category:
                    "BAS DE CONTENTION",

                product:
                    selectedProduct,

                color:
                    selectedColor,

                size:
                    selectedSize,

                quantity:
                    quantity

            };


            cart.push(item);


            localStorage.setItem(
                "bequemCart",
                JSON.stringify(cart)
            );


            window.location.href =
                "cart.html";

        });


    /* ================= CART COUNT ================= */

    const cartCount =
        document.getElementById("cartCount");


    const cart =
        JSON.parse(
            localStorage.getItem("bequemCart") || "[]"
        );


    let total = 0;

    cart.forEach(function (item) {

        total +=
            Number(item.quantity) || 1;

    });


    cartCount.textContent =
        total;

});
