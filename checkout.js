document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("orderForm");
    const orderSummary = document.getElementById("orderSummary");

    const cart = JSON.parse(
        localStorage.getItem("bequemCart") || "[]"
    );


    function displayOrder() {

        orderSummary.innerHTML = "";

        if (cart.length === 0) {

            orderSummary.innerHTML = `
                <p>
                    YOUR CART IS EMPTY.
                </p>
            `;

            return;
        }


        cart.forEach(function (item, index) {

            let motif = "NO MOTIF";
            let placement = "—";
            let description = "—";

            if (item.motif) {

                motif =
                    item.motif.name || "NO MOTIF";

                placement =
                    item.motif.placement || "—";

                description =
                    item.motif.description || "—";
            }


            const quantity =
                Number(item.quantity) || 1;


            const article =
                document.createElement("div");

            article.className = "order-item";

            article.innerHTML = `

                <h3>
                    ${item.category || "CUSTOM SET"}
                </h3>

                <div class="order-details">

                    <span>
                        TOP: ${item.top || "—"}
                    </span>

                    <span>
                        PANTS: ${item.pants || "—"}
                    </span>

                    <span>
                        COLOR: ${item.color || "—"}
                    </span>

                    <span>
                        SIZE: ${item.size || "—"}
                    </span>

                    <span>
                        MOTIF: ${motif}
                    </span>

                    <span>
                        PLACEMENT: ${placement}
                    </span>

                    <span>
                        DESCRIPTION: ${description}
                    </span>

                    <span>
                        QTY: ${quantity}
                    </span>

                </div>
            `;

            orderSummary.appendChild(article);

        });

    }


    displayOrder();


    /* =========================
       PLACE ORDER
    ========================= */

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert("YOUR CART IS EMPTY.");

            return;
        }


        const customer = {

            firstName:
                document.getElementById("firstName").value.trim(),

            lastName:
                document.getElementById("lastName").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            city:
                document.getElementById("city").value.trim(),

            address:
                document.getElementById("address").value.trim(),

            email:
                document.getElementById("email").value.trim()

        };


        const order = {

            id:
                "BQ-" +
                Date.now(),

            date:
                new Date().toISOString(),

            customer:
                customer,

            items:
                cart

        };


        /*
         * Pour le moment on sauvegarde
         * la commande dans le navigateur.
         *
         * On connectera ensuite ceci
         * à ton système de réception
         * des commandes.
         */

        localStorage.setItem(
            "bequemLastOrder",
            JSON.stringify(order)
        );


        alert(
            "YOUR ORDER HAS BEEN PREPARED."
        );


        /*
         * On ne vide PAS encore le panier.
         * On attend de connecter le
         * véritable système de réception.
         */

    });

});
