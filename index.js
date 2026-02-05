// --- State Management ---
        let teams = [];
        let allRounds = []; // Holds history of completed rounds
        let currentMatches = []; // Holds the matches for the active round
        let roundNumber = 1;
        let viewRound = null; // null for current, or a round number to view history
        
        // Full Competitive Map Pool
        const MAP_POOL = ["Ascent", "Bind", "Haven", "Split", "Icebox", "Breeze", "Fracture", "Lotus", "Pearl", "Sunset", "Abyss"];

        // --- Core Functions ---

        function addTeam() {
            const input = document.getElementById('teamInput');
            const name = input.value.trim();
            if (name && !teams.includes(name)) {
                teams.push(name);
                renderTeamList();
                input.value = '';
                saveLocal();
            } else if (teams.includes(name)) {
                alert("Team already exists!");
            }
        }

        function removeTeam(index) {
            teams.splice(index, 1);
            renderTeamList();
            saveLocal();
        }

        function renderTeamList() {
            const container = document.getElementById('teamList');
            container.innerHTML = teams.map((t, i) => `
                <div class="team-tag">
                    ${t} <span class="remove-team" onclick="removeTeam(${i})">&times;</span>
                </div>
            `).join('');
        }

        // CSV Parser: Expects a column named 'Team Name'
        function processCSV() {
            const fileInput = document.getElementById('csvInput');
            const file = fileInput.files[0];
            if (!file) {
                alert("Please select a CSV file first.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Split and remove empty lines

                if (lines.length === 0) {
                    alert("CSV file is empty.");
                    return;
                }

                // Parse the header to find the 'Team Name' column
                const header = lines[0].split(',').map(h => h.trim());
                const teamNameIndex = header.findIndex(h => h.toLowerCase() === 'team name');

                if (teamNameIndex === -1) {
                    alert("CSV must have a header column named 'Team Name'.");
                    return;
                }

                let addedCount = 0;
                // Process rows
                for (let i = 1; i < lines.length; i++) {
                    const columns = lines[i].split(',');
                    const teamName = columns[teamNameIndex] ? columns[teamNameIndex].trim() : '';

                    if (teamName && !teams.includes(teamName)) {
                        teams.push(teamName);
                        addedCount++;
                    }
                }

                renderTeamList();
                saveLocal();
                alert(`Successfully loaded and added ${addedCount} new teams.`);
            };
            reader.onerror = function() {
                alert("Failed to read the file. Please try again.");
            };
            reader.readAsText(file);
        }

        // --- View Control ---
        function setViewRound(roundNum) {
            viewRound = roundNum;
            renderBracket();
        }

        // --- Matchmaking Logic ---

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function startTournament() {
            if (teams.length < 2) {
                alert("Need at least 2 teams to start!");
                return;
            }
            // Reset state for a new tournament
            allRounds = [];
            roundNumber = 1;
            viewRound = null;

            document.getElementById('setupSection').classList.add('hidden');
            document.getElementById('bracketSection').classList.remove('hidden');
            generateMatches(teams);
        }

        function generateMatches(teamList) {
            currentMatches = [];
            const shuffled = shuffle([...teamList]); // Copy and shuffle
            
            while (shuffled.length > 1) {
                const t1 = shuffled.pop();
                const t2 = shuffled.pop();
                const map = MAP_POOL[Math.floor(Math.random() * MAP_POOL.length)];
                
                const t1Side = "Attack";
                const t2Side = "Defend";

                currentMatches.push({
                    id: Date.now() + Math.random(),
                    team1: t1,
                    team2: t2,
                    map: map,
                    side1: t1Side,
                    side2: t2Side,
                    winner: null
                });
            }

            // Handle Bye (Odd number of teams)
            if (shuffled.length === 1) {
                const byeTeam = shuffled.pop();
                currentMatches.push({
                    id: Date.now(),
                    team1: byeTeam,
                    team2: "BYE",
                    map: "-",
                    side1: "-",
                    side2: "-",
                    winner: byeTeam // Auto winner
                });
            }

            renderBracket();
            saveLocal();
        }

        function renderBracket() {
            const bracketSection = document.getElementById('bracketSection');
            let navHTML = '<div class="round-nav">';
            
            // Add buttons for past rounds
            allRounds.forEach(r => {
                navHTML += `<button class="secondary ${viewRound === r.roundNumber ? 'active' : ''}" onclick="setViewRound(${r.roundNumber})">Round ${r.roundNumber}</button>`;
            });

            // Add button for current round if it exists
            if (currentMatches.length > 0) {
                navHTML += `<button class="secondary ${viewRound === null ? 'active' : ''}" onclick="setViewRound(null)">Current Round (${roundNumber})</button>`;
            }
            navHTML += '</div>';

            // Determine what to display
            let matchesToRender = [];
            let isHistoricView = false;
            let headerHTML = '';

            if (viewRound !== null) {
                // Viewing a historic round
                const roundData = allRounds.find(r => r.roundNumber === viewRound);
                matchesToRender = roundData ? roundData.matches : [];
                isHistoricView = true;
                headerHTML = `
                    <div class="round-header">
                        <h3>Round ${viewRound} (Completed)</h3>
                        <button class="secondary" onclick="downloadRoundCSV(${viewRound - 1})">Download Results</button>
                    </div>
                `;
            } else {
                // Viewing the current round
                matchesToRender = currentMatches;
                isHistoricView = false;
                if (matchesToRender.length > 0) {
                    headerHTML = `<div class="round-header"><h2>Round ${roundNumber}</h2></div>`;
                }
            }

            const matchContainer = bracketSection.querySelector('#matchContainer');
            let matchesHTML = '';
            if (isHistoricView) {
                matchesHTML = matchesToRender.map(m => renderHistoricMatch(m)).join('');
            } else {
                matchesHTML = matchesToRender.map((m, idx) => renderActiveMatch(m, idx)).join('');
            }

            // Update the DOM
            bracketSection.querySelector('#roundTitle').innerHTML = navHTML;
            matchContainer.innerHTML = headerHTML + matchesHTML;

            // Show/hide next round button based on view
            const nextRoundBtn = document.getElementById('nextRoundBtn');
            nextRoundBtn.style.display = (viewRound === null) ? 'inline-block' : 'none';

            checkRoundComplete();
        }

        function renderHistoricMatch(m) {
            if (m.team2 === "BYE") {
                return `
                <div class="match-card completed">
                    <div class="match-info">BYE ROUND</div>
                    <div class="teams-vs"><span class="team-name winner-selected-text">${m.team1}</span></div>
                </div>`;
            }
            return `
            <div class="match-card completed">
                <div class="match-info">MAP: ${m.map}</div>
                <div class="teams-vs">
                    <div class="team-block">
                        <span class="team-name ${m.winner === m.team1 ? 'winner-selected-text' : ''}">
                            ${m.team1}
                        </span>
                    </div>
                    <div style="color:var(--val-red)">VS</div>
                    <div class="team-block">
                        <span class="team-name ${m.winner === m.team2 ? 'winner-selected-text' : ''}">
                            ${m.team2}
                        </span>
                    </div>
                </div>
            </div>`;
        }

        function renderActiveMatch(m, idx) {
            if (m.team2 === "BYE") {
                return `
                <div class="match-card completed">
                    <div class="match-info">BYE ROUND (Auto-Advance)</div>
                    <div class="teams-vs"><span class="team-name">${m.team1}</span></div>
                </div>`;
            }

            const isCompleted = m.winner !== null;
            
            return `
            <div class="match-card ${isCompleted ? 'completed' : ''}">
                <div class="match-info">MAP: ${m.map}</div>
                <div class="teams-vs">
                    <div class="team-block">
                        <span class="team-name ${m.winner === m.team1 ? 'winner-selected-text' : ''}" onclick="setWinner(${idx}, '${m.team1}')">
                            ${m.team1} ${m.winner === m.team1 ? ' (WINNER)' : ''}
                        </span>
                        <span class="role-badge role-${m.side1.toLowerCase()}">${m.side1}</span>
                    </div>
                    <div style="font-weight:bold; font-size:1.5em; color:var(--val-red)">VS</div>
                    <div class="team-block">
                        <span class="team-name ${m.winner === m.team2 ? 'winner-selected-text' : ''}" onclick="setWinner(${idx}, '${m.team2}')">
                            ${m.team2} ${m.winner === m.team2 ? ' (WINNER)' : ''}
                        </span>
                        <span class="role-badge role-${m.side2.toLowerCase()}">${m.side2}</span>
                    </div>
                </div>
            </div>`;
        }

        function setWinner(matchIdx, winnerName) {
            // Can only set winner in the current round view
            if (viewRound !== null) return;

            if (currentMatches[matchIdx].winner === winnerName) {
                currentMatches[matchIdx].winner = null;
            } else {
                currentMatches[matchIdx].winner = winnerName;
            }
            renderBracket();
            saveLocal();
        }

        function checkRoundComplete() {
            const nextBtn = document.getElementById('nextRoundBtn');
            if (currentMatches.length === 0) {
                nextBtn.disabled = true;
                return;
            }
            
            const allDecided = currentMatches.every(m => m.winner !== null);
            nextBtn.disabled = !allDecided;
            
            if(allDecided) {
                nextBtn.style.backgroundColor = "var(--val-red)";
                nextBtn.innerText = "Start Next Round";
            } else {
                nextBtn.style.backgroundColor = "#444";
                nextBtn.innerText = "Waiting for Results...";
            }
        }

        function generateNextRound() {
            const winners = currentMatches.map(m => m.winner);
            
            // Archive the completed round
            allRounds.push({ roundNumber: roundNumber, matches: [...currentMatches] });
            viewRound = null; // Switch view to the new current round

            if (winners.length === 1) {
                const champion = winners[0];
                alert(`Tournament Over! The Champion is: ${champion}`);
                currentMatches = []; // Clear current matches
                
                // Display the final report button
                document.getElementById('finalReportSection').classList.remove('hidden');
                document.getElementById('nextRoundBtn').classList.add('hidden');

                renderBracket();
                saveLocal();
                return;
            }

            roundNumber++;
            generateMatches(winners);
        }

        // --- "Database" / File Handling ---

        function saveLocal() {
            const data = {
                teams,
                allRounds,
                currentMatches,
                roundNumber,
                viewRound,
                uiState: document.getElementById('bracketSection').classList.contains('hidden') ? 'setup' : 'bracket'
            };
            localStorage.setItem('valorantTourneyDB', JSON.stringify(data));
        }

        function loadLocal() {
            const data = JSON.parse(localStorage.getItem('valorantTourneyDB'));
            if (data) {
                restoreState(data);
            }
        }

        function saveToJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('valorantTourneyDB'));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "tournament_db.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        function loadFromJSON(input) {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = JSON.parse(e.target.result);
                restoreState(data);
                saveLocal(); // Sync to local storage
            };
            reader.readAsText(file);
        }

        function restoreState(data) {
            teams = data.teams || [];
            allRounds = data.allRounds || [];
            currentMatches = data.currentMatches || [];
            roundNumber = data.roundNumber || 1;
            viewRound = data.viewRound !== undefined ? data.viewRound : null;

            if (data.uiState === 'bracket') {
                document.getElementById('setupSection').classList.add('hidden');
                document.getElementById('bracketSection').classList.remove('hidden');
                renderBracket();

                // Also check if the tournament is over to show the final report button
                if (currentMatches.length === 0 && allRounds.length > 0) {
                     const lastRound = allRounds[allRounds.length - 1];
                     if (lastRound.matches.map(m => m.winner).length === 1) {
                        document.getElementById('finalReportSection').classList.remove('hidden');
                        document.getElementById('nextRoundBtn').classList.add('hidden');
                     }
                }

            } else {
                document.getElementById('setupSection').classList.remove('hidden');
                document.getElementById('bracketSection').classList.add('hidden');
                renderTeamList();
            }
        }

        function downloadRoundCSV(roundIndex) {
            const round = allRounds[roundIndex];
            if (!round) return;

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Team 1,Team 2,Winner,Map\r\n"; // Header

            round.matches.forEach(m => {
                const row = [m.team1, m.team2, m.winner, m.map].join(",");
                csvContent += row + "\r\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `round_${round.roundNumber}_results.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function downloadFullReport() {
            let reportContent = "Valorant Tournament Full Report\r\n";
            reportContent += "=================================\r\n\r\n";

            allRounds.forEach(round => {
                reportContent += `--- Round ${round.roundNumber} ---\r\n`;
                round.matches.forEach(m => {
                    if (m.team2 === 'BYE') {
                        reportContent += `${m.team1} had a BYE\r\n`;
                    } else {
                        reportContent += `${m.team1} vs ${m.team2} | Map: ${m.map} | Winner: ${m.winner}\r\n`;
                    }
                });
                reportContent += "\r\n";
            });

            const champion = allRounds.length > 0 ? allRounds[allRounds.length - 1].matches.map(m => m.winner)[0] : "N/A";
            reportContent += "=================================\r\n";
            reportContent += `CHAMPION: ${champion}\r\n`;

            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "full_tournament_report.txt");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function resetAll() {
            if(confirm("Are you sure? This will delete all tournament data.")) {
                localStorage.removeItem('valorantTourneyDB');
                location.reload();
            }
        }
        
        function handleCSVFileSelect(input) {
            const button = document.querySelector('button.secondary[onclick="processCSV()"]');
            if (input.files && input.files.length > 0) {
                button.classList.add('file-selected');
            } else {
                button.classList.remove('file-selected');
            }
        }

        // Initialize
        loadLocal();

        document.getElementById('teamInput').addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                addTeam();
            }
        });
        
// --- Drag and Drop CSV ---
const dropZone = document.querySelector('.container');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-active');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === "text/csv") {
            document.getElementById('csvInput').files = files;
            processCSV();
        } else {
            alert("Please drop a CSV file.");
        }
    }
});

// --- Scroll Controls ---
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

window.onscroll = function() {
    const topBtn = document.getElementById('scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};
