const fs = require('fs');

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log("Array shuffled:", array);
}

// Function to initialize player opponents and teams maps
function initializeMaps(players) {
    const playerOpponents = new Map();
    const playerTeams = new Map();

    for (const player of players) {
        playerOpponents.set(player, new Map());
        playerTeams.set(player, new Set());
    }

    console.log("Player opponents and teams maps initialized.");
    return { playerOpponents, playerTeams };
}

// Function to generate the schedule
function generateSchedule(players) {
    console.log("Generating schedule...");
    const weeks = 7;
    const gamesPerWeek = 3; // Fixed 3 games per week
    const schedule = [];

    const { playerOpponents, playerTeams } = initializeMaps(players);

    for (let week = 0; week < weeks; week++) {
        console.log(`Generating schedule for week ${week + 1}...`);
        const weekPlayers = [...players]; // Make a copy of players for each week
        const weekSchedule = [];

        // Shuffle players for each week
        shuffleArray(weekPlayers);

        // Round-robin scheduling algorithm
        for (let i = 0; i < gamesPerWeek; i++) {
            console.log(`Generating game ${i + 1} for week ${week + 1}...`);
            const game = [];
            const team1 = [];
            const team2 = [];

            // Select players for team 1
            const player1 = weekPlayers.pop();
            const player2 = weekPlayers.pop();

            // Check if player1 and player2 are defined
            if (!player1 || !player2) {
                console.log("Insufficient players for a game.");
                break;
            }

            // Check if player1 has played against player2 twice or has been on the same team before
            if (
                playerOpponents.get(player1).has(player2) && playerOpponents.get(player1).get(player2) >= 2 ||
                playerOpponents.get(player2).has(player1) && playerOpponents.get(player2).get(player1) >= 2 ||
                playerTeams.get(player1).has(player2) || playerTeams.get(player2).has(player1)
            ) {
                console.log(`Invalid team formation. Swapping player1: ${player1} with another player.`);
                // Swap player1 with another player
                weekPlayers.unshift(player1);
                continue;
            }

            // Select players for team 2
            let player3, player4;
            do {
                player3 = weekPlayers.pop();
                player4 = weekPlayers.pop();
            } while (
                !player3 || !player4 ||
                player3 === player1 || player3 === player2 || player4 === player1 || player4 === player2 ||
                (
                    playerOpponents.get(player3).has(player4) && playerOpponents.get(player3).get(player4) >= 2 ||
                    playerOpponents.get(player4).has(player3) && playerOpponents.get(player4).get(player3) >= 2 ||
                    playerTeams.get(player3).has(player4) || playerTeams.get(player4).has(player3)
                )
            );

            // Check if player3 and player4 are defined
            if (!player3 || !player4) {
                console.log("Insufficient players for a game.");
                break;
            }

            // Update player opponents and teams
            playerOpponents.get(player1).set(player2, (playerOpponents.get(player1).get(player2) || 0) + 1);
            playerOpponents.get(player2).set(player1, (playerOpponents.get(player2).get(player1) || 0) + 1);
            playerOpponents.get(player3).set(player4, (playerOpponents.get(player3).get(player4) || 0) + 1);
            playerOpponents.get(player4).set(player3, (playerOpponents.get(player4).get(player3) || 0) + 1);
            playerTeams.get(player1).add(player2);
            playerTeams.get(player2).add(player1);
            playerTeams.get(player3).add(player4);
            playerTeams.get(player4).add(player3);

            // Assign players to teams
            team1.push(player1, player2);
            team2.push(player3, player4);

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
            output += `  \nGame ${gameIndex + 1}:\n${game[0][0]} & ${game[0][1]}\n${game[1][0]} & ${game[1][1]}\n`;
        });

        output += '\n'; // Add newline between weeks
    });

    fs.writeFileSync('tennis_schedule.txt', output);
    console.log('Schedule has been saved to tennis_schedule.txt');
    console.log('Log has been saved to tennis_schedule_log.txt');
}

// Function to log output to a text file
function logToFile(log) {
    fs.appendFileSync('tennis_schedule_log.txt', log + '\n');
}

// Main function
function main() {
    const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6', 'Player7', 'Player8', 'Player9', 'Player10', 'Player11', 'Player12'];
    const schedule = generateSchedule(players);
    saveScheduleToFile(schedule);
}

// Execute main function
main();
