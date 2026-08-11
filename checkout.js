```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       CONFIGURATION
    ========================================= */

    const CART_KEY = "bequemCart";
    const LAST_ORDER_KEY = "bequemLastOrder";

    // BEQUEM SCRUBS - WhatsApp réception
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
       LOAD CART
    ========================================= */

    let cart = [];

    try {

        cart = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

    } catch (error) {

        cart = [];

    }


    /* =========================================
       HELPERS
    ========================================= */

    function getQuantity(item) {

        return Number(item.quantity) || 1;

    }


    function getMotif(item) {

        if (!item.motif) {

            return {
                name: "NO MOTIF",
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
                item.motif.name ||
                "NO MOTIF",

            placement:
                item.motif.placement ||
                "—",

            description:
                item.motif.description ||
                "—"

        };

    }


    function isCompressionSock(item) {

        return (
            item.category === "ACCESSORY" ||
            !!item.product ||
            !!item.model ||
            !!item.compressionSock
        );

    }


    function isOutfit(item) {

        return (
            !!item.top ||
            !!item.pants
        );

    }


    /* =========================================
       DISPLAY ORDER
    ========================================= */

    function displayOrder() {

        orderSummary.innerHTML = "";


        if (!cart.length) {

            orderSummary.innerHTML = `
                <p>
                    YOUR CART IS EMPTY.
                </p>
            `;

            if (orderTotal) {

                orderTotal.textContent =
                    "0 DA";

            }

            return;

        }


        let totalItems = 0;

        let total = 0;


        cart.forEach(function (item, index) {

            const quantity =
                getQuantity(item);


            totalItems += quantity;


            /*
             * PRICE
             *
             * If you add prices later,
             * this will automatically use them.
             */

            const price =
                Number(item.price) || 0;


            total +=
                price * quantity;


            const article =
                document.createElement("div");


            article.className =
                "order-item";


            /* =================================
               TENUE
            ================================= */

            if (isOutfit(item)) {

                const motif =
                    getMotif(item);


                article.innerHTML = `

                    <h3>
                        TENUE BEQUEM
                    </h3>

                    <div class="order-details">

                        <span>
                            TOP:
                            ${item.top || "—"}
                        </span>

                        <span>
                            PANTS:
                            ${item.pants || "—"}
                        </span>

                        <span>
                            COLOR:
                            ${
                                item.color ||
                                item.scrubColor ||
                                "—"
                            }
                        </span>

                        <span>
                            SIZE:
                            ${
                                item.size ||
                                item.scrubSize ||
                                "—"
                            }
                        </span>

                        <span>
                            MOTIF:
                            ${motif.name}
                        </span>

                        <span>
                            PLACEMENT:
                            ${motif.placement}
                        </span>

                        <span>
                            DESCRIPTION:
                            ${motif.description}
                        </span>

                        <span>
                            QTY:
                            ${quantity}
                        </span>

                    </div>

                `;

            }


            /* =================================
               BAS DE CONTENTION
            ================================= */

            else if (
                isCompressionSock(item)
            ) {

                /*
                 * Support both:
                 *
                 * NEW FORMAT:
                 * product / model / color / size
                 *
                 * OLD FORMAT:
                 * compressionSock: {}
                 */

                const socks =
                    item.compressionSock ||
                    item;


                const model =
                    item.model ||
                    item.product ||
                    socks.model ||
                    "—";


                const color =
                    item.color ||
                    socks.color ||
                    "—";


                const size =
                    item.size ||
                    socks.size ||
                    "—";


                const sockQuantity =
                    socks.quantity ||
                    quantity;


                article.innerHTML = `

                    <h3>
                        BAS DE CONTENTION
                    </h3>

                    <div class="order-details">

                        <span>
                            MODEL:
                            ${model}
                        </span>

                        <span>
                            COLOR:
                            ${color}
                        </span>

                        <span>
                            SIZE:
                            ${size}
                        </span>

                        <span>
                            QTY:
                            ${sockQuantity}
                        </span>

                    </div>

                `;

            }


            /* =================================
               OTHER PRODUCT
            ================================= */

            else {

                article.innerHTML = `

                    <h3>
                        ${item.name || "PRODUCT"}
                    </h3>

                    <div class="order-details">

                        ${
                            item.color
                            ? `
                                <span>
                                    COLOR:
                                    ${item.color}
                                </span>
                            `
                            : ""
                        }

                        ${
                            item.size
                            ? `
                                <span>
                                    SIZE:
                                    ${item.size}
                                </span>
                            `
                            : ""
                        }

                        <span>
                            QTY:
                            ${quantity}
                        </span>

                    </div>

                `;

            }


            orderSummary.appendChild(
                article
            );

        });


        if (orderTotal) {

            if (total > 0) {

                orderTotal.textContent =
                    total.toLocaleString("fr-FR") +
                    " DA";

            } else {

                orderTotal.textContent =
                    "PRICE TO BE ADDED";

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


        /* =================================
           ORDER ID
        ================================= */

        message +=
            "📋 *COMMANDE*\n";

        message +=
            "Numéro : " +
            order.id +
            "\n";

        message +=
            "Date : " +
            new Date().toLocaleString(
                "fr-FR"
            ) +
            "\n\n";


        /* =================================
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


        /* =================================
           ITEMS
        ================================= */

        message +=
            "📦 *DÉTAILS DE LA COMMANDE*\n";

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n\n";


        let totalItems = 0;

        let total = 0;


        order.items.forEach(
            function (item, index) {

                const quantity =
                    getQuantity(item);


                totalItems +=
                    quantity;


                const price =
                    Number(item.price) || 0;


                total +=
                    price * quantity;


                /*
                 * TENUE
                 */

                if (isOutfit(item)) {

                    const motif =
                        getMotif(item);


                    message +=
                        "🩺 *ARTICLE " +
                        (index + 1) +
                        " — TENUE BEQUEM*\n";


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
                        "Description motif : " +
                        motif.description +
                        "\n";


                    message +=
                        "Quantité : " +
                        quantity +
                        "\n";


                    if (price > 0) {

                        message +=
                            "Prix : " +
                            (
                                price * quantity
                            ).toLocaleString(
                                "fr-FR"
                            ) +
                            " DA\n";

                    }


                    message += "\n";

                }


                /*
                 * BAS DE CONTENTION
                 */

                else if (
                    isCompressionSock(item)
                ) {

                    const socks =
                        item.compressionSock ||
                        item;


                    const model =
                        item.model ||
                        item.product ||
                        socks.model ||
                        "—";


                    const color =
                        item.color ||
                        socks.color ||
                        "—";


                    const size =
                        item.size ||
                        socks.size ||
                        "—";


                    const sockQuantity =
                        socks.quantity ||
                        quantity;


                    message +=
                        "🧦 *ARTICLE " +
                        (index + 1) +
                        " — BAS DE CONTENTION*\n";


                    message +=
                        "Modèle : " +
                        model +
                        "\n";


                    message +=
                        "Couleur : " +
                        color +
                        "\n";


                    message +=
                        "Taille : " +
                        size +
                        "\n";


                    message +=
                        "Quantité : " +
                        sockQuantity +
                        "\n";


                    if (price > 0) {

                        message +=
                            "Prix : " +
                            (
                                price *
                                sockQuantity
                            ).toLocaleString(
                                "fr-FR"
                            ) +
                            " DA\n";

                    }


                    message += "\n";

                }


                /*
                 * OTHER
                 */

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


                    if (item.color) {

                        message +=
                            "Couleur : " +
                            item.color +
                            "\n";

                    }


                    if (item.size) {

                        message +=
                            "Taille : " +
                            item.size +
                            "\n";

                    }


                    message +=
                        "Quantité : " +
                        quantity +
                        "\n";


                    message += "\n";

                }

            }
        );


        /* =================================
           TOTAL
        ================================= */

        message +=
            "━━━━━━━━━━━━━━━━━━━━\n";

        message +=
            "📊 *RÉCAPITULATIF*\n";

        message +=
            "Nombre d'articles : " +
            totalItems +
            "\n";


        if (total > 0) {

            message +=
                "Total : " +
                total.toLocaleString(
                    "fr-FR"
                ) +
                " DA\n";

        } else {

            message +=
                "Total : À confirmer\n";

        }


        message += "\n";


        /* =================================
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
            "\n";


        message += "\n";


        /* =================================
           FINAL MESSAGE
        ================================= */

        message +=
            "Merci, je souhaite confirmer cette commande.";

        return message;

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ===============================
               EMPTY CART
            =============================== */

            if (!cart.length) {

                alert(
                    "YOUR CART IS EMPTY."
                );

                return;

            }


            /* ===============================
               CUSTOMER
            =============================== */

            const customer = {

                firstName:
                    document
                        .getElementById(
                            "firstName"
                        )
                        .value
                        .trim(),

                lastName:
                    document
                        .getElementById(
                            "lastName"
                        )
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById(
                            "phone"
                        )
                        .value
                        .trim(),

                city:
                    document
                        .getElementById(
                            "city"
                        )
                        .value
                        .trim(),

                address:
                    document
                        .getElementById(
                            "address"
                        )
                        .value
                        .trim(),

                email:
                    document
                        .getElementById(
                            "email"
                        )
                        .value
                        .trim()

            };


            /* ===============================
               ORDER ID
            =============================== */

            const orderId =
                "BQ-" +
                Date.now();


            /* ===============================
               ORDER
            =============================== */

            const order = {

                id:
                    orderId,

                date:
                    new Date().toISOString(),

                customer:
                    customer,

                items:
                    cart

            };


            /* ===============================
               SAVE LAST ORDER
            =============================== */

            localStorage.setItem(
                LAST_ORDER_KEY,
                JSON.stringify(order)
            );


            /* ===============================
               CREATE MESSAGE
            =============================== */

            const message =
                createWhatsAppMessage(
                    customer,
                    order
                );


            /* ===============================
               WHATSAPP URL
            =============================== */

            const whatsappURL =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(
                    message
                );


            /* ===============================
               OPEN WHATSAPP
            =============================== */

            window.location.href =
                whatsappURL;


            /* ===============================
               CLEAR CART
               AFTER MESSAGE IS OPENED
            =============================== */

            setTimeout(
                function () {

                    localStorage.removeItem(
                        CART_KEY
                    );

                },
                3000
            );

        }
    );


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    displayOrder();

});
```
