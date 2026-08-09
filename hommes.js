document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       VARIABLES
    ===================================== */

    let selectedTop = null;
    let selectedPants = null;

    let selectedColor = null;
    let selectedSize = null;

    /*
       Chaque motif possède ses propres informations.
       Ils ne se mélangent PAS.
    */

    let motifs = {

        "MOTIF 01": {
            placement: null,
            description: ""
        },

        "MOTIF 02": {
            placement: null,
            description: ""
        },

        "MOTIF 03": {
            placement: null,
            description: ""
        }

    };


    let selectedMotif = "NO MOTIF";


    /* =====================================
       TOPS
    ===================================== */

    const topCards =
        document.querySelectorAll(".top-card");

    let topIndex = 0;


    function selectTop(index) {

        if (index < 0) {
            index = topCards.length - 1;
        }

        if (index >= topCards.length) {
            index = 0;
        }


        topIndex = index;


        topCards.forEach(function (card) {
            card.classList.remove("selected");
        });


        const card = topCards[index];

        card.classList.add("selected");


        selectedTop =
            card.dataset.value;


        document.getElementById("selectedTop")
            .textContent = selectedTop;


        document.getElementById("summaryTop")
            .textContent = selectedTop;


        updateStatus();

    }


    topCards.forEach(function (card, index) {

        card.addEventListener("click", function () {

            selectTop(index);

        });

    });


    document
        .getElementById("topNext")
        .addEventListener("click", function () {

            selectTop(topIndex + 1);

        });


    document
        .getElementById("topPrev")
        .addEventListener("click", function () {

            selectTop(topIndex - 1);

        });



    /* =====================================
       PANTS
    ===================================== */

    const pantsCards =
        document.querySelectorAll(".pants-card");

    let pantsIndex = 0;


    function selectPants(index) {

        if (index < 0) {
            index = pantsCards.length - 1;
        }

        if (index >= pantsCards.length) {
            index = 0;
        }


        pantsIndex = index;


        pantsCards.forEach(function (card) {

            card.classList.remove("selected");

        });


        const card = pantsCards[index];

        card.classList.add("selected");


        selectedPants =
            card.dataset.value;


        document.getElementById("selectedPants")
            .textContent = selectedPants;


        document.getElementById("summaryPants")
            .textContent = selectedPants;


        updateStatus();

    }


    pantsCards.forEach(function (card, index) {

        card.addEventListener("click", function () {

            selectPants(index);

        });

    });


    document
        .getElementById("pantsNext")
        .addEventListener("click", function () {

            selectPants(pantsIndex + 1);

        });


    document
        .getElementById("pantsPrev")
        .addEventListener("click", function () {

            selectPants(pantsIndex - 1);

        });



    /* =====================================
       COLOR
    ===================================== */

    document
        .querySelectorAll(".color-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {


                document
                    .querySelectorAll(".color-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedColor =
                    button.dataset.color;


                document.getElementById("summaryColor")
                    .textContent = selectedColor;


                updateStatus();

            });

        });



    /* =====================================
       SIZE
    ===================================== */

    document
        .querySelectorAll(".size-choice")
        .forEach(function (button) {

            button.addEventListener("click", function () {


                document
                    .querySelectorAll(".size-choice")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                button.classList.add("selected");


                selectedSize =
                    button.dataset.size;


                document.getElementById("summarySize")
                    .textContent = selectedSize;


                updateStatus();

            });

        });



    /* =====================================
       MOTIF
    ===================================== */

    const motifButtons =
        document.querySelectorAll(".motif-choice");

    const motifDetails =
        document.getElementById("motifDetails");

    const placementButtons =
        document.querySelectorAll(".placement-choice");

    const description =
        document.getElementById("motifDescription");


    function loadMotifData() {

        if (selectedMotif === "NO MOTIF") {

            motifDetails.classList.remove("visible");

            document.getElementById("summaryMotif")
                .textContent = "NO MOTIF";

            document.getElementById("summaryPlacement")
                .textContent = "—";

            description.value = "";

            placementButtons.forEach(function (button) {

                button.classList.remove("selected");

            });

            return;
        }


        motifDetails.classList.add("visible");


        const data =
            motifs[selectedMotif];


        document.getElementById("summaryMotif")
            .textContent = selectedMotif;


        /*
           On recharge l'emplacement
           correspondant à CE motif.
        */

        placementButtons.forEach(function (button) {

            button.classList.remove("selected");


            if (
                button.dataset.placement ===
                data.placement
            ) {

                button.classList.add("selected");

            }

        });


        document.getElementById("summaryPlacement")
            .textContent =
            data.placement || "—";


        description.value =
            data.description || "";

    }


    motifButtons.forEach(function (button) {

        button.addEventListener("click", function () {


            motifButtons.forEach(function (item) {

                item.classList.remove("selected");

            });


            button.classList.add("selected");


            selectedMotif =
                button.dataset.motif;


            loadMotifData();

        });

    });



    /* =====================================
       PLACEMENT LIÉ AU MOTIF
    ===================================== */

    placementButtons.forEach(function (button) {

        button.addEventListener("click", function () {


            /*
               Si aucun motif n'est choisi,
               on ne fait rien.
            */

            if (selectedMotif === "NO MOTIF") {

                return;

            }


            placementButtons.forEach(function (item) {

                item.classList.remove("selected");

            });


            button.classList.add("selected");


            /*
               IMPORTANT :
               on sauvegarde l'emplacement
               DANS le motif actuellement choisi.
            */

            motifs[selectedMotif].placement =
                button.dataset.placement;


            document.getElementById("summaryPlacement")
                .textContent =
                button.dataset.placement;

        });

    });



    /* =====================================
       DESCRIPTION LIÉE AU MOTIF
    ===================================== */

    description.addEventListener("input", function () {


        if (selectedMotif === "NO MOTIF") {
            return;
        }


        motifs[selectedMotif].description =
            description.value;

    });



    /* =====================================
       STATUS
    ===================================== */

    function updateStatus() {

        const status =
            document.getElementById("selectionStatus");


        if (!selectedTop) {

            status.textContent =
                "Choose your top.";

            return;

        }


        if (!selectedPants) {

            status.textContent =
                "Choose your pants.";

            return;

        }


        if (!selectedColor) {

            status.textContent =
                "Choose a color.";

            return;

        }


        if (!selectedSize) {

            status.textContent =
                "Choose a size.";

            return;

        }


        if (
            selectedMotif !== "NO MOTIF" &&
            !motifs[selectedMotif].placement
        ) {

            status.textContent =
                "Choose where you want your motif.";

            return;

        }


        status.textContent =
            "Your set is ready to add to cart.";

    }



    /* =====================================
       ADD TO CART
    ===================================== */

    document
        .getElementById("addToCart")
        .addEventListener("click", function () {


            /* TOP */

            if (!selectedTop) {

                alert(
                    "Please choose a top."
                );

                return;

            }


            /* PANTS */

            if (!selectedPants) {

                alert(
                    "Please choose your pants."
                );

                return;

            }


            /* COLOR */

            if (!selectedColor) {

                alert(
                    "Please choose a color."
                );

                return;

            }


            /* SIZE */

            if (!selectedSize) {

                alert(
                    "Please choose a size."
                );

                return;

            }


            /* MOTIF */

            let motifData = null;


            if (selectedMotif !== "NO MOTIF") {


                motifData = {

                    name: selectedMotif,

                    placement:
                        motifs[selectedMotif].placement,

                    description:
                        motifs[selectedMotif].description

                };


                if (!motifData.placement) {

                    alert(
                        "Please choose where you want your motif."
                    );

                    return;

                }

            }



            /* =================================
               PRODUCT
            ================================= */

            const product = {

                category: "HOMMES",

                top: selectedTop,

                pants: selectedPants,

                color: selectedColor,

                size: selectedSize,

                motif: motifData,

                quantity: 1

            };



            /* =================================
               LOCAL STORAGE
            ================================= */

            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "bequemCart"
                    )
                ) || [];


            cart.push(product);


            localStorage.setItem(
                "bequemCart",
                JSON.stringify(cart)
            );



            /* =================================
               SUCCESS
            ================================= */

            const button =
                document.getElementById("addToCart");


            button.textContent =
                "ADDED ✓";


            setTimeout(function () {

                button.textContent =
                    "ADD TO CART →";

            }, 1800);


            console.log(
                "BEQUEM CART:",
                cart
            );

        });



    /* =====================================
       INITIAL STATE
    ===================================== */

    /*
       On sélectionne automatiquement
       le premier haut et le premier pantalon.
    */

    selectTop(0);

    selectPants(0);

    loadMotifData();

});
