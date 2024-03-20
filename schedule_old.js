const fs = require('fs');

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to generate the schedule
function generateSchedule(players) {
    console.log("Generating schedule...");
    const weeks = 7;
    const gamesPerWeek = players.length / 4; // 3 games per week
    const schedule = [];

    // Initialize a map to track which players have played against each other
    const playerOpponents = new Map();
    for (const player of players) {
        playerOpponents.set(player, new Set());
    }

    for (let week = 0; week < weeks; week++) {
        console.log(`Generating schedule for week ${week + 1}...`);
        const weekPlayers = [...players]; // Make a copy of players for each week
        const weekSchedule = [];

        for (let i = 0; i < gamesPerWeek; i++) {
            console.log(`Generating game ${i + 1} for week ${week + 1}...`);
            const game = [];
            const team1 = [];
            const team2 = [];

            // Shuffle players for each game
            shuffleArray(weekPlayers);

            // Select players for team 1
            const player1 = weekPlayers.pop();
            let player2 = weekPlayers.pop();
            // Ensure player2 hasn't played against player1 twice
            while (playerOpponents.get(player1).has(player2) || playerOpponents.get(player2).has(player1)) {
                console.log(`Player ${player2} has already played against player ${player1} twice.`);
                weekPlayers.unshift(player2);
                player2 = weekPlayers.pop();
            }
            team1.push(player1, player2);
            playerOpponents.get(player1).add(player2);
            playerOpponents.get(player2).add(player1);

            // Select players for team 2
            const player3 = weekPlayers.pop();
            let player4 = weekPlayers.pop();
            // Ensure player4 hasn't played against player3 twice
            while (playerOpponents.get(player3).has(player4) || playerOpponents.get(player4).has(player3)) {
                console.log(`Player ${player4} has already played against player ${player3} twice.`);
                weekPlayers.unshift(player4);
                player4 = weekPlayers.pop();
            }
            team2.push(player3, player4);
            playerOpponents.get(player3).add(player4);
            playerOpponents.get(player4).add(player3);

            game.push(team1, team2);
            weekSchedule.push(game);
        }

        schedule.push(weekSchedule);
    }

    console.log("Schedule generation completed.");
    return schedule;
}


// Function to save the schedule to a text file
function saveScheduleToFile(schedule) {
    let output = '';

    schedule.forEach((weekSchedule, weekIndex) => {
        output += `Week ${weekIndex + 1}:\n`;

        weekSchedule.forEach((game, gameIndex) => {
            output += `  \nGame ${gameIndex + 1}:\n  ${game[0][0]} & ${game[0][1]}\n`;
            output += `  ${game[1][0]} & ${game[1][1]}\n`;
        });

        output += '\n'; // Add newline between weeks
    });

    fs.writeFileSync('tennis_schedule.txt', output);
    console.log('Schedule has been saved to tennis_schedule.txt');
}

// Main function
function main() {
    const players = ['1-John', '2-James', '3-Jayden', '4-Carter', '5-Emily', '6-Noah', '7-Sam', '8-Rich', '9-Connor', '10-Bob', '11-Cullen', '12-Nolan'];
    const schedule = generateSchedule(players);
    saveScheduleToFile(schedule);
}

// Execute main function
main();
