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



                let cart =
                    JSON.parse(
                        localStorage.getItem(
                            "bequemCart"
                        )
                    ) || [];



                /*
                   BAS DE CONTENTION
                   + TENUE
                   = UN SEUL ARTICLE
                   DANS LE PANIER
                */

                const item = {


                    id:
                        "outfit-" +
                        Date.now(),


                    category:
                        savedOutfit
                            ? savedOutfit.category
                            : "ACCESSORY",



                    /* TENUE */

                    top:
                        savedOutfit
                            ? savedOutfit.top
                            : null,


                    pants:
                        savedOutfit
                            ? savedOutfit.pants
                            : null,


                    scrubColor:
                        savedOutfit
                            ? savedOutfit.color
                            : null,


                    scrubSize:
                        savedOutfit
                            ? savedOutfit.size
                            : null,


                    motif:
                        savedOutfit
                            ? savedOutfit.motif
                            : null,



                    /* BAS */

                    compressionSock: {

                        model:
                            selectedProduct,

                        color:
                            selectedColor,

                        size:
                            selectedSize,

                        quantity:
                            quantity

                    },


                    quantity: 1

                };



                cart.push(item);



                localStorage.setItem(

                    "bequemCart",

                    JSON.stringify(cart)

                );



                /*
                   On supprime la tenue
                   temporaire parce qu'elle
                   est maintenant dans le panier.
                */

                localStorage.removeItem(

                    "bequemCurrentOutfit"

                );



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
