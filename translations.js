/* =========================================================
   BEQUEM SCRUBS
   LANGUAGE SYSTEM
   FR / EN / AR
   ========================================================= */


const translations = {


    /* =====================================================
       FRANÇAIS
       ===================================================== */

    fr: {

        "nav-home":
            "HOME",

        "nav-shop":
            "SHOP",

        "nav-reviews":
            "REVIEWS",

        "nav-cart":
            "CART",


        "hero-small":
            "MEDICAL WEAR • EST. 2026",

        "hero-description":
            "Vêtements médicaux conçus autour de vous.",

        "hero-button":
            "SHOP NOW →",


        "story-title":
            "CONÇU POUR<br>LA GARDE.",

        "story-p1":
            "Je connais la réalité du travail dans le milieu médical. De longues journées, des mouvements constants, des lavages répétés — et des vêtements qui ne suivent pas toujours.",

        "story-p2":
            "BEQUEM SCRUBS est né de cette expérience. Je voulais des vêtements médicaux confortables, qui bougent avec vous et qui restent beaux même après votre garde.",


        "quality-1-title":
            "ANTI-BOULOCHES",

        "quality-1-text":
            "Conçu pour rester lisse et impeccable, lavage après lavage.",


        "quality-2-title":
            "EXTENSIBLE & CONFORT",

        "quality-2-text":
            "Un tissu flexible qui accompagne vos mouvements sans vous limiter.",


        "quality-3-title":
            "TOUCHER DOUX",

        "quality-3-text":
            "Confortable sur la peau, même pendant les longues gardes.",


        "quality-4-title":
            "ENTRETIEN FACILE",

        "quality-4-text":
            "Pensé pour la réalité du travail médical et les lavages fréquents.",


        "statement":
            "VOTRE GARDE.<br>VOTRE CONFORT.<br>VOTRE BEQUEM.",

        "statement-small":
            "BEQUEM — CONFORTABLE EN ALLEMAND.",


        "reviews-title":
            "NOTRE<br>COMMUNAUTÉ.",

        "reviews-intro":
            "Votre confort. Votre style. Votre expérience."

    },


    /* =====================================================
       ENGLISH
       ===================================================== */

    en: {

        "nav-home":
            "HOME",

        "nav-shop":
            "SHOP",

        "nav-reviews":
            "REVIEWS",

        "nav-cart":
            "CART",


        "hero-small":
            "MEDICAL WEAR • EST. 2026",

        "hero-description":
            "Medical wear designed around you.",

        "hero-button":
            "SHOP NOW →",


        "story-title":
            "BUILT FOR<br>THE SHIFT.",

        "story-p1":
            "I know the reality of working in healthcare. Long shifts, constant movement, countless washes — and clothes that don't always keep up.",

        "story-p2":
            "BEQUEM SCRUBS was created from that experience. I wanted medical wear that feels good, moves with you and still looks good after the shift is over.",


        "quality-1-title":
            "ANTI-PILLING",

        "quality-1-text":
            "Designed to stay smooth and clean-looking, wash after wash.",


        "quality-2-title":
            "STRETCH & COMFORT",

        "quality-2-text":
            "A flexible fabric that moves with you without feeling restrictive.",


        "quality-3-title":
            "SOFT FEEL",

        "quality-3-text":
            "Comfortable against the skin, even during long shifts.",


        "quality-4-title":
            "EASY CARE",

        "quality-4-text":
            "Made for the reality of medical work and frequent washing.",


        "statement":
            "YOUR SHIFT.<br>YOUR COMFORT.<br>YOUR BEQUEM.",

        "statement-small":
            "BEQUEM — COMFORTABLE IN GERMAN.",


        "reviews-title":
            "OUR<br>COMMUNITY.",

        "reviews-intro":
            "Your comfort. Your style. Your experience."

    },


    /* =====================================================
       العربية
       ===================================================== */

    ar: {

        "nav-home":
            "الرئيسية",

        "nav-shop":
            "المتجر",

        "nav-reviews":
            "التقييمات",

        "nav-cart":
            "السلة",


        "hero-small":
            "ملابس طبية • منذ 2026",

        "hero-description":
            "ملابس طبية مصممة لتناسبك.",

        "hero-button":
            "تسوق الآن ←",


        "story-title":
            "مصمم من أجل<br>المناوبة.",

        "story-p1":
            "أعرف واقع العمل في المجال الطبي. مناوبات طويلة، حركة مستمرة، وغسيل متكرر — وملابس لا تواكبك دائمًا.",

        "story-p2":
            "وُلدت BEQUEM SCRUBS من هذه التجربة. أردت ملابس طبية مريحة، تتحرك معك وتبقى أنيقة حتى بعد انتهاء المناوبة.",


        "quality-1-title":
            "مقاوم للتكتل",

        "quality-1-text":
            "مصمم ليبقى ناعمًا وأنيقًا، غسلة بعد غسلة.",


        "quality-2-title":
            "مرونة وراحة",

        "quality-2-text":
            "قماش مرن يتحرك معك دون أن يقيّد حركتك.",


        "quality-3-title":
            "ملمس ناعم",

        "quality-3-text":
            "مريح على البشرة، حتى أثناء المناوبات الطويلة.",


        "quality-4-title":
            "سهل العناية",

        "quality-4-text":
            "مصمم لواقع العمل الطبي والغسيل المتكرر.",


        "statement":
            "مناوبتك.<br>راحتك.<br>BEQUEM.",

        "statement-small":
            "BEQUEM — تعني مريح باللغة الألمانية.",


        "reviews-title":
            "مجتمعنا<br>الطبي.",

        "reviews-intro":
            "راحتك. أسلوبك. تجربتك."

    }

};


/* =========================================================
   CHANGE LANGUAGE
   ========================================================= */

function changeLanguage(lang) {

    if (!translations[lang]) {
        return;
    }


    const dictionary =
        translations[lang];


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n"
                );


            if (
                dictionary[key] !== undefined
            ) {

                element.innerHTML =
                    dictionary[key];

            }

        });


    /* =========================
       DIRECTION
       ========================= */

    if (lang === "ar") {

        document.documentElement.dir =
            "rtl";

        document.documentElement.lang =
            "ar";

    } else {

        document.documentElement.dir =
            "ltr";

        document.documentElement.lang =
            lang;

    }


    /* =========================
       ACTIVE BUTTON
       ========================= */

    document
        .querySelectorAll(".lang-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.lang === lang
            );

        });


    /* =========================
       SAVE LANGUAGE
       ========================= */

    localStorage.setItem(
        "bequemLanguage",
        lang
    );

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

document
    .querySelectorAll(".lang-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                changeLanguage(
                    this.dataset.lang
                );

            }
        );

    });


/* =========================================================
   LOAD SAVED LANGUAGE
   ========================================================= */

const savedLanguage =
    localStorage.getItem(
        "bequemLanguage"
    ) || "en";


changeLanguage(savedLanguage);
