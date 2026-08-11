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

    const savedOutfit =
        JSON.parse(
            localStorage.getItem(
                "bequemCurrentOutfit"
            )
        );



    /* =====================================
       ELEMENTS
    ===================================== */

    const products =
        document.querySelectorAll(".product-card");


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
       PRODUCT
    ===================================== */

    products.forEach(function (product) {


        product.addEventListener(
            "click",
            function () {


                products.forEach(function (p) {

                    p.classList.remove(
                        "selected"
                    );

                });


                product.classList.add(
                    "selected"
                );


                selectedProduct =
                    product.dataset.value;


                selectedProductText.textContent =
                    selectedProduct;


                summaryProduct.textContent =
                    selectedProduct;


            }

        );

    });



    /* =====================================
       COLOR
    ===================================== */

    document
        .querySelectorAll(".color-choice")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {


                    document
                        .querySelectorAll(
                            ".color-choice"
                        )
                        .forEach(function (b) {

                            b.classList.remove(
                                "selected"
                            );

                        });


                    button.classList.add(
                        "selected"
                    );


                    selectedColor =
                        button.dataset.color;


                    summaryColor.textContent =
                        selectedColor;


                    updateStatus();


                }

            );

        });



    /* =====================================
       SIZE
    ===================================== */

    document
        .querySelectorAll(".size-choice")
        .forEach(function (button) {


            button.addEventListener(
                "click",
                function () {


                    document
                        .querySelectorAll(
                            ".size-choice"
                        )
                        .forEach(function (b) {

                            b.classList.remove(
                                "selected"
                            );

                        });


                    button.classList.add(
                        "selected"
                    );


                    selectedSize =
                        button.dataset.size;


                    summarySize.textContent =
                        selectedSize;


                    updateStatus();


                }

            );

        });



    /* =====================================
       QUANTITY
    ===================================== */

    document
        .getElementById("plus")
        .addEventListener(
            "click",
            function () {


                quantity++;


                summaryQuantity.textContent =
                    quantity;


            }

        );



    document
        .getElementById("minus")
        .addEventListener(
            "click",
            function () {


                if (quantity > 1) {

                    quantity--;

                }


                summaryQuantity.textContent =
                    quantity;


            }

        );



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

    document
        .getElementById("addToCart")
        .addEventListener(
            "click",
            function () {


                /* =================================
                   VALIDATION
                ================================= */

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



                /* =================================
                   LOAD EXISTING CART
                ================================= */

                let cart =
                    JSON.parse(
                        localStorage.getItem(
                            "bequemCart"
                        )
                    ) || [];



                /* =================================
                   1. ADD THE OUTFIT
                   AS A SEPARATE CART ITEM
                ================================= */

                if (savedOutfit) {

                    const outfitItem = {

                        id:
                            "outfit-" +
                            Date.now(),

                        category:
                            savedOutfit.category ||
                            "HOMMES",

                        top:
                            savedOutfit.top ||
                            null,

                        pants:
                            savedOutfit.pants ||
                            null,

                        color:
                            savedOutfit.color ||
                            null,

                        size:
                            savedOutfit.size ||
                            null,

                        motif:
                            savedOutfit.motif ||
                            null,

                        quantity: 1

                    };


                    cart.push(outfitItem);

                }



                /* =================================
                   2. ADD THE COMPRESSION SOCKS
                   AS A SEPARATE CART ITEM
                ================================= */

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



                /* =================================
                   SAVE CART
                ================================= */

                localStorage.setItem(
                    "bequemCart",
                    JSON.stringify(cart)
                );



                /* =================================
                   OUTFIT NO LONGER NEEDED
                   AS TEMPORARY DATA
                ================================= */

                localStorage.removeItem(
                    "bequemCurrentOutfit"
                );



                /* =================================
                   BUTTON FEEDBACK
                ================================= */

                const button =
                    document.getElementById(
                        "addToCart"
                    );


                button.textContent =
                    "ADDED ✓";


                setTimeout(
                    function () {

                        window.location.href =
                            "cart.html";

                    },
                    700
                );


            }

        );



    /* =====================================
       CART COUNT
    ===================================== */

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const cart =
        JSON.parse(
            localStorage.getItem(
                "bequemCart"
            ) || "[]"
        );


    let total = 0;


    cart.forEach(function (item) {

        total +=
            Number(item.quantity) || 1;

    });


    cartCount.textContent =
        total;


});
```
