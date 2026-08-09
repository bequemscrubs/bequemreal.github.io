/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");

    menu.classList.toggle("active");
}


/* =========================
   CART
========================= */

let cart = [];


function openCart() {

    const cartOverlay = document.getElementById("cartOverlay");

    cartOverlay.classList.add("active");

    displayCart();
}


function closeCart() {

    const cartOverlay = document.getElementById("cartOverlay");

    cartOverlay.classList.remove("active");
}


function addToCart(product) {

    cart.push(product);

    updateCartCount();

    displayCart();

}


function updateCartCount() {

    document.getElementById("cartCount").textContent = cart.length;

}


function displayCart() {

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                Your cart is empty.
            </div>
        `;

        return;
    }


    cartItems.innerHTML = "";

    cart.forEach((item, index) => {

        const product = document.createElement("div");

        product.innerHTML = `
            <div style="
                padding:20px 0;
                border-bottom:1px solid #111;
            ">

                <strong>${item.name}</strong>

                <p style="
                    margin-top:8px;
                    font-size:12px;
                ">
                    ${item.price}
                </p>

                <button
                    onclick="removeFromCart(${index})"
                    style="
                        margin-top:15px;
                        border:none;
                        background:none;
                        text-decoration:underline;
                        cursor:pointer;
                        font-size:10px;
                    "
                >
                    REMOVE
                </button>

            </div>
        `;

        cartItems.appendChild(product);

    });

}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartCount();

    displayCart();

}
/* =================================
   ACCESSORIES ANIMATION
================================= */

const accessories = document.querySelectorAll(".accessory-box");

const accessoryNames = [
    "UNDERSCRUB",
    "BAS DE CONTENTION"
];

let accessoryIndex = 0;


function changeAccessories() {

    accessoryIndex++;

    if (accessoryIndex >= accessoryNames.length) {
        accessoryIndex = 0;
    }

    accessories.forEach((box, index) => {

        box.style.opacity = "0";
        box.style.transform = "translateY(20px)";

        setTimeout(() => {

            box.querySelector("span").textContent =
                accessoryNames[
                    (accessoryIndex + index) %
                    accessoryNames.length
                ];

            box.style.opacity = "1";
            box.style.transform = "";

        }, 600);

    });

}


/* Change every 4 seconds */

setInterval(changeAccessories, 4000);
