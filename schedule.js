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
    const weeks = 7;
    const gamesPerWeek = players.length / 4; // Two teams per game
    const schedule = [];

    // Initialize a map to track which players have played against each other
    const playerOpponents = new Map();
    for (const player of players) {
        playerOpponents.set(player, new Set());
    }

    for (let week = 0; week < weeks; week++) {
        const weekPlayers = [...players]; // Make a copy of players for each week
        const weekSchedule = [];

        for (let i = 0; i < gamesPerWeek; i++) {
            const game = [];
            const team1 = [];
            const team2 = [];

            // Shuffle players for each game
            shuffleArray(weekPlayers);

            // Select players for team 1
            const player1 = weekPlayers.pop();
            const player2 = weekPlayers.pop();
            team1.push(player1, player2);
            playerOpponents.get(player1).add(player2);
            playerOpponents.get(player2).add(player1);

            // Select players for team 2
            const player3 = weekPlayers.pop();
            const player4 = weekPlayers.pop();
            team2.push(player3, player4);
            playerOpponents.get(player3).add(player4);
            playerOpponents.get(player4).add(player3);

            game.push(team1, team2);
            weekSchedule.push(game);
        }

        schedule.push(weekSchedule);
    }

    return schedule;
}

// Function to save the schedule to a text file
function saveScheduleToFile(schedule) {
    let output = '';

    schedule.forEach((weekSchedule, weekIndex) => {
        output += `Week ${weekIndex + 1}:\n`;

        weekSchedule.forEach((game, gameIndex) => {
            output += `  Game ${gameIndex + 1}, Team 1: ${game[0][0]} & ${game[0][1]}\n`;
            output += `  Game ${gameIndex + 1}, Team 2: ${game[1][0]} & ${game[1][1]}\n`;
        });

        output += '\n'; // Add newline between weeks
    });

    fs.writeFileSync('tennis_schedule.txt', output);
    console.log('Schedule has been saved to tennis_schedule.txt');
}

// Main function
function main() {
    const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6', 'Player7', 'Player8', 'Player9', 'Player10', 'Player11', 'Player12'];
    const schedule = generateSchedule(players);
    saveScheduleToFile(schedule);
}

// Execute main function
main();
