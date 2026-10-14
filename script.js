
document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page");
    const navigation = document.getElementById("navigation");
    const menuButton = document.getElementById("menuButton");
    const musicButton = document.getElementById("musicButton");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const giftBox = document.getElementById("giftBox");
    const openGiftButton = document.getElementById("openGiftButton");
    const giftContent = document.getElementById("giftContent");
    const flowerMessage = document.getElementById("flowerMessage");
    const memoryUpload = document.getElementById("memoryUpload");
    const memoryGrid = document.getElementById("memoryGrid");
    const memoryEmpty = document.getElementById("memoryEmpty");
    const toast = document.getElementById("toast");

    let giftOpened = false;
    let toastTimer;

    // Page navigation
    function showPage(pageId) {
        const targetPage = document.getElementById(pageId);

        if (!targetPage || !targetPage.classList.contains("page")) {
            return;
        }

        pages.forEach((page) => {
            page.classList.toggle("active", page.id === pageId);
        });

        navigation.classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            showPage(button.dataset.page);
        });
    });

    // Menu
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (
            !navigation.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            navigation.classList.remove("open");
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-expanded", "false");
        }
    });

    // Toast notifications
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    // Music controls
    musicButton.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();
                musicButton.textContent = "🎶";
                showToast("Our little melody is playing. 🎵");
            } catch (error) {
                showToast("Please check that your song file is available.");
            }
        } else {
            backgroundMusic.pause();
            musicButton.textContent = "🎵";
            showToast("Music paused. 💜");
        }
    });

    backgroundMusic.addEventListener("ended", () => {
        musicButton.textContent = "🎵";
    });

    // Gift box
    function openGift() {
        if (giftOpened) {
            giftContent.hidden = false;
            return;
        }

        giftOpened = true;
        giftBox.classList.add("opened");
        giftContent.hidden = false;
        openGiftButton.textContent = "Your Gift Is Open! 💜";

        showToast("A little surprise, just for you! 🎁");

        createHeartBurst();
    }

    giftBox.addEventListener("click", openGift);
    openGiftButton.addEventListener("click", openGift);

    // Hearts and sparkles when the gift opens
    function createHeartBurst() {
        const symbols = ["💜", "💖", "✨", "🌸", "💕"];

        for (let i = 0; i < 16; i++) {
            const particle = document.createElement("span");
            particle.textContent =
                symbols[Math.floor(Math.random() * symbols.length)];

            particle.style.position = "fixed";
            particle.style.left = `${35 + Math.random() * 30}%`;
            particle.style.top = `${45 + Math.random() * 15}%`;
            particle.style.zIndex = "50";
            particle.style.pointerEvents = "none";
            particle.style.fontSize = `${16 + Math.random() * 15}px`;
            particle.style.transition =
                "transform 1.5s ease, opacity 1.5s ease";

            document.body.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.transform =
                    `translate(${(Math.random() - 0.5) * 260}px, ${-80 - Math.random() * 200}px) rotate(${Math.random() * 180}deg)`;
                particle.style.opacity = "0";
            });

            setTimeout(() => particle.remove(), 1600);
        }
    }

    // Flower messages
    document.querySelectorAll(".flower-card").forEach((flower) => {
        flower.addEventListener("click", () => {
            document.querySelectorAll(".flower-card").forEach((item) => {
                item.classList.remove("selected");
            });

            flower.classList.add("selected");

            const message = flower.dataset.message;
            flowerMessage.replaceChildren();

            const sparkle = document.createElement("span");
            sparkle.textContent = "✨";

            const text = document.createElement("p");
            text.textContent = message;

            flowerMessage.append(sparkle, text);
        });
    });

    // Memory gallery
    const memoryUrls = new Set();

    memoryUpload.addEventListener("change", (event) => {
        const files = Array.from(event.target.files || []);
        let addedCount = 0;

        files.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            memoryUrls.add(imageUrl);

            const card = document.createElement("div");
            card.className = "memory-item";

            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = "A favorite memory";
            image.loading = "lazy";

            const removeButton = document.createElement("button");
            removeButton.className = "remove-memory";
            removeButton.type = "button";
            removeButton.textContent = "Remove Photo";

            removeButton.addEventListener("click", () => {
                URL.revokeObjectURL(imageUrl);
                memoryUrls.delete(imageUrl);
                card.remove();

                if (memoryGrid.querySelectorAll(".memory-item").length === 0) {
                    memoryEmpty.hidden = false;
                }

                showToast("Photo removed from the gallery.");
            });

            card.append(image, removeButton);
            memoryGrid.appendChild(card);
            addedCount++;
        });

        if (addedCount > 0) {
            memoryEmpty.hidden = true;
            showToast(
                addedCount === 1
                    ? "A new little memory has bloomed! 🌸"
                    : `${addedCount} memories added to your garden! 💗`
            );
        } else if (files.length > 0) {
            showToast("Please choose image files.");
        }

        // Allow selecting the same files again later
        memoryUpload.value = "";
    });

    // Background stars
    const starsContainer = document.getElementById("stars");
    const starSymbols = ["✦", "✧", "·", "✨"];

    for (let i = 0; i < 35; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.textContent =
            starSymbols[Math.floor(Math.random() * starSymbols.length)];

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.fontSize = `${8 + Math.random() * 15}px`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.animationDuration = `${2 + Math.random() * 4}s`;

        starsContainer.appendChild(star);
    }

    // Start on the home page
    showPage("home");
});
