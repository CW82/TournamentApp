/*
    SETUP
*/

// Express
const express = require('express');  // Import express
const app = express();               // Instantiate express
const PORT = 8498;                   // Choose a port number

// Database
const db = require('./dbconnector'); // Note: matches file name (db-connector.js)

// View Engine Setup (Handlebars)
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main', // This tells it to use main.hbs by default
    layoutsDir: 'views/layouts/', // The folder where your layouts are located
    helpers: {
        formatDate: (date) => {
            // Format as Month Day, Year (e.g., November 6, 2025)
            return new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }
}))
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files like CSS
app.use(express.static(__dirname + '/public'));


/*
    ROUTES
*/

// Home page route
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.hbs
});


/* TEAMS */


// Teams page route
app.get('/teams', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM Teams');
        res.render('teams', { title: 'Teams Page', teams: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// Teams add route
app.post('/teams/add', async (req, res) => {
    const { teamName, region, playerCount } = req.body;
    try {
        await db.query(
            'INSERT INTO Teams (teamName, region, playerCount) VALUES (?, ?, ?)',
            [teamName, region, playerCount]
        );
        res.redirect('/teams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// Teams delete route
app.post('/teams/delete/:teamID', async (req, res) => {
    const teamID = req.params.teamID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM Teams WHERE teamID = ?', [teamID]);

        // Redirect back to teams page
        res.redirect('/teams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting team.');
    }
});

// Teams update route
app.post('/teams/update/:teamID', async (req, res) => {
    const teamID = req.params.teamID;
    const { teamName, region, playerCount } = req.body;

    try {
        await db.query(
            'UPDATE Teams SET teamName = ?, region = ?, playerCount = ? WHERE teamID = ?',
            [teamName, region, playerCount, teamID]
        );
        res.redirect('/teams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while updating team.');
    }
});



/* MATCHES */


// Matches page route
app.get('/matches', async (req, res) => {
    try{
        const [rows] = await db.query(`
            SELECT 
                m.*,
                t.tournamentName,
                w.teamName AS winnerName
            FROM Matches m
            LEFT JOIN Tournaments t ON m.tournamentID = t.tournamentID
            LEFT JOIN Teams w ON m.winner = w.teamID
        `);
        // Get teams for dropdown
        const [teams] = await db.query(`
            SELECT teamID, teamName FROM Teams ORDER BY teamName
        `);
        // fetch tournaments to populate dropdowns (show name for user)
        const [tournaments] = await db.query('SELECT t.tournamentID, t.tournamentName, g.title AS gameTitle FROM Tournaments t LEFT JOIN Games g ON t.gameID = g.gameID');
           res.render('matches', {
            matches: rows,
            teams,
            tournaments
        });
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
});

// Matches add route
app.post('/matches/add', async (req, res) => {
    const { tournamentID, scheduledTime, winner } = req.body;
    try {
        await db.query(`
            INSERT INTO Matches (tournamentID, scheduledTime, winner)
            VALUES (?, ?, ?)
        `, [tournamentID, scheduledTime, winner]);
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// Matches delete route
app.post('/matches/delete/:matchID', async (req, res) => {
    const matchID = req.params.matchID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM Matches WHERE matchID = ?', [matchID]);

        // Redirect back to teams page
        res.redirect('/matches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting match.');
    }
});

// Matches update route
app.post('/matches/update/:matchID', async (req, res) => {
    const { matchID } = req.params;
    const { tournamentID, scheduledTime, winner } = req.body;
    try {
        await db.query(
            'UPDATE Matches SET tournamentID = ?, scheduledTime = ?, winner = ? WHERE matchID = ?',
            [tournamentID, scheduledTime, winner, matchID]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database update error');
    }
});



/* TOURNAMENTS */


// Tournaments page route
app.get('/tournaments', async (req, res) => {
    try {
        const [tournaments] = await db.query(`
            SELECT 
                t.*, 
                g.title AS gameTitle
            FROM Tournaments t
            LEFT JOIN Games g ON t.gameID = g.gameID
        `);
        const [games] = await db.query(`SELECT gameID, title FROM Games`);

        res.render('tournaments', {
            title: "Tournaments Page",
            tournaments,
            games
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// Tournaments add route
app.post('/tournaments/add', async (req, res) => {
    const { tournamentName, gameID, prizeMoney, location, startDate, endDate } = req.body;
    try {
        await db.query(
            'INSERT INTO Tournaments (tournamentName, gameID, prizeMoney, location, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)',
            [tournamentName, gameID, prizeMoney, location, startDate, endDate]
        );
        res.redirect('/tournaments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// Tournaments delete route
app.post('/tournaments/delete/:tournamentID', async (req, res) => {
    const tournamentID = req.params.tournamentID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM Tournaments WHERE tournamentID = ?', [tournamentID]);

        // Redirect back to teams page
        res.redirect('/tournaments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting tournament.');
    }
});

// Tournaments update route
app.post('/tournaments/update/:tournamentID', async (req, res) => {
    const { tournamentID } = req.params;
    const { tournamentName, gameID, prizeMoney, location, startDate, endDate } = req.body;
    try {
        await db.query(
            'UPDATE Tournaments SET tournamentName=?, gameID=?, prizeMoney=?, location=?, startDate=?, endDate=? WHERE tournamentID=?',
            [tournamentName, gameID, prizeMoney, location, startDate, endDate, tournamentID]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database update error');
    }
});



/* MATCHTEAMS */


app.get('/matchTeams', async (req, res) => {
    try{
        const [matchTeams] = await db.query(`
            SELECT mt.matchTeamsID, mt.matchID, mt.teamID, t.teamName
            FROM matchTeams mt
            JOIN Teams t ON mt.teamID = t.teamID
            ORDER BY mt.matchTeamsID, mt.matchID ASC
        `);

        const [teams] = await db.query(`SELECT teamID, teamName FROM Teams`);
        const [matches] = await db.query(`SELECT matchID FROM Matches`);

        res.render('matchTeams', {
            title: 'matchTeams Page',
            matchTeams,
            teams,
            matches
        });

    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
});

// matchTeams add route
app.post('/matchTeams/add', async (req, res) => {
    const { matchID, teamID } = req.body;
    try {
        await db.query(
            'INSERT INTO matchTeams (matchID, teamID) VALUES (?, ?)',
            [matchID, teamID]
        );
        res.redirect('/matchTeams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// matchTeams delete route
app.post('/matchTeams/delete/:matchTeamsID', async (req, res) => {
    const matchTeamsID = req.params.matchTeamsID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM matchTeams WHERE matchTeamsID = ?', [matchTeamsID]);

        // Redirect back to teams page
        res.redirect('/matchTeams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting matchTeam.');
    }
});

// matchTeams update route
app.post('/matchTeams/update/:id', async (req, res) => {
    const { id } = req.params;
    const { matchID, teamID } = req.body;
    try {
        await db.query(
            'UPDATE matchTeams SET matchID=?, teamID=? WHERE matchTeamsID=?',
            [matchID, teamID, id]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database update error');
    }
});

/* GAMES */

// games page route
app.get('/games', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM Games');
        res.render('games', { title: 'Games Page', games: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// games add route
app.post('/games/add', async (req, res) => {
    const { title, developer, genre } = req.body;
    try {
        await db.query(
            'INSERT INTO Games (title, developer, genre) VALUES (?, ?, ?)',
            [title, developer, genre]
        );
        res.redirect('/games');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// games delete route
app.post('/games/delete/:gameID', async (req, res) => {
    const gameID = req.params.gameID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM Games WHERE gameID = ?', [gameID]);

        // Redirect back to teams page
        res.redirect('/games');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting games.');
    }
});

// games update route

app.post('/games/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, developer, genre } = req.body;
    try {
        await db.query(
            'UPDATE Games SET title=?, developer=?, genre=? WHERE gameID=?',
            [ title, developer, genre, id]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database update error');
    }
});

/*
    RESET
*/
app.post('/reset', async (req, res) => {
    try {
        await db.query("CALL sp_reset_database()");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Database reset failed");
    }
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
