
document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "bequemCart";
    const LAST_ORDER_KEY = "bequemLastOrder";
    const WHATSAPP_NUMBER = "213781952022";

    const form = document.getElementById("orderForm");
    const orderSummary = document.getElementById("orderSummary");
    const orderTotal = document.getElementById("orderTotal");


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


    if (!cart.length) {

        if (orderSummary) {

            orderSummary.innerHTML = `
                <p style="padding:20px 0;font-weight:600;">
                    YOUR CART IS EMPTY.
                </p>
            `;

        }

        return;

    }


    /* =========================================
       HELPERS
    ========================================= */

    function getQuantity(item) {

        return Number(item.quantity) || 1;

    }


    function isOutfit(item) {

        return (
            !!item.top ||
            !!item.pants ||
            item.category === "SCRUB SET"
        );

    }


    function isSock(item) {

        return (
            item.category === "ACCESSORY" ||
            item.name === "BAS DE CONTENTION" ||
            !!item.product ||
            !!item.model
        );

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

            name: item.motif.name || "—",

            placement:
                item.motif.placement || "—",

            description:
                item.motif.description || "—"

        };

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


        cart.forEach(function (item) {

            const quantity =
                getQuantity(item);

            const price =
                Number(item.price) || 0;


            total +=
                price * quantity;


            const article =
                document.createElement("div");


            article.className =
                "order-item";


            /* TENUE */

            if (isOutfit(item)) {

                const motif =
                    getMotif(item);


                article.innerHTML = `

                    <h3>🩺 TENUE BEQUEM</h3>

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


            /* BAS */

            else if (isSock(item)) {

                article.innerHTML = `

                    <h3>🧦 BAS DE CONTENTION</h3>

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


            /* OTHER */

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


        /* ORDER */

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


        /* CLIENT */

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


        /* PRODUCTS */

        message +=
            "📦 *DÉTAILS DE LA COMMANDE*\n";

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n\n";


        let total = 0;
        let totalItems = 0;


        order.items.forEach(function (item, index) {

            const quantity =
                getQuantity(item);

            const price =
                Number(item.price) || 0;


            total +=
                price * quantity;

            totalItems +=
                quantity;


            /* TENUE */

            if (isOutfit(item)) {

                const motif =
                    getMotif(item);

const category =
    item.category === "FEMMES"
        ? "FEMME"
        : item.category === "HIJABI"
            ? "HIJAB"
            : "HOMME";

message +=
    "🩺 *ARTICLE " +
    (index + 1) +
    " — TENUE*\n";

message +=
    "Catégorie : " +
    category +
    "\n";


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


            /* BAS */

            else if (isSock(item)) {

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


            /* OTHER */

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


        /* TOTAL */

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


        /* DELIVERY */

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
       WHATSAPP
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


        const url =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);


        window.location.href = url;

    }


    /* =========================================
       REVIEW POPUP
    ========================================= */

    function showReviewPopup() {

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

            <div class="review-overlay">

                <div class="review-box">

                    <button
                        id="reviewClose"
                        class="review-close"
                    >
                        ×
                    </button>


                    <div class="review-icon">
                        ★
                    </div>


                    <h3>
                        ORDER CONFIRMED
                    </h3>


                    <p>
                        Would you like to leave
                        us a review?
                    </p>


                    <div class="review-buttons">

                        <button
                            id="reviewYes"
                            class="review-yes"
                        >
                            YES
                        </button>


                        <button
                            id="reviewNo"
                            class="review-no"
                        >
                            NO
                        </button>

                    </div>

                </div>

            </div>

        `;


        const style =
            document.createElement("style");


        style.textContent = `

            #bequemReviewPopup {
                position: fixed;
                inset: 0;
                z-index: 999999;
            }

            .review-overlay {
                position: fixed;
                inset: 0;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                padding: 24px;
                background: rgba(0,0,0,0.08);
            }

            .review-box {
                position: relative;
                width: 280px;
                background: #fff;
                border: 1px solid #111;
                padding: 24px;
                box-shadow:
                    0 12px 40px rgba(0,0,0,.18);
                animation:
                    reviewAppear .3s ease;
            }

            .review-icon {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #111;
                color: #fff;
                margin-bottom: 14px;
                font-size: 16px;
            }

            .review-box h3 {
                margin: 0 0 8px;
                font-size: 17px;
            }

            .review-box p {
                margin: 0 0 18px;
                font-size: 13px;
                line-height: 1.5;
            }

            .review-close {
                position: absolute;
                top: 7px;
                right: 9px;
                border: 0;
                background: transparent;
                font-size: 22px;
                cursor: pointer;
            }

            .review-buttons {
                display: flex;
                gap: 8px;
            }

            .review-buttons button {
                flex: 1;
                padding: 10px;
                cursor: pointer;
                font-weight: 700;
                font-size: 11px;
            }

            .review-yes {
                background: #111;
                color: #fff;
                border: 1px solid #111;
            }

            .review-no {
                background: #fff;
                color: #111;
                border: 1px solid #111;
            }

            @keyframes reviewAppear {

                from {
                    opacity: 0;
                    transform: translateY(20px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }

            }

            @media (max-width: 500px) {

                .review-overlay {
                    padding: 14px;
                }

                .review-box {
                    width: calc(100% - 28px);
                }

            }

        `;


        document.head.appendChild(style);
        document.body.appendChild(popup);


        /* YES */

        document
            .getElementById("reviewYes")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "reviews.html";

                }
            );


        /* NO */

        document
            .getElementById("reviewNo")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";

                }
            );


        /* X */

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
       SUBMIT
    ========================================= */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


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


                localStorage.setItem(
                    LAST_ORDER_KEY,
                    JSON.stringify(order)
                );


                /*
                 * IMPORTANT:
                 *
                 * Open WhatsApp first.
                 */

                const message =
                    createWhatsAppMessage(
                        order.customer,
                        order
                    );


                const whatsappURL =
                    "https://wa.me/" +
                    WHATSAPP_NUMBER +
                    "?text=" +
                    encodeURIComponent(
                        message
                    );


                /*
                 * Open WhatsApp in same tab.
                 * This avoids popup blockers.
                 */

                window.location.href =
                    whatsappURL;


                /*
                 * The review popup cannot reliably
                 * appear after leaving the page.
                 *
                 * So save a flag.
                 */

                localStorage.setItem(
                    "bequemShowReview",
                    "true"
                );

            }
        );

    }


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    displayOrder();

});
