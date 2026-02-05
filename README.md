# Valorant Tournament Matchmaking System

A simple, client-side web application for creating and managing tournament brackets for Valorant competitions. This tool is designed for easy setup and use, running entirely in the web browser without needing a server.

## Features

- **Team Registration:**
    - Add teams one by one with a simple text input.
    - Bulk upload teams from a CSV file (compatible with Google Forms exports where a "Team Name" column exists).
- **Matchmaking:**
    - Randomly generates balanced matchups for each round.
    - Automatically handles "BYE" rounds for an odd number of teams.
- **Bracket Management:**
    - Interactive bracket where you can click to select the winner of each match.
    - Ability to un-select a winner in case of a misclick.
    - Progress to the next round with the click of a button.
- **History & Reporting:**
    - Preserves the results of all completed rounds.
    - A navigation bar allows you to easily view the results of any previous round.
    - Download the results of any individual round as a CSV file.
    - At the end of the tournament, download a full summary report as a `.txt` file, including the final champion.
- **Data Persistence:**
    - All tournament progress is automatically saved to the browser's `localStorage`. This means you can close the page and come back later to resume your tournament.
    - **Note:** Data is stored per-browser and per-device. It is not shared between different users or computers.
- **User Interface:**
    - Clean, modern UI inspired by the Valorant aesthetic.
    - Scroll-to-top and scroll-to-bottom buttons for easy navigation on long pages.

## How to Use

1.  **Open the Application:** Simply open the `index.html` file in your preferred web browser.
2.  **Register Teams:**
    - Use the input field to add teams one by one.
    - Or, upload a `.csv` file containing your team list. The file must have a header row with a column named `Team Name`.
3.  **Start the Tournament:** Once all teams are registered, click the "Start Tournament" button.
4.  **Manage Rounds:**
    - In the bracket view, click on the name of the team that won a match.
    - Once all winners for the round are selected, the "Generate Next Round" button will become active. Click it to proceed.
5.  **View History:** Use the round navigation bar at the top of the bracket to view the results of completed rounds.
6.  **Download Reports:** Use the "Download Results" button within a historic round view or the "Download Full Tournament Report" button at the end of the tournament to save match data.

## Technology Stack

-   **HTML5**
-   **CSS3**
-   **JavaScript (ES6+)**

This project is built with vanilla web technologies and has no external dependencies, making it lightweight and easy to run anywhere.
