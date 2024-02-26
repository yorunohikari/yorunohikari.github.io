
        document.addEventListener("DOMContentLoaded", function () {
            // Extract data from the score table
            const tableRows = document.querySelectorAll("#scoreTable tbody tr");
            const dates = Array.from(tableRows, (row) => row.cells[0].textContent);
            const scores = Array.from(tableRows, (row) =>
                parseInt(row.cells[1].textContent)
            );

            // Create a chart
            const ctx = document.getElementById("quizChart").getContext("2d");
            const myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: "Quiz Scores",
                            data: scores,
                            fill: false,
                            borderColor: "rgba(75, 192, 192, 1)",
                            lineTension: 0.1,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: "category",
                            labels: dates,
                        },
                        y: {
                            beginAtZero: true,
                            max: 10,
                        },
                    },
                },
            });
        });

        // Set the destined date (year, month (0-indexed), day, hours, minutes, seconds)
        const destinedDate = new Date(2024, 11, 1, 0, 0, 0); // December 1, 2024, 12:00:00

        function updateCountdown() {
            const currentDate = new Date();
            const timeRemaining = destinedDate - currentDate;
            const totalTime = destinedDate - new Date(2024, 0, 1, 0, 0, 0); // Total time in milliseconds

            if (timeRemaining > 0) {
                const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                document.getElementById(
                    "countdown"
                ).innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s (${percentage.toFixed(
                    2
                )}%)`;

                // Update the width of the filler
                document.getElementById("filler").style.width = `${percentage}%`;
            } else {
                document.getElementById("countdown").innerHTML = "Countdown expired!";
            }
        }

        // Update countdown every second
        setInterval(updateCountdown, 1000);

        // Initial update
        updateCountdown();

        // Get all the cells with points scored
        const cells = document.querySelectorAll(
            "#scoreTable tbody td:nth-child(2)"
        );

        // Extract scores and calculate the average
        let totalScore = 0;
        let totalQuestions = 0;

        cells.forEach((cell) => {
            const [score, total] = cell.textContent.split("/");
            totalScore += parseInt(score);
            totalQuestions += parseInt(total);
        });

        const averageScore = totalScore / cells.length;

        // Create a new row for the average and total
        const tfoot = document.createElement("tfoot");
        const averageRow = document.createElement("tr");
        const averageDateCell = document.createElement("td");
        const averageScoreCell = document.createElement("td");

        averageDateCell.textContent = "Average";
        averageScoreCell.textContent = averageScore.toFixed(2) + "/10";

        averageRow.appendChild(averageDateCell);
        averageRow.appendChild(averageScoreCell);

        const totalRow = document.createElement("tr");
        const totalDateCell = document.createElement("td");
        const totalScoreCell = document.createElement("td");

        totalDateCell.textContent = "Total";
        totalScoreCell.textContent = `${totalScore}/${totalQuestions}`;

        totalRow.appendChild(totalDateCell);
        totalRow.appendChild(totalScoreCell);

        tfoot.appendChild(averageRow);
        tfoot.appendChild(totalRow);

        // Append the new rows to the table
        document.getElementById("scoreTable").appendChild(tfoot);

        const vocabularyList = [
            {
                kanji: "出港",
                furigana: "しゅっこ",
                meaning: "departure from a port; leaving port; setting sail",
            },
            { kanji: "汽笛", furigana: "きてき", meaning: "steam whistle" },
            {
                kanji: "巨大",
                furigana: "きょだい",
                meaning: "huge; gigantic; enormous (巨大な仏像)",
            },
            { kanji: "船体", furigana: "せんたい", meaning: "Hull" },
            { kanji: "海水", furigana: "かいすい", meaning: "seawater; saltwater" },
            {
                kanji: "響く",
                furigana: "ひびく",
                meaning: "to reverberate; to shake; to vibrate; resound",
            },
            {
                kanji: "押しのける",
                furigana: "おしのける",
                meaning: "to push aside; to brush aside",
            },
            {
                kanji: "振動",
                furigana: "しんどう",
                meaning: "oscillation; vibration",
            },
            {
                kanji: "尻",
                furigana: "しり",
                meaning: "buttocks; behind; rump; bottom; hips",
            },
            { kanji: "全身", furigana: "ぜんしん", meaning: "whole (body)" },
            { kanji: "伝わる", furigana: "つたわる", meaning: "to spread" },
            {
                kanji: "船底",
                furigana: "ふなぞこ",
                meaning: "ship's bottom; bilge",
            },
            { kanji: "最も", furigana: "もっとも", meaning: "most; extremely" },
            { kanji: "船室", furigana: "せんしつ", meaning: "stateroom; cabin" },
            { kanji: "等", furigana: "とう", meaning: "class" },
            {
                kanji: "船旅",
                furigana: "ふなたび",
                meaning: "trip by boat; sea trip; voyage; cruise",
            },
            { kanji: "到着", furigana: "とうちゃく", meaning: "arrival" },
            { kanji: "前科", furigana: "ぜんか", meaning: "criminal records" },
            { kanji: "警察", furigana: "けいさつ", meaning: "police" },
            {
                kanji: "追う",
                furigana: "おう",
                meaning: "to chase; to run after; to pursue; to follow after",
            },
            { kanji: "噂", furigana: "うわさ", meaning: "rumor" },
            {
                kanji: "出来事",
                furigana: "できごと",
                meaning: "incident; affair; happening; event",
            },
            { kanji: "自体", furigana: "じたい", meaning: "itself" },
            {
                kanji: "当然",
                furigana: "とうぜん",
                meaning:
                    "naturally; as a matter of course; rightly; deservedly; justly; of course",
            },
            { kanji: "断片的", furigana: "だんぺんてき", meaning: "fragmentary" },
            {
                kanji: "抱える",
                furigana: "かかえる",
                meaning:
                    "to have (problems, debts, etc.); to take on (a responsibility);",
            },
            { kanji: "街", furigana: "まち", meaning: "city" },
            {
                kanji: "序章",
                furigana: "じょしょう",
                meaning: "preface; foreword; introduction; introductory chapter",
            },
            // Add more vocabulary items as needed
        ];

        function randomizeVocabulary() {
            const shuffledVocabulary = vocabularyList.sort(
                () => Math.random() - 0.5
            );
            const randomVocabularyItem =
                shuffledVocabulary[
                Math.floor(Math.random() * shuffledVocabulary.length)
                ];

            // Display the random vocabulary item on the front side
            document.getElementById("word").textContent =
                randomVocabularyItem.kanji;

            // Display the furigana and meaning on the back side
            document.getElementById("furigana").textContent =
                randomVocabularyItem.furigana;
            document.getElementById("meaning").textContent =
                randomVocabularyItem.meaning;
        }

        // Initial display
        randomizeVocabulary();



        function toggleTable() {
            const table = document.getElementById("scoreTable");
            const partialContent = document.querySelector(".partial-content");
            const button = document.getElementById("toggleButtonShow");

            // Toggle the height to show/hide more rows
            if (partialContent.style.maxHeight) {
                partialContent.style.maxHeight = null;
                button.textContent = "+ Show More";
            } else {
                partialContent.style.maxHeight = partialContent.scrollHeight + "px";
                button.textContent = "- Show Less";
            }

            // Additional logic for other toggle (toggleTableExpand)
            // Implement as needed
        }
