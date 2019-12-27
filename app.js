const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MAILCHIMP_URL = process.env.MAILCHIMP_URL;
const MAILCHIMP_AUTHORIZATION = process.env.MAILCHIMP_AUTHORIZATION;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', function(req, res) {
    const { name, email, phonenumber, message } = req.body;
    console.log(`Name: ${name}, Email: ${email}, Phone Number: ${phonenumber}, Message: ${message}`);

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    EMAIL: email,
                    PHONE: phonenumber,
                    MESSAGE: message
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
    
    request(options, function(err, response, body){
        if(err){
            console.log(err);
            res.redirect('/fail.html')
        }
        else{
            if(response.statusCode === 200){
                res.redirect('/success.html')
            }
            else{
                res.redirect('/fail.html')
            }
        }

    });
});

app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));