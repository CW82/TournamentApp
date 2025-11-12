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


■ tournamentID: INT, FK
■ matchID: INT, FK
■ PK: tournamentID, gameID, matchID
○ Relationships
■ 1:M for both because one match can be in the matchTeams record (each
team participating) and multiple teams can also be in the matchTeams
