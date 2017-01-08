const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// enviornment variable (PORT) from OS for Heroku
const port = process.env.PORT || 3000;

var app = express();
var currentYear = new Date().getFullYear();

// line added to allow for partials in handlebars
hbs.registerPartials(__dirname + '/views/partials');
// changes express to use Handlebars as the view engine
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// // Maintenance Mode
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Under Construction',
//     welcomeMessage: 'We will be back soon!'
//   });
// });

// allows html pages in the public folder to run without having to create a path to each one
app.use(express.static(__dirname + '/public'));

// sets up a helper function for hbs
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (req, res) => {
    // res.send('<h1>hello express</h1>');
    // res.send({
    //   name: 'Spencer',
    //   likes: [
    //     'Biking',
    //     'Cities'
    //   ]
    // })
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'This year is THE year!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        // currentYear: new Date().getFullYear()
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
        // currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to process request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});