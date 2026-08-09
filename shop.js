document.addEventListener("DOMContentLoaded", () => {

    const sliders = document.querySelectorAll(".image-slider");


    sliders.forEach((slider) => {

        const slides = slider.querySelectorAll(".slide");

        const currentNumber =
            slider.querySelector(".current");

        let current = 0;


        function changeSlide() {

            slides[current].classList.remove("active");


            current++;

            if (current >= slides.length) {
                current = 0;
            }


            slides[current].classList.add("active");


            if (currentNumber) {

                currentNumber.textContent =
                    String(current + 1).padStart(2, "0");

            }

        }


        setInterval(changeSlide, 3500);

    });

});
