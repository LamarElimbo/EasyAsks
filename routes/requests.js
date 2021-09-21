const router = require('express').Router();
const mongoose = require('mongoose');
let Request = require('./../models/requests')
let User = require('./../models/users');

require('dotenv').config();

const PUBLISHABLE_KEY = (process.env.NODE_ENV === 'production') ? process.env.PUBLISHABLE_KEY_LIVE : process.env.PUBLISHABLE_KEY_TEST
const stripe = require('stripe')(PUBLISHABLE_KEY)

//Get list of all requests
router.route('/').get((req, res) => {
    Request.find().sort( { "createdAt": -1 } )
      .then(requests => res.json(requests))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//Create new request
router.post('/add', (req, res) => {
    const request = new Request({
        requiresValidation: req.body.requiresValidation,
        description: req.body.description,
        link: req.body.link,
        postedBy: req.body.postedBy,
        fulfillment: [],
        stripeSessionIds: []
    })

    request.save()
        .then(request => res.json(request))
        .catch(err => console.log(err))

  });

//Get specific request
  router.route('/:id').get((req, res) => {
    Request.findById(req.params.id)
      .then(request => res.json(request))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
//Update specific request
router.route('/update/:id').put((req, res) => {
    Request.updateOne(
        {_id: mongoose.Types.ObjectId(req.params.id)}, 
        { $set: {requiresValidation: req.body.requiresValidation, description: req.body.description, link: req.body.link}},
        function (err, docs) {
            if (err){
                console.log("err: ", err)
            } else {
                console.log("Updated request fulfillment : ", docs);
            }
        }
    )
  });

//Extend expiration Date
router.route('/extend-expiration/:id').put((req, res) => {
    Request.updateOne(
        {_id: mongoose.Types.ObjectId(req.params.id)}, 
        { $set: {expirationDate: req.body.newDate}, $addToSet: {stripeSessionIds: req.body.session_id}, $inc: { pointsSpent: req.body.dec }},
        function (err, docs) {
            if (err){
                console.log("err: ", err)
            } else {
                console.log("Updated request fulfillment : ", docs);
            }
        }
    )
    User.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.userId) }, 
        { $inc: { availablePoints: -req.body.dec }},
        function (err, docs) {
            if (err){
                console.log("err: ", err)
            } else {
                console.log("Updated available points : ", docs);
            }
        })
});

// Update Request's fulfillment
router.route('/update-fulfilled/:id').put((req, res) => {
    const fulfillmentUpdated = req.body.fulfillmentUpdated
    Request.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, { $addToSet: {fulfillment: fulfillmentUpdated}},
        function (err, docs) {
            if (err){
                console.log("err: ", err)
            } else {
                console.log("Updated request fulfillment : ", docs);
            }
        })
    });

//Delete specific request
router.route('/:id').delete((req, res) => {
    Request.findByIdAndDelete(req.params.id)
      .then(() => res.json('Request deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
});

//Stripe integration
router.route('/create-checkout-session').post(async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Request Expiration Extension'
            },
            unit_amount: 500,
          },
          quantity: req.body.quantity,
        },
      ],
      mode: 'payment',
      //success_url: `https://www.easyasks.com/edit-request/${req.body.requestId}`,
      //cancel_url: `https://www.easyasks.com/edit-request/${req.body.requestId}`,
        success_url: `http://localhost:3000/edit-request/${req.body.requestId}?extension-success=${req.body.quantity}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/edit-request/${req.body.requestId}`,
    })
    
    try {
        res.json({ id: session.id })
    } catch(err) {
        console.log("node err: ", err);
    }
});

module.exports = router;