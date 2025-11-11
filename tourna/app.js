/*
    SETUP
*/

// Express
const express = require('express');  // Import express
const app = express();               // Instantiate express
const PORT = 8399;                   // Choose a port number

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

// Matches page route
app.get('/matches', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM Matches');
        res.render('matches', { title: 'Matches Page', matches: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// Matches add route
app.post('/matches/add', async (req, res) => {
    const { tournamentID, scheduledTime, winner } = req.body;
    try {
        await db.query(
            'INSERT INTO Matches (tournamentID, scheduledTime, winner) VALUES (?, ?, ?)',
            [tournamentID, scheduledTime, winner]
        );
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

// Tournaments page route
app.get('/tournaments', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM Tournaments');
        res.render('tournaments', { title: 'Tournaments Page', tournaments: rows});
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
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

// matchTeams page route
app.get('/matchTeams', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM matchTeams');
        res.render('matchTeams', { title: 'matchTeams Page', matchTeams: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// matchTeams add route
app.post('/matchTeams/add', async (req, res) => {
    const { matchID, team1_teamID, team2_teamID } = req.body;
    try {
        await db.query(
            'INSERT INTO matchTeams (matchID, team1_teamID, team2_teamID) VALUES (?, ?, ?)',
            [matchID, team1_teamID, team2_teamID]
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

// tournamentMatches page route
app.get('/tournamentMatches', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM tournamentMatches');
        res.render('tournamentMatches', { title: 'tournamentMatches Page', tournamentMatches: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// tournamentMatches add route
app.post('/tournamentMatches/add', async (req, res) => {
    const { tournamentID, matchID } = req.body;
    try {
        await db.query(
            'INSERT INTO tournamentMatches (tournamentID, matchID) VALUES (?, ?)',
            [tournamentID, matchID]
        );
        res.redirect('/tournamentMatches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insert error');
    }
});

// tournamentMatches delete route
app.post('/tournamentMatches/delete/:tournamentMatchesID', async (req, res) => {
    const tournamentMatchesID = req.params.tournamentMatchesID;
    try {
        // Delete the team — cascading deletes handle other tables automatically
        await db.query('DELETE FROM tournamentMatches WHERE tournamentMatchesID = ?', [tournamentMatchesID]);

        // Redirect back to teams page
        res.redirect('/tournamentMatches');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error while deleting tournamentMatches.');
    }
});

/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
