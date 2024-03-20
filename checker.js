const fs = require('fs');
const { exec } = require('child_process');

// Function to check if the schedule meets all criteria
function checkSchedule(schedule) {
    const playerTeamMap = new Map(); // Map to track which players are on the same team
    const playerOpponentMap = new Map(); // Map to track opponents for each player

    for (const weekSchedule of schedule) {
        if (weekSchedule.length !== 3) {
            console.log(`Week does not have exactly 3 games.`);
            return false;
        }
        for (const game of weekSchedule) {
            const teams = game;

            // Check if any player plays more than once a week
            const playerCountMap = new Map();
            for (const team of teams) {
                for (const player of team) {
                    if (!playerCountMap.has(player)) {
                        playerCountMap.set(player, 1);
                    } else {
                        playerCountMap.set(player, playerCountMap.get(player) + 1);
                    }
                }
            }
            for (const [player, count] of playerCountMap.entries()) {
                if (count !== 1) {
                    console.log(`Player ${player} plays ${count} times in week.`);
                    return false;
                }
            }

            // Check if any player is on the same team more than once
            for (const team of teams) {
                for (const player of team) {
                    if (playerTeamMap.has(player)) {
                        const previousTeam = playerTeamMap.get(player);
                        if (teamsAreEqual(previousTeam, team)) {
                            console.log(`Player ${player} is on the same team more than once.`);
                            return false;
                        }
                    } else {
                        playerTeamMap.set(player, team);
                    }
                }
            }

            // Check if any player faces the same opponent more than twice
            for (const team of teams) {
                for (const player of team) {
                    const opponent = getOpponent(team, player);
                    if (!playerOpponentMap.has(player)) {
                        playerOpponentMap.set(player, new Set([opponent]));
                    } else {
                        const opponents = playerOpponentMap.get(player);
                        if (opponents.has(opponent)) {
                            console.log(`Player ${player} faces the same opponent more than twice.`);
                            return false;
                        }
                        opponents.add(opponent);
                    }
                }
            }
        }
    }
    return true;
}


// Helper function to check if two teams are equal
function teamsAreEqual(team1, team2) {
    return (team1[0] === team2[0] && team1[1] === team2[1]) || (team1[0] === team2[1] && team1[1] === team2[0]);
}

// Helper function to get the opponent of a player in a team
function getOpponent(team, player) {
    return team.find(p => p !== player);
}

// Function to check if the schedule meets all criteria from the file
function checkScheduleFromFile(filePath) {
    try {
        // Read the content of the text file
        const content = fs.readFileSync(filePath, 'utf8');

        // Parse the content to extract schedule information
        const lines = content.split('\n');
        const schedule = [];
        let currentWeek = null;
        let currentGame = null;

        for (const line of lines) {
            if (line.startsWith('Week')) {
                if (currentWeek !== null && currentGame !== null) {
                    currentWeek.push(currentGame);
                    schedule.push(currentWeek);
                }
                currentWeek = [];
                currentGame = [];
            } else if (line.startsWith('Game')) {
                if (currentGame !== null) {
                    currentWeek.push(currentGame);
                }
                currentGame = [];
            } else if (line.trim() !== '') {
                const [player1, player2] = line.split('&').map(player => player.trim());
                currentGame.push([player1, player2]);
            }
        }

        // Push the last game of the last week
        if (currentWeek !== null && currentGame !== null) {
            currentWeek.push(currentGame);
            schedule.push(currentWeek);
        }

        // Use the schedule to check if it meets the criteria
        return checkSchedule(schedule);
    } catch (error) {
        console.error('An error occurred while reading the schedule file:', error);
        return false;
    }
}

// Function to run the schedule generation script
function generateSchedule() {
    return new Promise((resolve, reject) => {
        exec('node schedule.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running schedule.js: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`schedule.js stderr: ${stderr}`);
                reject(stderr);
            }
            console.log(`Generated schedule: ${stdout}`);
            resolve();
        });
    }).catch(error => {
        console.error(`Failed to generate schedule: ${error}`);
    });
}

// Function to run the main checking loop
async function main() {
    let meetsCriteria = false;
    while (!meetsCriteria) {
        console.log('Checking schedule...');
        try {
            meetsCriteria = checkScheduleFromFile('tennis_schedule.txt');
            if (!meetsCriteria) {
                console.log('The schedule does not meet all criteria. Generating new schedule...');
                await generateSchedule();
            } else {
                console.log('The schedule meets all criteria.');
                fs.rename(
                    'tennis_schedule.txt',
                    'tennis_schedule_approved.txt',
                    () => {
                        console.log("\nFile Renamed!\n");
                    });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            break; // Stop the loop if there's an error
        }
    }
}

// Start the main checking loop
main();
