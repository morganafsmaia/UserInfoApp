// Create a Node.js application that is the beginning of a user management system. Your users are all 
//saved in a "users.json" file, and you can currently do the following:
// - search for users
// - add new users to your users file.
// - get your starter file here: users.json

// Part 0
// Create one route:
// - route 1: renders a page that displays all your users.

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
let users = require('../src/users.json')
const ejs = require('ejs')

const index = express();

index.use(bodyParser.urlencoded({
    extended: false
}));

index.set('view engine', 'ejs');
index.set('views', './src/views');

index.use(express.static('./public'));

index.listen(4000, () => {
    console.log('Hi! Listening on 4000!');
});

index.get('/', function (req, res) {
    res.render('home');
});

// Part 0
// Create one route:
// - route 1: renders a page that displays all your users.

index.get('/users', function (req, res) {
    fs.readFile('./src/users.json', (err, data) => {
        if (err) {
            throw err;
        };
        var obj = JSON.parse(data);
        res.render('users', {
            obj: obj
        });
    });
});


// Part 1
// Create two more routes:
// - route 2: renders a page that displays a form which is your search bar.

index.get('/search', (req, res) => {
    res.render('search');
});

index.post('/search', (req, res) => {
    var searchfirst = req.body.queryfn;
    var searchlast = req.body.queryln;
    fs.readFile('./src/users.json', (err, data) => {
        if (err) {
            throw err;
        };
        var result = {};
        var obj = JSON.parse(data);
        for (let i = 0; i < obj.length; i++) {
            var FNbase = obj[i].firstname.toLowerCase()
            var LNbase = obj[i].lastname.toLowerCase()
            if (FNbase.includes(searchfirst)) {
                result[i]=FNbase;
            } else if (LNbase.includes(searchlast)) {
                result[i]=LNbase;
            };
        };
       
        res.send(result);
    });

});

// - route 3: takes in the post request from your form, then displays matching users on a new page. 
//Users should be matched based on whether either their first or last name contains the input string.

index.post('/result', (req, res) => {
    var searched = false;
    var searchfirst = req.body.firstname;
    var searchlast = req.body.lastname;
    fs.readFile('./src/users.json', (err, data) => {
        if (err) {
            throw err;
        };
        var obj = JSON.parse(data);
        for (let i = 0; i < obj.length; i++) {
            if (searchfirst.toLowerCase() == obj[i].firstname.toLowerCase() || searchlast.toLowerCase() == obj[i].lastname.toLowerCase()) {
                searched = true;
                var result = obj[i];
                res.render('result', {
                    result: result
                });
            }
        }
        if (searched == false) {
            res.send('<h5>The term you searched was not found</h5>');
        }
    });
});



// Part 2
// Create two more routes:
// - route 4: renders a page with three forms on it (first name, last name, and email) that allows you to add 
//new users to the users.json file.

index.get('/form', (req, res) => {
    res.render('form');
});


// - route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file. 
//Once that is complete, redirects to the route that displays all your users (from part 0).

index.post('/addnewuser', (req, res) => {
    var newUser = req.body;
    var newfirst = newUser.firstname;
    var newlast = newUser.lastname;
    var newemail = newUser.email;
    if (newfirst !== '' && newlast !== '' && newemail !== '') {
        fs.readFile('./src/users.json', (err, data) => {
            if (err) {
                throw err;
            };
            var obj = JSON.parse(data);
            obj.push(newUser);

            fs.writeFile('./src/users.json', JSON.stringify(obj), (err) => {
                if (err) {
                    throw err;
                };
                res.redirect('/users');
            });
        });
    } else {
        res.redirect('/form')
    };
});