const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const path = require('path');
const cron = require('node-cron')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const db = process.env.ATLAS_URI
console.log(`Your uri is ${db}`)

mongoose
  .connect(db, {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true
  })
  // use a promise to check if success
  .then(() => console.log('MongoDB Connected!'))
  .catch(error => console.log('MongoDB did not connect: ', error));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
const requestsRouter = require('./routes/requests');
const usersRouter = require('./routes/users');
app.use('/requests', requestsRouter);
app.use('/user', usersRouter);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Schedule tasks to be run on the server every day at 4:00am.
let Request = require('./models/requests')
cron.schedule('0 4 * * *', () => {
  todaysDate = new Date
    Request.updateMany(
        { expirationDate: { $lt: todaysDate} }, 
        { $set: { "expired": true } },
        function (err, docs) {
            if (err){
                console.log(err)
            } else {
                console.log("Updated expiration date : ", docs);
            }
        })
        .then(() => res.json('Requests refreshed.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});