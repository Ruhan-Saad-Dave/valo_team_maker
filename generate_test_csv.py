import csv
import random

# --- Word lists for generating plausible team names ---
ADJECTIVES = [
    "Atomic", "Azure", "Black", "Blazing", "Blue", "Crimson", "Cosmic", 
    "Cyber", "Dark", "Diamond", "Dire", "Electric", "Emerald", "Fallen",
    "Final", "Frozen", "Golden", "Grand", "Hidden", "Hyper", "Iron", 
    "Jade", "Lost", "Mystic", "Neon", "Omega", "Primal", "Quantum", 
    "Radiant", "Rogue", "Royal", "Ruby", "Savage", "Scarlet", "Shadow",
    "Silver", "Solar", "Storm", "Tempest", "Titan", "Valiant", "Void"
]

NOUNS = [
    "Aces", "Assassins", "Bears", "Blades", "Cobras", "Dragons", "Eagles", 
    "Falcons", "Fenrir", "Ghosts", "Guardians", "Hawks", "Hunters", 
    "Jaguars", "Kings", "Knights", "Lions", "Lurkers", "Ninjas", 
    "Outlaws", "Owls", "Phantoms", "Raiders", "Ravens", "Reapers", 
    "Sentinels", "Serpents", "Sharks", "Strikers", "Tigers", "Titans", 
    "Vipers", "Vultures", "Warriors", "Wolves", "Wraiths", "Zephyrs"
]

def generate_unique_team_name(existing_names):
    """Generates a unique team name that is not already in the set."""
    while True:
        adjective = random.choice(ADJECTIVES)
        noun = random.choice(NOUNS)
        name = f"{adjective} {noun}"
        if name not in existing_names:
            existing_names.add(name)
            return name

def main():
    """Main function to generate the test CSV file."""
    try:
        num_teams_str = input("Enter the number of teams to generate: ")
        num_teams = int(num_teams_str)
        if num_teams <= 0:
            print("Please enter a positive number.")
            return
    except ValueError:
        print("Invalid input. Please enter a number.")
        return

    output_filename = "test_teams.csv"
    # Updated header to be more realistic
    header = ["Timestamp", "Email Address", "Team Name", "Captain's IGN", "Player 2 IGN"]
    
    # Use a set to ensure all generated names are unique
    generated_names = set()

    try:
        with open(output_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Write the header
            writer.writerow(header)
            
            # Generate and write the team data
            for i in range(num_teams):
                team_name = generate_unique_team_name(generated_names)
                timestamp = f"2024/07/{random.randint(1, 28):02d} {random.randint(10, 23)}:{random.randint(10, 59)}:{random.randint(10, 59)}"
                email = f"captain{i+1}@example.com"
                captain_ign = f"{team_name.split()[0]}Captain"
                player2_ign = f"Player{i+1}"
                
                writer.writerow([timestamp, email, team_name, captain_ign, player2_ign])
                
        print(f"\nSuccessfully created '{output_filename}' with {num_teams} unique teams.")
        print("This file now includes extra columns to better simulate a real-world export.")
        print("You can now use the 'Load CSV' button in the application to import this file.")

    except IOError as e:
        print(f"An error occurred while writing the file: {e}")

if __name__ == "__main__":
    main()