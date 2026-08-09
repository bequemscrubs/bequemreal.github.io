let topIndex = 0;
let pantIndex = 0;

const tops = document.querySelectorAll("#tops .product");
const pants = document.querySelectorAll("#pants .product");

function showTop() {

    tops.forEach((item, index) => {
        item.classList.toggle("active", index === topIndex);
    });

    document.getElementById("summaryTop").textContent =
        tops[topIndex].dataset.name;
}


function showPant() {

    pants.forEach((item, index) => {
        item.classList.toggle("active", index === pantIndex);
    });

    document.getElementById("summaryPant").textContent =
        pants[pantIndex].dataset.name;
}


function nextTop() {

    topIndex++;

    if (topIndex >= tops.length) {
        topIndex = 0;
    }

    showTop();
}


function previousTop() {

    topIndex--;

    if (topIndex < 0) {
        topIndex = tops.length - 1;
    }

    showTop();
}


function nextPant() {

    pantIndex++;

    if (pantIndex >= pants.length) {
        pantIndex = 0;
    }

    showPant();
}


function previousPant() {

    pantIndex--;

    if (pantIndex < 0) {
        pantIndex = pants.length - 1;
    }

    showPant();
}


showTop();
showPant();
