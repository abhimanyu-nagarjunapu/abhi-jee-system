const SystemAI = {
    getProgress() {
        return JSON.parse(
            localStorage.getItem("jeeProgress") ||
            '{"physics":50,"chemistry":50,"maths":50}'
        );
    },

    analyze() {
        const progress = this.getProgress();

        const weakest = Object.entries(progress)
            .sort((a, b) => a[1] - b[1])[0];

        return {
            weakestSubject: weakest[0],
            mastery: weakest[1]
        };
    },

    generateQuest() {
        const analysis = this.analyze();

        let difficulty = "Normal";

        if (analysis.mastery < 50) {
            difficulty = "Easy";
        } else if (analysis.mastery >= 75) {
            difficulty = "Hard";
        }

        return {
            type: "QUEST",
            subject: analysis.weakestSubject,
            difficulty: difficulty,
            xp: difficulty === "Hard" ? 500 : 250
        };
    }
};
