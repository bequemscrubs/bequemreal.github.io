```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       LOAD CART
    ===================================== */

    let cart = JSON.parse(
        localStorage.getItem("bequemCart") || "[]"
    );


    const container =
        document.getElementById("cartContainer") ||
        document.getElementById("cartItems");

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


        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }

    }


    /* =====================================
       PRODUCT IMAGE
    ===================================== */

    function getProductImage(item) {

        /*
         * TENUE
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
         * BAS DE CONTENTION
         */

        if (
            item.category === "ACCESSORY" ||
            item.product ||
            item.model
        ) {

            return "images/placeholder.jpg";

        }


        return "images/placeholder.jpg";

    }


    /* =====================================
       DISPLAY CART
    ===================================== */

    function renderCart() {

        if (!container) {
            return;
        }


        container.innerHTML = "";


        updateCartCount();


        if (cart.length === 0) {

            if (emptyCart) {

                emptyCart.style.display =
                    "block";

            }

            if (cartSummary) {

                cartSummary.style.display =
                    "none";

            }

            container.innerHTML = `
                <div class="empty-cart">
                    YOUR CART IS EMPTY.
                </div>
            `;

            return;

        }


        if (emptyCart) {

            emptyCart.style.display =
                "none";

        }


        if (cartSummary) {

            cartSummary.style.display =
                "block";

        }


        let totalItems = 0;


        cart.forEach(function (item, index) {

            const quantity =
                Number(item.quantity) || 1;


            totalItems += quantity;


            const article =
                document.createElement("article");


            article.className =
                "cart-item";


            /*
             * DETERMINE TYPE
             */

            const isOutfit =
                !!(
                    item.top ||
                    item.pants
                );


            const isCompression =
                item.category === "ACCESSORY" ||
                !!item.product ||
                !!item.model;


            /* =================================
               OUTFIT
            ================================= */

            if (isOutfit) {

                let motifName =
                    "NO MOTIF";

                let placement =
                    "—";

                let motifDescription =
                    "—";


                if (item.motif) {

                    motifName =
                        item.motif.name ||
                        "NO MOTIF";


                    placement =
                        item.motif.placement ||
                        "—";


                    motifDescription =
                        item.motif.description ||
                        "—";

                }


                article.innerHTML = `

                    <div class="cart-image">

                        <img
                            src="${getProductImage(item)}"
                            alt="BEQUEM SCRUBS">

                    </div>


                    <div class="cart-info">

                        <div>

                            <div class="cart-category">
                                ${item.category || "BEQUEM SCRUBS"}
                            </div>

                            <h2 class="cart-title">
                                CUSTOM SCRUB SET
                            </h2>

                        </div>


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


                            ${
                                item.motif
                                ? `

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

                                `
                                : ""
                            }

                        </div>

                    </div>


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

            }


            /* =================================
               COMPRESSION SOCKS
            ================================= */

            else if (isCompression) {

                const model =
                    item.model ||
                    item.product ||
                    "—";


                const color =
                    item.color ||
                    "—";


                const size =
                    item.size ||
                    "—";


                article.innerHTML = `

                    <div class="cart-image">

                        <img
                            src="${getProductImage(item)}"
                            alt="COMPRESSION SOCKS">

                    </div>


                    <div class="cart-info">

                        <div>

                            <div class="cart-category">
                                ACCESSORY
                            </div>

                            <h2 class="cart-title">
                                COMPRESSION SOCKS
                            </h2>

                        </div>


                        <div class="cart-details">

                            <div class="cart-detail">

                                <span>MODEL</span>

                                <strong>
                                    ${model}
                                </strong>

                            </div>


                            <div class="cart-detail">

                                <span>COLOR</span>

                                <strong>
                                    ${color}
                                </strong>

                            </div>


                            <div class="cart-detail">

                                <span>SIZE</span>

                                <strong>
                                    ${size}
                                </strong>

                            </div>

                        </div>

                    </div>


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

            }


            /* =================================
               UNKNOWN PRODUCT
            ================================= */

            else {

                article.innerHTML = `

                    <div class="cart-image">

                        <img
                            src="${getProductImage(item)}"
                            alt="PRODUCT">

                    </div>


                    <div class="cart-info">

                        <div>

                            <div class="cart-category">
                                ${item.category || "PRODUCT"}
                            </div>

                            <h2 class="cart-title">
                                ${item.name || "PRODUCT"}
                            </h2>

                        </div>


                        <div class="cart-details">

                            ${
                                item.color
                                ? `

                                    <div class="cart-detail">

                                        <span>COLOR</span>

                                        <strong>
                                            ${item.color}
                                        </strong>

                                    </div>

                                `
                                : ""
                            }


                            ${
                                item.size
                                ? `

                                    <div class="cart-detail">

                                        <span>SIZE</span>

                                        <strong>
                                            ${item.size}
                                        </strong>

                                    </div>

                                `
                                : ""
                            }

                        </div>

                    </div>


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

            }


            container.appendChild(article);

        });


        if (summaryItems) {

            summaryItems.textContent =
                totalItems;

        }


        /*
         * PRICES ARE NOT READY YET
         */

        if (summaryTotal) {

            summaryTotal.textContent =
                "PRICE TO BE ADDED";

        }


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

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* =====================================
       START
    ===================================== */

    renderCart();

});
```
