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


            if (selectedMotif === "NO MOTIF") {

                return;

            }


            placementButtons.forEach(function (item) {

                item.classList.remove("selected");

            });


            button.classList.add("selected");


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
       BUILD CURRENT OUTFIT
    ===================================== */

    function buildCurrentOutfit() {


        let motifData = null;


        if (selectedMotif !== "NO MOTIF") {

            motifData = {

                name:
                    selectedMotif,

                placement:
                    motifs[selectedMotif].placement,

                description:
                    motifs[selectedMotif].description

            };

        }


        return {

            category: "femmes",

            top: selectedTop,

            pants: selectedPants,

            color: selectedColor,

            size: selectedSize,

            motif: motifData

        };

    }



    /* =====================================
       SAVE OUTFIT BEFORE ACCESSORY
    ===================================== */

    document
        .getElementById("compressionLink")
        .addEventListener("click", function (event) {


            if (
                !selectedTop ||
                !selectedPants ||
                !selectedColor ||
                !selectedSize
            ) {

                event.preventDefault();


                alert(
                    "Please complete your scrub selection first."
                );


                return;

            }


            if (
                selectedMotif !== "NO MOTIF" &&
                !motifs[selectedMotif].placement
            ) {

                event.preventDefault();


                alert(
                    "Please choose where you want your motif."
                );


                return;

            }


            const outfit =
                buildCurrentOutfit();


            localStorage.setItem(

                "bequemCurrentOutfit",

                JSON.stringify(outfit)

            );

        });



    /* =====================================
       ADD TO CART
    ===================================== */

    document
        .getElementById("addToCart")
        .addEventListener("click", function () {


            if (!selectedTop) {

                alert(
                    "Please choose a top."
                );

                return;

            }


            if (!selectedPants) {

                alert(
                    "Please choose your pants."
                );

                return;

            }


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


            let motifData = null;


            if (selectedMotif !== "NO MOTIF") {


                motifData = {

                    name:
                        selectedMotif,

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


            const product = {

                category: "femmes",

                top: selectedTop,

                pants: selectedPants,

                color: selectedColor,

                size: selectedSize,

                motif: motifData,

                quantity: 1

            };


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


            /* L'ancienne configuration
               n'est plus nécessaire */

            localStorage.removeItem(
                "bequemCurrentOutfit"
            );


            const button =
                document.getElementById("addToCart");


            button.textContent =
                "ADDED ✓";


            setTimeout(function () {

                button.textContent =
                    "ADD TO CART →";

            }, 1800);


        });



    /* =====================================
       RESTORE OUTFIT
    ===================================== */

    function restoreOutfit() {


        const saved =
            JSON.parse(
                localStorage.getItem(
                    "bequemCurrentOutfit"
                )
            );


        if (!saved) {

            return;

        }


        if (saved.category !== "femmes") {

            return;

        }


        /* TOP */

        const savedTopIndex =
            Array.from(topCards)
                .findIndex(function (card) {

                    return (
                        card.dataset.value ===
                        saved.top
                    );

                });


        if (savedTopIndex !== -1) {

            selectTop(savedTopIndex);

        }



        /* PANTS */

        const savedPantsIndex =
            Array.from(pantsCards)
                .findIndex(function (card) {

                    return (
                        card.dataset.value ===
                        saved.pants
                    );

                });


        if (savedPantsIndex !== -1) {

            selectPants(savedPantsIndex);

        }



        /* COLOR */

        if (saved.color) {

            const colorButton =
                document.querySelector(
                    `.color-choice[data-color="${saved.color}"]`
                );


            if (colorButton) {

                colorButton.click();

            }

        }



        /* SIZE */

        if (saved.size) {

            const sizeButton =
                document.querySelector(
                    `.size-choice[data-size="${saved.size}"]`
                );


            if (sizeButton) {

                sizeButton.click();

            }

        }



        /* MOTIF */

        if (
            saved.motif &&
            saved.motif.name
        ) {


            const motifButton =
                document.querySelector(
                    `.motif-choice[data-motif="${saved.motif.name}"]`
                );


            if (motifButton) {

                motifButton.click();


                if (saved.motif.placement) {

                    const placementButton =
                        document.querySelector(
                            `.placement-choice[data-placement="${saved.motif.placement}"]`
                        );


                    if (placementButton) {

                        placementButton.click();

                    }

                }


                if (saved.motif.description) {

                    description.value =
                        saved.motif.description;


                    motifs[saved.motif.name].description =
                        saved.motif.description;

                }

            }

        }

    }



    /* =====================================
       INITIAL STATE
    ===================================== */

    selectTop(0);

    selectPants(0);

    loadMotifData();

    restoreOutfit();

});
