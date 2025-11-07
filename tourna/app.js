/*
    SETUP
*/

// Express
const express = require('express');  // Import express
const app = express();               // Instantiate express
const PORT = 8299;                   // Choose a port number

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

// Tournaments page route
app.get('/tournaments', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM Tournaments');
        res.render('tournaments', { title: 'Tournament Page', tournaments: rows});
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// matchTeams page route
app.get('/matchTeams', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM matchTeams');
        res.render('matchTeams', { title: 'Matches Page', matchTeams: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

// tournamentMatches page route
app.get('/tournamentMatches', async (req, res) => {
    try{
        const [rows, fields] = await db.query('SELECT * FROM tournamentMatches');
        res.render('tournamentMatches', { title: 'Matches Page', tournamentMatches: rows});
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
    
});

/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
