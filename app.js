var express = require('express');
var mongoose = require('mongoose');
const port = 3000;
const pug = require('pug')
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/rsvp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var Schema = mongoose.Schema;

// Defines the scehma we want our RSVP documents to take
var rsvpSchema = new Schema({
    name: String,
    email: String,
    attending: Boolean,
    guests: Number
})

// Sets up the document model
var Response = mongoose.model('response', rsvpSchema);

var app = express();
app.use(express.static("./public"));
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/guest', (req, res) => {
    Response.find((err, responses) => {
        if (err) return console.error(err);
        res.render('guest', {
            responses: responses
        });
    })
});

app.post('/success', (req, res) => {
 const  rsvp = new Response({
        name: req.body.user_name,
        email: req.body.user_mail,
        contactMethod: req.body.user_contact,
        myDate: req.body.myDate,
        attending: req.body.system,
        guests: Number(req.body.user_attending)
    })

    
    rsvp.save((err, rsvp) => {
        if (err) return console.error(err);
        // client.close()
    })

   res.render('success');
});

app.listen(3000);