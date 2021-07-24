const player = document.getElementById("player");
const table = document.querySelector("table");

// config
let player_id = 1; // '1' is human, and '2' is AI
const symbols = {
    1: "X",
    2: "O"
} // symbols for human and AI
const ai_timeout = 3000;

function changePlayerText() {
    if (player_id == 1) {
        player.innerText = "You are ready please click button below. Remember: X is your, and O is AI";
    } else {
        player.innerText = "You are not ready to select, please wait for AI to select column.";
    }
}

function isAIOrHuman(id) {
    const num = parseInt(id);
    if (num == 1) return "human";
    else if (num == 2) return "AI";
    else return "None";
}

player.addEventListener("click", () => {
    const started = player.getAttribute("isStarted");
    if (started == "true") {
        table.classList.remove("hidden");
        changePlayerText();
    } else if (started == "false") {
        return;
    } else {
        alert("Reloading page");
        location.reload();
    }
});

function chunkingArray(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
}

function getRow(tdEl) {
    const isAIOrHuman_ = isAIOrHuman(tdEl.getAttribute("answeredBy"));
    return {
        isAIOrHuman: isAIOrHuman_,
    }
}

function findWinner() {
    const tds = [...document.querySelectorAll("td")];
    const tdsChunks = chunkingArray(tds, 3); 

    const row1 = tdsChunks[0].map((x) => getRow(x));
    const row2 = tdsChunks[1].map((x) => getRow(x));
    const row3 = tdsChunks[2].map((x) => getRow(x));

    if (row1[0].isAIOrHuman == row1[1].isAIOrHuman && row1[0].isAIOrHuman == row1[2].isAIOrHuman) {
        return row1[0].isAIOrHuman;
    } else if (row2[0].isAIOrHuman == row2[1].isAIOrHuman && row2[0].isAIOrHuman == row2[2].isAIOrHuman) {
        return row2[0].isAIOrHuman;
    } else if (row3[0].isAIOrHuman == row3[1].isAIOrHuman && row3[0].isAIOrHuman == row3[2].isAIOrHuman) {
        return row3[0].isAIOrHuman;
    } else if (row1[0].isAIOrHuman == row2[1].isAIOrHuman && row1[0].isAIOrHuman == row3[2].isAIOrHuman) {
        return row1[0].isAIOrHuman;
    }
    return "None";
}


document.addEventListener("click", (ev) => {
    const tagName = ev.target.tagName.toLowerCase();
    if (tagName === "td") {
        if (player_id != 1) {
            alert("Player " + isAIOrHuman(player_id) + " is selecting column. Please wait");
        } else if (ev.target.getAttribute("answeredBy") && player_id != ev.target.getAttribute("answeredBy")) {
            alert("This column has answered by " + isAIOrHuman(ev.target.getAttribute("answeredBy")) + ". Please select another column");
        } else if (!ev.target.getAttribute("answeredBy")) {
            ev.target.setAttribute("answeredBy", player_id);
            ev.target.innerText = symbols[player_id];
            player_id = player_id == 1 ? 2 : 1;
            let winner = findWinner();
            if (winner == "AI") {
                alert("You lost, AI win. HAHA");
                location.reload();
            } else if (winner == "human") {
                alert("Congratulations, you win");
                location.reload();
            }
            changePlayerText();

            setTimeout(() => {
                const tds = [...document.querySelectorAll("td")].filter(td => !td.getAttribute("answeredBy"));
                if (!tds.length) {
                    table.classList.add("hidden");
                    alert("Game over");
                    location.reload();
                } else {
                    const randomTd = tds[Math.floor(Math.random() * tds.length)];
                    randomTd.setAttribute("answeredBy", player_id);
                    randomTd.innerText = symbols[player_id];
                    player_id = player_id == 1 ? 2 : 1;
                    let winner = findWinner();
                    if (winner == "AI") {
                        alert("You lost, AI win. HAHA");
                        location.reload();
                    } else if (winner == "human") {
                        alert("Congratulations, you win");
                        location.reload();
                    }
                    changePlayerText();
                }
            }, ai_timeout);
        }
    }
});