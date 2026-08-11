```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       VARIABLES
    ===================================== */

    let selectedProduct = "CLASSIC";
    let selectedColor = null;
    let selectedSize = null;
    let quantity = 1;


    /* =====================================
       CURRENT OUTFIT
    ===================================== */

    let savedOutfit = null;

    try {

        savedOutfit = JSON.parse(
            localStorage.getItem(
                "bequemCurrentOutfit"
            )
        );

    } catch (error) {

        savedOutfit = null;

    }


    /* =====================================
       ELEMENTS
    ===================================== */

    const products =
        document.querySelectorAll(
            ".product-card"
        );

    const selectedProductText =
        document.getElementById(
            "selectedProduct"
        );

    const summaryProduct =
        document.getElementById(
            "summaryProduct"
        );

    const summaryColor =
        document.getElementById(
            "summaryColor"
        );

    const summarySize =
        document.getElementById(
            "summarySize"
        );

    const summaryQuantity =
        document.getElementById(
            "summaryQuantity"
        );

    const quantityDisplay =
        document.getElementById(
            "quantity"
        );

    const status =
        document.getElementById(
            "selectionStatus"
        );

    const addToCartButton =
        document.getElementById(
            "addToCart"
        );


    /* =====================================
       MODEL / PRODUCT
    ===================================== */

    products.forEach(function (product) {

        product.addEventListener(
            "click",
            function () {

                products.forEach(
                    function (p) {

                        p.classList.remove(
                            "selected"
                        );

                    }
                );

                product.classList.add(
                    "selected"
                );

                selectedProduct =
                    product.dataset.value ||
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


    /* =====================================
       COLOR
    ===================================== */

    const colorChoices =
        document.querySelectorAll(
            ".color-choice"
        );

    colorChoices.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    colorChoices.forEach(
                        function (b) {

                            b.classList.remove(
                                "selected"
                            );

                        }
                    );

                    button.classList.add(
                        "selected"
                    );

                    selectedColor =
                        button.dataset.color;

                    if (summaryColor) {

                        summaryColor.textContent =
                            selectedColor;

                    }

                    updateStatus();

                }
            );

        }
    );


    /* =====================================
       SIZE
    ===================================== */

    const sizeChoices =
        document.querySelectorAll(
            ".size-choice"
        );

    sizeChoices.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    sizeChoices.forEach(
                        function (b) {

                            b.classList.remove(
                                "selected"
                            );

                        }
                    );

                    button.classList.add(
                        "selected"
                    );

                    selectedSize =
                        button.dataset.size;

                    if (summarySize) {

                        summarySize.textContent =
                            selectedSize;

                    }

                    updateStatus();

                }
            );

        }
    );


    /* =====================================
       QUANTITY PLUS
    ===================================== */

    const plusButton =
        document.getElementById(
            "plus"
        );

    if (plusButton) {

        plusButton.addEventListener(
            "click",
            function () {

                quantity++;

                updateQuantityDisplay();

            }
        );

    }


    /* =====================================
       QUANTITY MINUS
    ===================================== */

    const minusButton =
        document.getElementById(
            "minus"
        );

    if (minusButton) {

        minusButton.addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                }

                updateQuantityDisplay();

            }
        );

    }


    /* =====================================
       UPDATE QUANTITY
    ===================================== */

    function updateQuantityDisplay() {

        if (summaryQuantity) {

            summaryQuantity.textContent =
                quantity;

        }

        if (quantityDisplay) {

            quantityDisplay.textContent =
                quantity;

        }

    }


    /* =====================================
       STATUS
    ===================================== */

    function updateStatus() {

        if (
            selectedColor &&
            selectedSize
        ) {

            if (status) {

                status.textContent =
                    "READY TO ADD TO CART.";

            }

        } else {

            if (status) {

                status.textContent =
                    "Choose your color and size.";

            }

        }

    }


    /* =====================================
       GET CART
    ===================================== */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "bequemCart"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    /* =====================================
       SAVE CART
    ===================================== */

    function saveCart(cart) {

        localStorage.setItem(
            "bequemCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================
       ADD TO CART
    ===================================== */

    if (addToCartButton) {

        addToCartButton.addEventListener(
            "click",
            function () {

                /* =========================
                   CHECK COLOR
                ========================= */

                if (!selectedColor) {

                    alert(
                        "Please choose a color."
                    );

                    return;

                }


                /* =========================
                   CHECK SIZE
                ========================= */

                if (!selectedSize) {

                    alert(
                        "Please choose a size."
                    );

                    return;

                }


                /* =========================
                   GET CURRENT CART
                ========================= */

                const cart =
                    getCart();


                /* =========================
                   ADD OUTFIT SEPARATELY
                ========================= */

                if (savedOutfit) {

                    const outfitItem = {

                        id:
                            "outfit-" +
                            Date.now(),

                        category:
                            savedOutfit.category ||
                            "SCRUB SET",

                        name:
                            savedOutfit.name ||
                            "BEQUEM SCRUB SET",

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


                /* =========================
                   ADD SOCKS SEPARATELY
                ========================= */

                const compressionSockItem = {

                    id:
                        "compression-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 9),

                    category:
                        "ACCESSORY",

                    name:
                        "BAS DE CONTENTION",

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
                    compressionSockItem
                );


                /* =========================
                   SAVE CART
                ========================= */

                saveCart(
                    cart
                );


                /* =========================
                   REMOVE TEMP OUTFIT
                ========================= */

                localStorage.removeItem(
                    "bequemCurrentOutfit"
                );


                /* =========================
                   BUTTON
                ========================= */

                addToCartButton.textContent =
                    "ADDED ✓";

                addToCartButton.disabled =
                    true;


                /* =========================
                   GO TO CART
                ========================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "cart.html";

                    },
                    700
                );

            }
        );

    }


    /* =====================================
       CART COUNT
    ===================================== */

    function updateCartCount() {

        const cartCount =
            document.getElementById(
                "cartCount"
            );

        if (!cartCount) {

            return;

        }


        const currentCart =
            getCart();


        let total = 0;


        currentCart.forEach(
            function (item) {

                total +=
                    Number(
                        item.quantity
                    ) || 1;

            }
        );


        cartCount.textContent =
            total;

    }


    /* =====================================
       INITIALIZATION
    ===================================== */

    updateQuantityDisplay();

    updateCartCount();

});
```
