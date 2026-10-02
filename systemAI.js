const SystemAI = {

    // Get saved player data
    getData() {
        return JSON.parse(
            localStorage.getItem("systemData") ||
            JSON.stringify({
                physics: { correct: 0, total: 0 },
                chemistry: { correct: 0, total: 0 },
                maths: { correct: 0, total: 0 },
                streak: 0,
                bossesDefeated: 0
            })
        );
    },

    // Save player data
    saveData(data) {
        localStorage.setItem(
            "systemData",
            JSON.stringify(data)
        );
    },

    // Record a quest result
    recordResult(subject, correct, total) {

        const data = this.getData();

        subject = subject.toLowerCase();

        if (!data[subject]) {
            data[subject] = {
                correct: 0,
                total: 0
            };
        }

        data[subject].correct += correct;
        data[subject].total += total;

        this.saveData(data);

        return this.analyze();
    },

    // Analyze the player's current state
    analyze() {

        const data = this.getData();

        const subjects = ["physics", "chemistry", "maths"];

        let weakest = subjects[0];
        let weakestAccuracy = 100;

        subjects.forEach(subject => {

            const result = data[subject];

            if (result.total === 0) return;

            const accuracy =
                (result.correct / result.total) * 100;

            if (accuracy < weakestAccuracy) {
                weakestAccuracy = accuracy;
                weakest = subject;
            }
        });

        return {
            weakestSubject: weakest,
            weakestAccuracy: Math.round(weakestAccuracy),
            streak: data.streak,
            bossesDefeated: data.bossesDefeated
        };
    },

    // Generate the next quest
    generateQuest() {

        const analysis = this.analyze();

        let difficulty;
        let questions;
        let xp;

        if (analysis.weakestAccuracy < 60) {

            difficulty = "Easy";
            questions = 10;
            xp = 200;

        } else if (analysis.weakestAccuracy < 75) {

            difficulty = "Normal";
            questions = 15;
            xp = 350;

        } else if (analysis.weakestAccuracy < 90) {

            difficulty = "Hard";
            questions = 20;
            xp = 600;

        } else {

            difficulty = "Extreme";
            questions = 25;
            xp = 1000;
        }

        return {
            type: "QUEST",
            subject: analysis.weakestSubject,
            difficulty: difficulty,
            questions: questions,
            xp: xp
        };
    }
};
