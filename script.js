document.addEventListener("DOMContentLoaded", () => {

    // 🌷 Get HTML elements
    const dreamForm = document.getElementById("dreamForm");
    const dreamList = document.getElementById("dreamList");
    const achievementList = document.getElementById("achievementList");

    const totalDreams = document.getElementById("totalDreams");
    const pendingDreams = document.getElementById("pendingDreams");
    const completedDreams = document.getElementById("completedDreams");
    const dreamProgress = document.getElementById("dreamProgress");

    const noDreams = document.getElementById("noDreams");
    const noAchievements = document.getElementById("noAchievements");


    // 💾 Load saved dreams
    let dreams = JSON.parse(localStorage.getItem("bubuuDreams")) || [];


    // 🌙 Save dreams to browser
    function saveDreams() {
        localStorage.setItem("bubuuDreams", JSON.stringify(dreams));
    }


    // 📊 Update dashboard numbers
    function updateDashboard() {

        const total = dreams.length;

        const completed = dreams.filter(
            dream => dream.completed === true
        ).length;

        const pending = total - completed;

        const progress = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        totalDreams.textContent = total;
        pendingDreams.textContent = pending;
        completedDreams.textContent = completed;
        dreamProgress.textContent = `${progress}%`;
    }


    // 🌷 Display all dreams
    function displayDreams() {

        dreamList.innerHTML = "";
        achievementList.innerHTML = "";

        const activeDreams = dreams.filter(
            dream => dream.completed === false
        );

        const finishedDreams = dreams.filter(
            dream => dream.completed === true
        );


        // 💭 No active dreams
        if (activeDreams.length === 0) {

            dreamList.innerHTML = `
                <p id="noDreams">
                    🌙 No dreams waiting right now...
                    <br>
                    Add a new dream and start your journey! 🐰💗
                </p>
            `;

        } else {

            activeDreams.forEach(dream => {
                dreamList.appendChild(createDreamCard(dream));
            });

        }


        // ✨ No completed dreams
        if (finishedDreams.length === 0) {

            achievementList.innerHTML = `
                <p id="noAchievements">
                    🌷 Your completed dreams will appear here...
                </p>
            `;

        } else {

            finishedDreams.forEach(dream => {
                achievementList.appendChild(createDreamCard(dream));
            });

        }

        updateDashboard();
    }


    // 🎀 Create dream card
    function createDreamCard(dream) {

        const card = document.createElement("div");

        card.className = dream.completed
            ? "dream-card completed"
            : "dream-card";


        const status = dream.completed
            ? "✨ Dream Achieved!"
            : "⏳ In Progress";


        const targetDate = dream.targetDate
            ? `📅 Target: ${dream.targetDate}`
            : "📅 No target date";


        const completedDate = dream.completedDate
            ? `<p>🌸 Completed: ${dream.completedDate}</p>`
            : "";


        card.innerHTML = `
            <h3>💭 ${escapeHTML(dream.title)}</h3>

            <span class="status">
                ${status}
            </span>

            <p>🏷️ ${escapeHTML(dream.category || "Other")}</p>

            <p>🎯 Priority: ${escapeHTML(dream.priority || "Not set")}</p>

            <p>${targetDate}</p>

            <p>
                ${escapeHTML(
                    dream.description || "No description added."
                )}
            </p>

            ${
                dream.reason
                    ? `<p>💌 ${escapeHTML(dream.reason)}</p>`
                    : ""
            }

            ${completedDate}

            <div class="card-buttons">

                ${
                    !dream.completed
                        ? `
                            <button onclick="completeDream(${dream.id})">
                                ✅ Complete
                            </button>
                        `
                        : ""
                }

                <button onclick="editDream(${dream.id})">
                    ✏️ Edit
                </button>

                <button onclick="deleteDream(${dream.id})">
                    🗑️ Delete
                </button>

            </div>
        `;

        return card;
    }


    // 🎉 Complete a dream
    window.completeDream = function(id) {

        const dream = dreams.find(
            dream => dream.id === id
        );

        if (!dream) return;


        dream.completed = true;

        dream.completedDate = new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


        saveDreams();
        displayDreams();

        // 🎊 Celebration
        showCelebration();

    };


    // 🌷 Celebration popup
    function showCelebration() {

        const celebration = document.createElement("div");

        celebration.className = "celebration-popup";

        celebration.innerHTML = `
            <div class="celebration-box">

                <div class="celebration-stars">
                    ✨ 🌷 ✨ 🐰 ✨
                </div>

                <h2>
                    🌙 IT WAS ONCE A DREAM...
                </h2>

                <h1>
                    🌷 NOW IT'S A MEMORY.
                </h1>

                <p>🌸 You wished for it.</p>
                <p>⭐ You worked for it.</p>
                <p>💗 And you made it happen.</p>

                <h3>
                    🎀 “Never forget this moment, Bubuu maa.”
                </h3>

                <div class="confetti">
                    🎉 ✨ 🎊 💕 🌸 🎉 ✨
                </div>

                <button onclick="closeCelebration()">
                    💗 Keep Dreaming
                </button>

            </div>
        `;

        document.body.appendChild(celebration);


        // 🎊 Extra confetti
        createConfetti();
    }


    // ❌ Close celebration
    window.closeCelebration = function() {

        const popup = document.querySelector(
            ".celebration-popup"
        );

        if (popup) {
            popup.remove();
        }

    };


    // 🎊 Confetti
    function createConfetti() {

        const symbols = [
            "💗",
            "✨",
            "🌸",
            "🎀",
            "⭐",
            "🐰",
            "🎉"
        ];


        for (let i = 0; i < 25; i++) {

            const confetti = document.createElement("span");

            confetti.className = "falling-confetti";

            confetti.textContent =
                symbols[Math.floor(Math.random() * symbols.length)];


            confetti.style.left =
                Math.random() * 100 + "vw";

            confetti.style.animationDelay =
                Math.random() * 2 + "s";

            document.body.appendChild(confetti);


            setTimeout(() => {
                confetti.remove();
            }, 5000);

        }
    }


    // ✏️ Edit dream
    window.editDream = function(id) {

        const dream = dreams.find(
            dream => dream.id === id
        );

        if (!dream) return;


        const newTitle = prompt(
            "🌷 Edit your dream title:",
            dream.title
        );


        if (newTitle === null) return;


        if (newTitle.trim() === "") {

            alert(
                "🐰 Bubuu maa... dream title empty-aa irukka koodadhu! 💗"
            );

            return;
        }


        dream.title = newTitle.trim();


        saveDreams();
        displayDreams();

    };


    // 🗑️ Delete dream
    window.deleteDream = function(id) {

        const dream = dreams.find(
            dream => dream.id === id
        );

        if (!dream) return;


        const confirmDelete = confirm(
            `🐰 Are you sure you want to delete "${dream.title}"?`
        );


        if (!confirmDelete) return;


        dreams = dreams.filter(
            dream => dream.id !== id
        );


        saveDreams();
        displayDreams();

    };


    // ➕ Add new dream
    dreamForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const title =
            document.getElementById("dreamTitle").value.trim();

        const description =
            document.getElementById("dreamDescription").value.trim();

        const category =
            document.getElementById("dreamCategory").value;

        const priority =
            document.getElementById("dreamPriority").value;

        const targetDate =
            document.getElementById("targetDate").value;

        const reason =
            document.getElementById("dreamReason").value.trim();


        // 💗 Validation
        if (title === "") {

            alert(
                "🐰 Bubuu maa... first your dream title enter pannu! 💗"
            );

            return;
        }


        // 🌷 Create new dream
        const newDream = {

            id: Date.now(),

            title: title,

            description: description,

            category: category,

            priority: priority,

            targetDate: targetDate,

            reason: reason,

            completed: false,

            completedDate: null

        };


        dreams.push(newDream);


        // 💾 Save
        saveDreams();


        // 🔄 Refresh display
        displayDreams();


        // 🧹 Clear form
        dreamForm.reset();


        // 💕 Success message
        alert(
            "🌷 Dream added successfully! 🐰💗\n\n" +
            "One more dream is now part of your journey. ✨"
        );

    });


    // 🔐 Basic HTML safety
    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    // 🚀 Start website
    displayDreams();

});