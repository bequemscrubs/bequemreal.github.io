document.addEventListener("DOMContentLoaded", function () {

    /* ================================
       STATE
    ================================= */

    let selectedProduct = "CLASSIC";
    let selectedColor = null;
    let selectedSize = null;
    let quantity = 1;


    /* ================================
       ELEMENTS
    ================================= */

    const productCards =
        document.querySelectorAll(".product-card");

    const colorButtons =
        document.querySelectorAll(".color-choice");

    const sizeButtons =
        document.querySelectorAll(".size-choice");

    const productPrev =
        document.getElementById("productPrev");

    const productNext =
        document.getElementById("productNext");

    const minusButton =
        document.getElementById("minus");

    const plusButton =
        document.getElementById("plus");

    const addToCartButton =
        document.getElementById("addToCart");

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

    const quantityText =
        document.getElementById("quantity");

    const selectionStatus =
        document.getElementById("selectionStatus");

    const cartCount =
        document.getElementById("cartCount");


    /* ================================
       OUTFIT SAVED BEFORE BAS PAGE
    ================================= */

    let savedOutfit = null;

    try {

        savedOutfit =
            JSON.parse(
                localStorage.getItem(
                    "bequemCurrentOutfit"
                )
            );

    } catch (error) {

        savedOutfit = null;

    }


    /* ================================
       CART
    ================================= */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "bequemCart"
                ) || "[]"
            );

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            "bequemCart",
            JSON.stringify(cart)
        );

    }


    /* ================================
       CART COUNT
    ================================= */

    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        const cart = getCart();

        let total = 0;

        cart.forEach(function (item) {

            total +=
                Number(item.quantity) || 1;

        });

        cartCount.textContent = total;

    }


    /* ================================
       PRODUCT MODEL
    ================================= */

    productCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                productCards.forEach(
                    function (otherCard) {

                        otherCard.classList.remove(
                            "selected"
                        );

                    }
                );

                card.classList.add(
                    "selected"
                );

                selectedProduct =
                    card.dataset.value ||
                    "CLASSIC";

                if (selectedProductText) {

                    selectedProductText.textContent =
                        selectedProduct;

                }

                if (summaryProduct) {

                    summaryProduct.textContent =
                        selectedProduct;

                }

            }
        );

    });


    /* ================================
       COLOR
    ================================= */

    colorButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                colorButtons.forEach(
                    function (otherButton) {

                        otherButton.classList.remove(
                            "selected"
                        );

                    }
                );

                button.classList.add(
                    "selected"
                );

                selectedColor =
                    button.dataset.color ||
                    null;

                if (summaryColor) {

                    summaryColor.textContent =
                        selectedColor || "—";

                }

                updateStatus();

            }
        );

    });


    /* ================================
       SIZE
    ================================= */

    sizeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                sizeButtons.forEach(
                    function (otherButton) {

                        otherButton.classList.remove(
                            "selected"
                        );

                    }
                );

                button.classList.add(
                    "selected"
                );

                selectedSize =
                    button.dataset.size ||
                    null;

                if (summarySize) {

                    summarySize.textContent =
                        selectedSize || "—";

                }

                updateStatus();

            }
        );

    });


    /* ================================
       QUANTITY
    ================================= */

    function updateQuantity() {

        if (quantityText) {

            quantityText.textContent =
                quantity;

        }

        if (summaryQuantity) {

            summaryQuantity.textContent =
                quantity;

        }

    }


    if (minusButton) {

        minusButton.addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                }

                updateQuantity();

            }
        );

    }


    if (plusButton) {

        plusButton.addEventListener(
            "click",
            function () {

                quantity++;

                updateQuantity();

            }
        );

    }


    /* ================================
       STATUS
    ================================= */

    function updateStatus() {

        if (
            selectedColor &&
            selectedSize
        ) {

            selectionStatus.textContent =
                "READY TO ADD TO CART.";

        } else {

            selectionStatus.textContent =
                "Choose your color and size.";

        }

    }


    /* ================================
       MODEL ARROWS
    ================================= */

    function selectProductByIndex(index) {

        if (!productCards.length) {
            return;
        }

        if (index < 0) {
            index = productCards.length - 1;
        }

        if (
            index >= productCards.length
        ) {
            index = 0;
        }

        const card =
            productCards[index];

        card.click();

    }


    function getSelectedProductIndex() {

        let index = 0;

        productCards.forEach(
            function (card, i) {

                if (
                    card.classList.contains(
                        "selected"
                    )
                ) {

                    index = i;

                }

            }
        );

        return index;

    }


    if (productPrev) {

        productPrev.addEventListener(
            "click",
            function () {

                const current =
                    getSelectedProductIndex();

                selectProductByIndex(
                    current - 1
                );

            }
        );

    }


    if (productNext) {

        productNext.addEventListener(
            "click",
            function () {

                const current =
                    getSelectedProductIndex();

                selectProductByIndex(
                    current + 1
                );

            }
        );

    }


    /* ================================
       ADD TO CART
    ================================= */

    if (addToCartButton) {

        addToCartButton.addEventListener(
            "click",
            function () {

                /* ------------------------
                   COLOR REQUIRED
                ------------------------- */

                if (!selectedColor) {

                    alert(
                        "Please choose a color."
                    );

                    return;

                }


                /* ------------------------
                   SIZE REQUIRED
                ------------------------- */

                if (!selectedSize) {

                    alert(
                        "Please choose a size."
                    );

                    return;

                }


                /* ------------------------
                   GET CART
                ------------------------- */

                const cart =
                    getCart();


                /* ------------------------
                   ADD OUTFIT
                   AS SEPARATE ITEM
                ------------------------- */

                if (savedOutfit) {

                    const outfitItem = {

                        id:
                            "outfit-" +
                            Date.now(),

                        name:
                            savedOutfit.name ||
                            "BEQUEM SCRUB SET",

                        category:
                            savedOutfit.category ||
                            "SCRUB SET",

                        top:
                            savedOutfit.top ||
                            null,

                        pants:
                            savedOutfit.pants ||
                            null,

                        color:
                            savedOutfit.color ||
                            savedOutfit.scrubColor ||
                            null,

                        size:
                            savedOutfit.size ||
                            savedOutfit.scrubSize ||
                            null,

                        scrubColor:
                            savedOutfit.color ||
                            savedOutfit.scrubColor ||
                            null,

                        scrubSize:
                            savedOutfit.size ||
                            savedOutfit.scrubSize ||
                            null,

                        motif:
                            savedOutfit.motif ||
                            null,

                        quantity:
                            Number(
                                savedOutfit.quantity
                            ) || 1

                    };


                    cart.push(
                        outfitItem
                    );

                }


                /* ------------------------
                   ADD SOCKS
                   AS SEPARATE ITEM
                ------------------------- */

                const sockItem = {

                    id:
                        "compression-" +
                        Date.now(),

                    name:
                        "BAS DE CONTENTION",

                    category:
                        "ACCESSORY",

                    product:
                        selectedProduct,

                    model:
                        selectedProduct,

                    color:
                        selectedColor,

                    size:
                        selectedSize,

                    quantity:
                        quantity

                };


                cart.push(
                    sockItem
                );


                /* ------------------------
                   SAVE
                ------------------------- */

                saveCart(
                    cart
                );


                /* ------------------------
                   REMOVE TEMP OUTFIT
                ------------------------- */

                localStorage.removeItem(
                    "bequemCurrentOutfit"
                );


                /* ------------------------
                   FEEDBACK
                ------------------------- */

                addToCartButton.textContent =
                    "ADDED ✓";

                addToCartButton.disabled =
                    true;


                updateCartCount();


                /* ------------------------
                   GO TO CART
                ------------------------- */

                setTimeout(
                    function () {

                        window.location.href =
                            "cart.html";

                    },
                    600
                );

            }
        );

    }


    /* ================================
       INITIAL STATE
    ================================= */

    updateQuantity();

    updateCartCount();

    updateStatus();

});
