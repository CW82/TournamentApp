/*
    SETUP
*/

// Express
const express = require('express');  // Import express
const app = express();               // Instantiate express
const PORT = 8158;                   // Choose a port number

// Database
const db = require('./dbconnector'); // Note: matches file name (db-connector.js)

// View Engine Setup (Handlebars)
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main', // This tells it to use main.hbs by default
    layoutsDir: 'views/layouts/' // The folder where your layouts are located
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
app.get('/teams', (req, res) => {
    res.render('teams', { title: 'Teams Page' });
});

// Matches page route
app.get('/matches', (req, res) => {
    res.render('matches', { title: 'Matches Page' });
});

// Tournaments page route
app.get('/tournaments', (req, res) => {
    res.render('tournaments', { title: 'Tournaments Page' });
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
