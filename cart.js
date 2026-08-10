document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       LOAD CART
    ===================================== */

    let cart = JSON.parse(
        localStorage.getItem("bequemCart") || "[]"
    );


    const container =
        document.getElementById("cartContainer");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartSummary =
        document.getElementById("cartSummary");

    const cartCount =
        document.getElementById("cartCount");

    const summaryItems =
        document.getElementById("summaryItems");

    const summaryTotal =
        document.getElementById("summaryTotal");


    /* =====================================
       SAVE CART
    ===================================== */

    function saveCart() {

        localStorage.setItem(
            "bequemCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================
       CART COUNT
    ===================================== */

    function updateCartCount() {

        let totalQuantity = 0;


        cart.forEach(function (item) {

            totalQuantity +=
                Number(item.quantity) || 1;

        });


        cartCount.textContent =
            totalQuantity;

    }


    /* =====================================
       IMAGE
    ===================================== */

    function getProductImage(item) {


        /*
         * Si l'article contient une tenue,
         * on utilise la photo du TOP.
         */

        if (item.top) {

            const images = {

                "COL ROND":
                    "images/col-rond.jpg",

                "COL V":
                    "images/col-v.jpg",

                "ZIPPÉ":
                    "images/zippe.jpg"

            };


            return images[item.top]
                || "images/placeholder.jpg";

        }


        /*
         * Article sans tenue
         */

        return "images/placeholder.jpg";

    }


    /* =====================================
       DISPLAY CART
    ===================================== */

    function renderCart() {


        container.innerHTML = "";


        updateCartCount();


        if (cart.length === 0) {

            emptyCart.style.display =
                "block";

            cartSummary.style.display =
                "none";

            return;

        }


        emptyCart.style.display =
            "none";


        cartSummary.style.display =
            "block";


        let totalItems = 0;


        cart.forEach(function (item, index) {


            const quantity =
                Number(item.quantity) || 1;


            totalItems += quantity;


            const article =
                document.createElement("article");


            article.className =
                "cart-item";


            /* =================================
               MOTIF
            ================================= */

            let motifName =
                "NO MOTIF";


            let placement =
                "—";


            let motifDescription =
                "—";


            if (item.motif) {


                motifName =
                    item.motif.name
                    || "NO MOTIF";


                placement =
                    item.motif.placement
                    || "—";


                motifDescription =
                    item.motif.description
                    || "—";

            }


            /* =================================
               BAS DE CONTENTION
            ================================= */

            let compressionHTML = "";


            if (item.compressionSock) {


                const socks =
                    item.compressionSock;


                compressionHTML = `

                    <div class="cart-accessory">

                        <div class="cart-accessory-title">

                            COMPRESSION SOCKS

                        </div>


                        <div class="cart-details">


                            <div class="cart-detail">

                                <span>MODEL</span>

                                <strong>
                                    ${socks.model || "—"}
                                </strong>

                            </div>


                            <div class="cart-detail">

                                <span>COLOR</span>

                                <strong>
                                    ${socks.color || "—"}
                                </strong>

                            </div>


                            <div class="cart-detail">

                                <span>SIZE</span>

                                <strong>
                                    ${socks.size || "—"}
                                </strong>

                            </div>


                        </div>

                    </div>

                `;

            }



            /* =================================
               HTML
            ================================= */

            article.innerHTML = `

                <div class="cart-image">

                    <img
                        src="${getProductImage(item)}"
                        alt="${item.category || "BEQUEM SCRUBS"}">

                </div>


                <div class="cart-info">


                    <div>

                        <div class="cart-category">

                            ${item.category || "BEQUEM SCRUBS"}

                        </div>


                        <h2 class="cart-title">

                            ${
                                item.compressionSock
                                ? "COMPLETE OUTFIT"
                                : "CUSTOM SET"
                            }

                        </h2>

                    </div>



                    <!-- =====================
                         SCRUB DETAILS
                    ====================== -->

                    <div class="cart-details">


                        <div class="cart-detail">

                            <span>TOP</span>

                            <strong>
                                ${item.top || "—"}
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>PANTS</span>

                            <strong>
                                ${item.pants || "—"}
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>COLOR</span>

                            <strong>
                                ${
                                    item.color ||
                                    item.scrubColor ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>SIZE</span>

                            <strong>
                                ${
                                    item.size ||
                                    item.scrubSize ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>MOTIF</span>

                            <strong>
                                ${motifName}
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>PLACEMENT</span>

                            <strong>
                                ${placement}
                            </strong>

                        </div>


                        <div class="cart-detail">

                            <span>DESCRIPTION</span>

                            <strong>
                                ${motifDescription}
                            </strong>

                        </div>


                    </div>


                    <!-- =====================
                         ACCESSORY
                    ====================== -->

                    ${compressionHTML}


                </div>



                <!-- =====================
                     ACTIONS
                ====================== -->

                <div class="cart-actions">


                    <button
                        class="remove-button"
                        data-index="${index}">

                        REMOVE

                    </button>


                    <div class="quantity">


                        <button
                            class="minus"
                            data-index="${index}">

                            −

                        </button>


                        <span>

                            ${quantity}

                        </span>


                        <button
                            class="plus"
                            data-index="${index}">

                            +

                        </button>


                    </div>


                </div>

            `;


            container.appendChild(article);

        });


        summaryItems.textContent =
            totalItems;


        /*
         * PRICES ARE NOT READY YET.
         */

        summaryTotal.textContent =
            "PRICE TO BE ADDED";


        addButtonEvents();

    }



    /* =====================================
       BUTTON EVENTS
    ===================================== */

    function addButtonEvents() {


        /*
         * REMOVE
         */

        document
            .querySelectorAll(".remove-button")
            .forEach(function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const index =
                            Number(
                                button.dataset.index
                            );


                        cart.splice(
                            index,
                            1
                        );


                        saveCart();

                        renderCart();

                    }
                );

            });



        /*
         * PLUS
         */

        document
            .querySelectorAll(".plus")
            .forEach(function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const index =
                            Number(
                                button.dataset.index
                            );


                        cart[index].quantity =
                            (
                                Number(
                                    cart[index].quantity
                                ) || 1
                            ) + 1;


                        saveCart();

                        renderCart();

                    }
                );

            });



        /*
         * MINUS
         */

        document
            .querySelectorAll(".minus")
            .forEach(function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const index =
                            Number(
                                button.dataset.index
                            );


                        const quantity =
                            Number(
                                cart[index].quantity
                            ) || 1;


                        if (quantity > 1) {


                            cart[index].quantity =
                                quantity - 1;


                        } else {


                            cart.splice(
                                index,
                                1
                            );

                        }


                        saveCart();

                        renderCart();

                    }
                );

            });

    }



    /* =====================================
       CHECKOUT
    ===================================== */

    document
        .getElementById("checkoutButton")
        .addEventListener(
            "click",
            function () {

                window.location.href =
                    "checkout.html";

            }
        );



    /* =====================================
       START
    ===================================== */

    renderCart();

});
