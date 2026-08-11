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

        savedOutfit =
            JSON.parse(
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


    const status =
        document.getElementById(
            "selectionStatus"
        );


    /* =====================================
       PRODUCT / MODEL
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
                    product.dataset.value;


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

    document
        .querySelectorAll(
            ".color-choice"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".color-choice"
                        )
                        .forEach(
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

        });


    /* =====================================
       SIZE
    ===================================== */

    document
        .querySelectorAll(
            ".size-choice"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".size-choice"
                        )
                        .forEach(
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

        });


    /* =====================================
       QUANTITY +
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


                if (summaryQuantity) {

                    summaryQuantity.textContent =
                        quantity;

                }

            }
        );

    }


    /* =====================================
       QUANTITY -
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


                if (summaryQuantity) {

                    summaryQuantity.textContent =
                        quantity;

                }

            }
        );

    }


    /* =====================================
       STATUS
    ===================================== */

    function updateStatus() {

        if (
            selectedColor &&
            selectedSize
        ) {

            status.textContent =
                "READY TO ADD TO CART.";

        } else {

            status.textContent =
                "Choose your color and size.";

        }

    }


    /* =====================================
       ADD TO CART
    ===================================== */

    const addToCartButton =
        document.getElementById(
            "addToCart"
        );


    if (addToCartButton) {

        addToCartButton.addEventListener(
            "click",
            function () {


                /* =========================
                   VALIDATION
                ========================= */

                if (!selectedColor) {

                    alert(
                        "Please choose a color."
                    );

                    return;

                }


                if (!selectedSize) {

                    alert(
                        "Please choose a size."
                    );

                    return;

                }


                /* =========================
                   LOAD CART
                ========================= */

                let cart = [];

                try {

                    cart =
                        JSON.parse(
                            localStorage.getItem(
                                "bequemCart"
                            )
                        ) || [];

                } catch (error) {

                    cart = [];

                }


                /* =========================
                   1. ADD THE OUTFIT
                   AS ITS OWN ARTICLE
                ========================= */

                if (savedOutfit) {

                    const outfitItem = {

                        id:
                            "outfit-" +
                            Date.now(),

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

                        quantity: 1

                    };


                    cart.push(
                        outfitItem
                    );

                }


                /* =========================
                   2. ADD THE SOCKS
                   AS ANOTHER ARTICLE
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

                localStorage.setItem(
                    "bequemCart",
                    JSON.stringify(cart)
                );


                /* =========================
                   REMOVE TEMPORARY OUTFIT
                ========================= */

                localStorage.removeItem(
                    "bequemCurrentOutfit"
                );


                /* =========================
                   BUTTON FEEDBACK
                ========================= */

                addToCartButton.textContent =
                    "ADDED ✓";


                addToCartButton.disabled =
                    true;


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

    const cartCountElement =
        document.getElementById(
            "cartCount"
        );


    let currentCart = [];

    try {

        currentCart =
            JSON.parse(
                localStorage.getItem(
                    "bequemCart"
                )
            ) || [];

    } catch (error) {

        currentCart = [];

    }


    let total = 0;


    currentCart.forEach(
        function (item) {

            total +=
                Number(
                    item.quantity
                ) || 1;

        }
    );


    if (cartCountElement) {

        cartCountElement.textContent =
            total;

    }

});
```
