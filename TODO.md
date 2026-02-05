# Project TODO List

A list of potential features and improvements for the future development of this application.

---

### Bracket & Format Improvements

- [ ] **Double-Elimination Bracket:** Implement a loser's bracket to give teams a second chance.
- [ ] **Team Seeding:** Allow the organizer to rank teams before the tournament starts for skill-based first-round matchups.
- [ ] **Group Stage (Round Robin):** Add a group stage before the main bracket to determine seeding.
- [ ] **Swiss Format:** Implement a non-elimination Swiss tournament system for handling a large number of participants.

### Data & Reporting Features

- [ ] **Score Reporting:** Allow the organizer to enter the final match score (e.g., 13-10, 2-1) instead of just picking a winner.
- [ ] **Player Rosters:** Expand the team data model to include a list of players for each team.
- [ ] **Export/Import Bracket State:** Create a robust file-based system to save the tournament state and allow it to be imported on a different computer.

### UI/UX Enhancements

- [ ] **Graphical Bracket View:** Render a true visual tree structure for the bracket.
- [ ] **Customizable Map Pool:** Allow the organizer to select which maps are included in the random map pool.
- [ ] **Editable Matches:** Give the organizer the ability to manually edit a matchup after it has been generated.
- [ ] **Dark/Light Theme Toggle:** Add a UI switch to allow users to choose between a dark and light theme.

### Advanced Architecture

- [ ] **Centralized Database & Live Sharing:** Move data storage from `localStorage` to a backend database to enable a single, shared tournament state and a "read-only" link for live viewing.
