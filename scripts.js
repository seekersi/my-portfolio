// async function setLanguage(lang) {
//     try {
//         const response = await fetch(`lang/${lang}.json`);
//         const translations = await response.json();

//         console.log("Loaded translations:", translations);

//         document.querySelectorAll("[data-i18n]").forEach(element => {
//             const key = element.getAttribute("data-i18n");
//             const newText = translations[key];

//             console.log(`Looking for key: ${key}, found: ${newText}`);

//             if (newText) {
//                 element.textContent = newText;
//             } else {
//                 console.warn(`No translation found for: ${key}`);
//             }
//         });

//         localStorage.setItem("lang", lang);
//     } catch (error) {
//         console.error("Language file loading error:", error);
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const savedLang = localStorage.getItem("lang") || "en";
//     setLanguage(savedLang);
// });

let currentTranslations = {};
let isExpanded = false; // Keeps track of current state

async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();

        console.log("Loaded translations:", translations);

        currentTranslations = translations;

        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            const newText = translations[key];

            console.log(`Looking for key: ${key}, found: ${newText}`);

            if (newText) {
                element.textContent = newText;
            } else {
                console.warn(`No translation found for: ${key}`);
            }
        });

        // Handle "Show More / Show Less" button translation
        const toggleBtn = document.getElementById("toggleButton");
        if (toggleBtn) {
            toggleBtn.textContent = isExpanded
                ? translations["show-less"]
                : translations["show-more"];
        }

        localStorage.setItem("lang", lang);
    } catch (error) {
        console.error("Language file loading error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLanguage(savedLang);
});

// Optional: click handler for button
function toggleContent() {
    const toggleBtn = document.getElementById("toggleButton");
    isExpanded = !isExpanded;

    if (toggleBtn && currentTranslations) {
        toggleBtn.textContent = isExpanded
            ? currentTranslations["show-less"]
            : currentTranslations["show-more"];
    }

    // Add show/hide content logic here if needed
}


document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".toggle-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function (event) {
            // Skip processing if the clicked element is the GitHub link
            if (this.matches("a") && this.textContent.trim() === "View on GitHub") {
                return; // Don't toggle when the link is "View on GitHub"
            }

            event.preventDefault();

            const card = this.closest(".project, .certificate");
            const details = card.querySelector(".project-details, .certificate-details");
            const allToggleButtonsInCard = card.querySelectorAll(".toggle-btn.custom-btn");
            const isExpanded = card.classList.contains("expanded");

            // Collapse other cards
            document.querySelectorAll(".project, .certificate").forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove("expanded");
                    const innerDetails = otherCard.querySelector(".project-details, .certificate-details");
                    if (innerDetails) innerDetails.style.display = "none";

                    const buttonsToReset = otherCard.querySelectorAll(".toggle-btn.custom-btn");
                    buttonsToReset.forEach(btn => {
                        if (btn.textContent.trim() !== "View on GitHub") {
                            btn.textContent = "Show More";
                        }
                    });

                    if (otherCard.classList.contains("project")) {
                        otherCard.style.flex = "1 1 calc(50% - 20px)";
                    }
                }
            });

            // Toggle current card
            if (isExpanded) {
                card.classList.remove("expanded");
                if (details) details.style.display = "none";
            } else {
                card.classList.add("expanded");
                if (details) details.style.display = "block";
            }

            allToggleButtonsInCard.forEach(btn => {
                if (btn.textContent.trim() !== "View on GitHub") {
                    btn.textContent = isExpanded ? "Show More" : "Show Less";
                }
            });

            if (card.classList.contains("project")) {
                card.style.flex = isExpanded ? "1 1 calc(50% - 20px)" : "1 1 100%";
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    card.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            });

            adjustProjectLayout();
        });
    });

    function adjustProjectLayout() {
        const projects = document.querySelectorAll(".project");
        let expandedProjects = Array.from(projects).filter(p => p.classList.contains("expanded"));
        
        if (expandedProjects.length > 0) {
            projects.forEach(p => {
                if (!p.classList.contains("expanded")) {
                    p.style.flex = "1 1 calc(50% - 20px)";
                }
            });
        }
    }
});