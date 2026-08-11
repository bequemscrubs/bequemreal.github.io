```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       CONFIGURATION
    ========================================= */

    const CART_KEY = "bequemCart";
    const LAST_ORDER_KEY = "bequemLastOrder";

    // WhatsApp BEQUEM SCRUBS
    const WHATSAPP_NUMBER = "213781952022";


    /* =========================================
       ELEMENTS
    ========================================= */

    const form =
        document.getElementById("orderForm");

    const orderSummary =
        document.getElementById("orderSummary");

    const orderTotal =
        document.getElementById("orderTotal");


    /* =========================================
       CART
    ========================================= */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(CART_KEY) || "[]"
            ) || [];

        } catch (error) {

            return [];

        }

    }


    const cart = getCart();


    /* =========================================
       EMPTY CART
    ========================================= */

    if (!cart.length) {

        if (orderSummary) {

            orderSummary.innerHTML = `
                <p style="
                    padding:20px 0;
                    font-weight:600;
                ">
                    YOUR CART IS EMPTY.
                </p>
            `;

        }

        return;

    }


    /* =========================================
       HELPERS
    ========================================= */

    function quantityOf(item) {

        return Number(item.quantity) || 1;

    }


    function getMotif(item) {

        if (!item.motif) {

            return {
                name: "—",
                placement: "—",
                description: "—"
            };

        }


        if (typeof item.motif === "string") {

            return {
                name: item.motif,
                placement: "—",
                description: "—"
            };

        }


        return {

            name:
                item.motif.name || "—",

            placement:
                item.motif.placement || "—",

            description:
                item.motif.description || "—"

        };

    }


    function isOutfit(item) {

        return (
            !!item.top ||
            !!item.pants ||
            item.category === "SCRUB SET"
        );

    }


    function isCompressionSock(item) {

        return (
            item.category === "ACCESSORY" ||
            item.name === "BAS DE CONTENTION" ||
            !!item.product ||
            !!item.model
        );

    }


    /* =========================================
       DISPLAY ORDER
    ========================================= */

    function displayOrder() {

        if (!orderSummary) {
            return;
        }


        orderSummary.innerHTML = "";


        let total = 0;


        cart.forEach(function (item, index) {

            const quantity =
                quantityOf(item);

            const price =
                Number(item.price) || 0;


            total +=
                price * quantity;


            const article =
                document.createElement("div");


            article.className =
                "order-item";


            /* ================================
               TENUE
            ================================= */

            if (isOutfit(item)) {

                const motif =
                    getMotif(item);


                article.innerHTML = `

                    <h3>
                        🩺 TENUE BEQUEM
                    </h3>

                    <p>
                        TOP:
                        ${item.top || "—"}
                    </p>

                    <p>
                        PANTS:
                        ${item.pants || "—"}
                    </p>

                    <p>
                        COLOR:
                        ${
                            item.color ||
                            item.scrubColor ||
                            "—"
                        }
                    </p>

                    <p>
                        SIZE:
                        ${
                            item.size ||
                            item.scrubSize ||
                            "—"
                        }
                    </p>

                    <p>
                        MOTIF:
                        ${motif.name}
                    </p>

                    <p>
                        PLACEMENT:
                        ${motif.placement}
                    </p>

                    <p>
                        MOTIF DETAILS:
                        ${motif.description}
                    </p>

                    <p>
                        QUANTITY:
                        ${quantity}
                    </p>

                `;

            }


            /* ================================
               BAS DE CONTENTION
            ================================= */

            else if (isCompressionSock(item)) {

                article.innerHTML = `

                    <h3>
                        🧦 BAS DE CONTENTION
                    </h3>

                    <p>
                        MODEL:
                        ${
                            item.model ||
                            item.product ||
                            "—"
                        }
                    </p>

                    <p>
                        COLOR:
                        ${item.color || "—"}
                    </p>

                    <p>
                        SIZE:
                        ${item.size || "—"}
                    </p>

                    <p>
                        QUANTITY:
                        ${quantity}
                    </p>

                `;

            }


            /* ================================
               OTHER PRODUCT
            ================================= */

            else {

                article.innerHTML = `

                    <h3>
                        ${item.name || "PRODUCT"}
                    </h3>

                    <p>
                        QUANTITY:
                        ${quantity}
                    </p>

                `;

            }


            orderSummary.appendChild(article);

        });


        /* ================================
           TOTAL
        ================================= */

        if (orderTotal) {

            if (total > 0) {

                orderTotal.textContent =
                    total.toLocaleString("fr-FR") +
                    " DA";

            } else {

                orderTotal.textContent =
                    "PRICE TO BE CONFIRMED";

            }

        }

    }


    /* =========================================
       WHATSAPP MESSAGE
    ========================================= */

    function createWhatsAppMessage(
        customer,
        order
    ) {

        let message = "";


        message +=
            "🛍️ *NOUVELLE COMMANDE — BEQUEM SCRUBS*\n";

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n\n";


        /* ================================
           ORDER NUMBER
        ================================= */

        message +=
            "📋 *COMMANDE*\n";

        message +=
            "Numéro : " +
            order.id +
            "\n";

        message +=
            "Date : " +
            new Date().toLocaleString("fr-FR") +
            "\n\n";


        /* ================================
           CUSTOMER
        ================================= */

        message +=
            "👤 *CLIENT*\n";

        message +=
            "Nom : " +
            customer.firstName +
            " " +
            customer.lastName +
            "\n";

        message +=
            "Téléphone : " +
            customer.phone +
            "\n";

        message +=
            "Ville / Wilaya : " +
            customer.city +
            "\n";

        message +=
            "Adresse : " +
            customer.address +
            "\n";


        if (customer.email) {

            message +=
                "Email : " +
                customer.email +
                "\n";

        }


        message += "\n";


        /* ================================
           PRODUCTS
        ================================= */

        message +=
            "📦 *DÉTAILS DE LA COMMANDE*\n";

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n\n";


        let total = 0;

        let totalItems = 0;


        order.items.forEach(function (item, index) {

            const quantity =
                quantityOf(item);

            const price =
                Number(item.price) || 0;


            total +=
                price * quantity;

            totalItems +=
                quantity;


            /* -------------------------------
               OUTFIT
            -------------------------------- */

            if (isOutfit(item)) {

                const motif =
                    getMotif(item);


                message +=
                    "🩺 *ARTICLE " +
                    (index + 1) +
                    " — TENUE*\n";


                message +=
                    "Top : " +
                    (item.top || "—") +
                    "\n";


                message +=
                    "Pantalon : " +
                    (item.pants || "—") +
                    "\n";


                message +=
                    "Couleur : " +
                    (
                        item.color ||
                        item.scrubColor ||
                        "—"
                    ) +
                    "\n";


                message +=
                    "Taille : " +
                    (
                        item.size ||
                        item.scrubSize ||
                        "—"
                    ) +
                    "\n";


                message +=
                    "Motif : " +
                    motif.name +
                    "\n";


                message +=
                    "Placement : " +
                    motif.placement +
                    "\n";


                message +=
                    "Détails motif : " +
                    motif.description +
                    "\n";


                message +=
                    "Quantité : " +
                    quantity +
                    "\n\n";

            }


            /* -------------------------------
               COMPRESSION SOCKS
            -------------------------------- */

            else if (isCompressionSock(item)) {

                message +=
                    "🧦 *ARTICLE " +
                    (index + 1) +
                    " — BAS DE CONTENTION*\n";


                message +=
                    "Modèle : " +
                    (
                        item.model ||
                        item.product ||
                        "—"
                    ) +
                    "\n";


                message +=
                    "Couleur : " +
                    (
                        item.color ||
                        "—"
                    ) +
                    "\n";


                message +=
                    "Taille : " +
                    (
                        item.size ||
                        "—"
                    ) +
                    "\n";


                message +=
                    "Quantité : " +
                    quantity +
                    "\n\n";

            }


            /* -------------------------------
               OTHER
            -------------------------------- */

            else {

                message +=
                    "🛍️ *ARTICLE " +
                    (index + 1) +
                    "*\n";


                message +=
                    "Produit : " +
                    (
                        item.name ||
                        "PRODUCT"
                    ) +
                    "\n";


                message +=
                    "Quantité : " +
                    quantity +
                    "\n\n";

            }

        });


        /* ================================
           TOTAL
        ================================= */

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n";

        message +=
            "📊 *RÉCAPITULATIF*\n";

        message +=
            "Articles : " +
            totalItems +
            "\n";


        if (total > 0) {

            message +=
                "Total : " +
                total.toLocaleString("fr-FR") +
                " DA\n";

        } else {

            message +=
                "Total : À confirmer\n";

        }


        message += "\n";


        /* ================================
           DELIVERY
        ================================= */

        message +=
            "🚚 *LIVRAISON*\n";

        message +=
            "Ville : " +
            customer.city +
            "\n";

        message +=
            "Adresse : " +
            customer.address +
            "\n\n";


        message +=
            "Merci, je souhaite confirmer cette commande.";


        return message;

    }


    /* =========================================
       OPEN WHATSAPP
    ========================================= */

    function sendToWhatsApp(
        customer,
        order
    ) {

        const message =
            createWhatsAppMessage(
                customer,
                order
            );


        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);


        /*
         * Open WhatsApp.
         */

        window.open(
            whatsappURL,
            "_blank"
        );

    }


    /* =========================================
       SMALL REVIEW POPUP
    ========================================= */

    function showReviewPopup() {

        /*
         * Prevent duplicates.
         */

        if (
            document.getElementById(
                "bequemReviewPopup"
            )
        ) {

            return;

        }


        const popup =
            document.createElement("div");


        popup.id =
            "bequemReviewPopup";


        popup.innerHTML = `

            <div class="bequem-review-overlay">

                <div class="bequem-review-box">

                    <button
                        class="bequem-review-close"
                        id="reviewClose"
                        aria-label="Close"
                    >
                        ×
                    </button>


                    <div class="bequem-review-icon">
                        ★
                    </div>


                    <h3>
                        YOUR ORDER IS READY
                    </h3>


                    <p>
                        Would you like to leave
                        us a review?
                    </p>


                    <div class="bequem-review-buttons">

                        <button
                            id="reviewYes"
                            class="bequem-review-yes"
                        >
                            YES
                        </button>


                        <button
                            id="reviewNo"
                            class="bequem-review-no"
                        >
                            NO
                        </button>

                    </div>

                </div>

            </div>

        `;


        /* =====================================
           POPUP STYLE
        ===================================== */

        const style =
            document.createElement("style");


        style.textContent = `

            #bequemReviewPopup {
                position: fixed;
                inset: 0;
                z-index: 999999;
                pointer-events: none;
            }


            .bequem-review-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                padding: 25px;
                background: rgba(0,0,0,0.08);
                pointer-events: auto;
            }


            .bequem-review-box {
                position: relative;
                width: 300px;
                background: #ffffff;
                border: 1px solid #111111;
                padding: 25px;
                box-shadow:
                    0 12px 40px rgba(0,0,0,0.18);
                animation:
                    bequemReviewAppear
                    0.3s ease;
            }


            .bequem-review-icon {
                width: 38px;
                height: 38px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #111111;
                color: #ffffff;
                font-size: 18px;
                margin-bottom: 15px;
            }


            .bequem-review-box h3 {
                margin: 0 0 10px;
                font-size: 18px;
                letter-spacing: 0.5px;
            }


            .bequem-review-box p {
                margin: 0 0 20px;
                font-size: 13px;
                line-height: 1.5;
            }


            .bequem-review-close {
                position: absolute;
                top: 8px;
                right: 10px;
                border: 0;
                background: transparent;
                font-size: 22px;
                cursor: pointer;
                line-height: 1;
            }


            .bequem-review-buttons {
                display: flex;
                gap: 8px;
            }


            .bequem-review-buttons button {
                flex: 1;
                padding: 11px 8px;
                cursor: pointer;
                font-family: inherit;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }


            .bequem-review-yes {
                background: #111111;
                color: #ffffff;
                border: 1px solid #111111;
            }


            .bequem-review-no {
                background: #ffffff;
                color: #111111;
                border: 1px solid #111111;
            }


            @keyframes bequemReviewAppear {

                from {
                    opacity: 0;
                    transform:
                        translateY(20px);
                }

                to {
                    opacity: 1;
                    transform:
                        translateY(0);
                }

            }


            @media (max-width: 500px) {

                .bequem-review-overlay {
                    padding: 15px;
                }


                .bequem-review-box {
                    width: 100%;
                }

            }

        `;


        document.head.appendChild(style);

        document.body.appendChild(popup);


        /* =====================================
           YES
        ===================================== */

        document
            .getElementById("reviewYes")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "reviews.html";

                }
            );


        /* =====================================
           NO
        ===================================== */

        document
            .getElementById("reviewNo")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";

                }
            );


        /* =====================================
           CLOSE = HOME
        ===================================== */

        document
            .getElementById("reviewClose")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";

                }
            );

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* ================================
                   CUSTOMER DATA
                ================================= */

                const firstName =
                    document
                        .getElementById("firstName")
                        .value
                        .trim();


                const lastName =
                    document
                        .getElementById("lastName")
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById("phone")
                        .value
                        .trim();


                const city =
                    document
                        .getElementById("city")
                        .value
                        .trim();


                const address =
                    document
                        .getElementById("address")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                /* ================================
                   ORDER
                ================================= */

                const order = {

                    id:
                        "BQ-" +
                        Date.now(),

                    date:
                        new Date().toISOString(),

                    customer: {

                        firstName:
                            firstName,

                        lastName:
                            lastName,

                        phone:
                            phone,

                        city:
                            city,

                        address:
                            address,

                        email:
                            email

                    },

                    items:
                        cart

                };


                /* ================================
                   SAVE LAST ORDER
                ================================= */

                localStorage.setItem(
                    LAST_ORDER_KEY,
                    JSON.stringify(order)
                );


                /* ================================
                   WHATSAPP
                ================================= */

                sendToWhatsApp(
                    order.customer,
                    order
                );


                /* ================================
                   REVIEW POPUP
                   AFTER CHECKOUT
                ================================= */

                setTimeout(
                    function () {

                        showReviewPopup();

                    },
                    700
                );

            }
        );

    }


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    displayOrder();

});
```
