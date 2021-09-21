const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../config/keys");
const mongoose = require('mongoose');


// Load input validation
const validateRegisterInput = require("./../validation/register");
const validateLoginInput = require("./../validation/login");

// Load User model
let User = require('./../models/users');

// route POST api/users/register
// desc Register user
// access Public
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            requestsFulfilled: [],
            requestsPosted: [],
            availablePoints: 0
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });


// route POST api/users/login
// desc Login user and return JWT token
// access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

//Get specific user
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//Add to user's posted requests
router.route('/add-posted-request').put((req, res) => {

    User.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.userId) }, 
        { $addToSet: { requestsPosted: req.body.requestId }, $inc: { availablePoints: -3 }},
        function (err, docs) {
            if (err){
                console.log("err: ", err)
            } else {
                console.log("Updated request posted : ", docs);
            }
        })
    })

//Add to user's fulfilled requests
router.route('/add-fulfilled-request').put((req, res) => {

    User.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.userId) }, 
        { $addToSet: { requestsFulfilled: req.body.requestsId }, $inc: { availablePoints: 1 }},
        function (err, docs) {
            if (err){
                console.log(err)
            } else {
                console.log("Updated User : ", docs);
            }
        })
    });

//Delete account
router.route('/delete-account').delete((req, res) => {
    User.findByIdAndDelete(req.body.userId)
      .then(() => res.json('User deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });
module.exports = router 