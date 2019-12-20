const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const MAILCHIMP_URL = process.env.MAILCHIMP_URL;
const MAILCHIMP_AUTHORIZATION = process.env.MAILCHIMP_AUTHORIZATION;

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
    const { firstName, number, email } = req.body;
    console.log('First Name: ' + firstName + ' Number: ' + number + ' Email: ' + email);

    // Make sure fields are filled
    // if (!firstName || !email) {
    //     res.redirect('/fail.html');
    //     return;
    // }

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    EMAIL: email,
                    NUMBER: number
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    const options = {
        url: MAILCHIMP_URL,
        method: 'POST',
        headers: {
            Authorization: MAILCHIMP_AUTHORIZATION
        },
        body: postData
    };

    request(options, (err, response, body) => {
        res.redirect('/success.html');
        // if (err) {
        //     res.redirect('/fail.html');
        // } else {
        //     if (response.statusCode === 200) {
        //         res.redirect('/success.html');
        //     } else {
        //         res.redirect('/fail.html');
        //     }
        // }
    });
});

app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));