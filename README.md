Overview:
Esports has gained popularity over the years, and with that comes a need for a competitive space.
That’s where tournaments come in. Events like the Esports World Cup, which saw over 2,500
players from more than 100 countries, demonstrate just how big these tournaments can get.
Manual tracking is very time-consuming and is often prone to errors; these errors can be
extremely disruptive for the tournament, confusing organizers, players, and audience alike.
Which begs the question, how are we going to organize all this data to ensure the tournament
runs smoothly?

The Esports Tournament Management System is a database-driven system that manages essential
tournament information, including teams, games, matches, and event schedules. It will be made
primarily for smaller to mid-sized tournaments, with around 25 tournaments annually, 10-20
teams per tournament, and over 300 matches across different games. The system will store data
on participating teams, scheduled matches, and results. This will help eliminate manual tracking
errors, simplify the scheduling for organizers and viewers, and make overall viewing easier. Data
will be saved year to year for tournament administrator records to see the growth of the
tournaments each year.

Database Outline In Words:
● Tournaments: Records each tournament; important information, such as when, where,
and how big each tournament was is recorded
○ Attributes:
■ tournamentID: INT, auto_increment, PK, not NULL, unique
■ tournamentName: VARCHAR(100), not NULL,
■ gameID: INT, FK
■ prizeMoney: DECIMAL(12,2), NULL allowed
■ location: VARCHAR(50), not NULL
■ startDate: DATE, not NULL
■ endDate: DATE, not NULL
○ Relationships:
■ M:1 relationship between Tournaments and Games, implemented with
gameID inside Tournament as FK
■ 1:M relationship between Tournament and Matches implemented with
tournamentID inside Matches as FK
■ M:N relationship between Tournament and Teams implemented with
junction table with tournamentTeam, tournamentID, and teamID
● Matches: Records all matches, the results, which team participated, and which game was
played
○ Attributes:
■ matchID: INT, auto_increment, PK, Not NULL, unique
■ scheduledTime: DATETIME
■ winner: INT
○ Relationships:
■ M:1 between Matches and Tournament implemented with tournamentID
inside Matches as FK
■ M:N between Matches and Teams implemented with junction table
matchTeams (matchID, teamID)
■ M:1 between Matches and Teams (winner) implemented with winner
inside Matches as FK
● Games: Record information about each game that is played
○ Attributes:
■ gameID: INT, auto_increment, PK, not NULL, unique
■ title: VARCHAR(50), not NULL
■ developer: VARCHAR(50), NULL allowed
■ genre: VARCHAR(50), NULL allowed
○ Relationships:
■ 1:M between Games and Tournament with gameID inside Tournament as
a FK
● Teams: Record information about each team that is participating in the tournament
○ Attributes:
■ teamID: INT, auto_increment, PK, not NULL, unique
■ teamName: VARCHAR(100), not NULL
■ region: VARCHAR(30), not NULL
■ playerCount: INT, not NULL
○ Relationships:
■ M:N between Teams and Matches implemented with junction table
matchTeams (teamID, matchID)
● Junction Tables: Handles the M:M relationships, a team can play in many matches and a
match could involve two or more teams
○ matchTeams
■ matchTeamsID: INT, auto_increment, PK, Not NULL, unique
■ matchID: INT, FK
■ team1_teamID: INT, FK
■ team2_teamID: INT, FK
■ PK: tournamentID, teamID
○ tournamentMatches
■ tournamentMatchesID: INT, auto_increment, PK, not NULL, unique
■ tournamentID: INT, FK
■ matchID: INT, FK
■ PK: tournamentID, gameID, matchID
○ Relationships
■ 1:M for both because one match can be in the matchTeams record (each
team participating) and multiple teams can also be in the matchTeams
