import React, { useState, useEffect } from 'react';
import axios from 'axios';
import checkoutIcon from "./../assets/checkout_icon.png"
import plusIcon from "./../assets/plus_icon.png"
import minusIcon from "./../assets/minus_icon.png"
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const PUBLISHABLE_KEY_TEST = 'pk_test_51J08CqLncrL68tlPHvLcSw21G89uLvV2sifBjvtVNd1W76BL0imJ32D6SPq1wTIpqOBYPLMDh2JH93bnzz8or3IJ00DSN8bXF9'
const PUBLISHABLE_KEY_LIVE = 'pk_live_51J08CqLncrL68tlP4ZMnBM8DNk6N3fMCNFLcqMwKzkatqtLSZztqMyn96yJVotYSn81jFa5oNVmK46MH6Suzxl7E00eCFb5tsJ'
const stripePromise = loadStripe(PUBLISHABLE_KEY_LIVE);

export default function StripeCheckout({requestCardData}) {
  const [liveExpirationDate, setLiveExpirationDate] = useState()
  const [expirationDate, setExpirationDate] = useState()
  const [numMonths, setNumMonths] = useState(1)
  const [cost, setCost] = useState(5)  

  const onCheckoutClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const dataToSend = {
      'requestId': requestCardData._id,
      'quantity': numMonths,

    }

    axios.post('/requests/create-checkout-session', dataToSend)
      .then(res => {
        const session = res.data;
        // When the customer clicks on the button, redirect them to Checkout.
        const result = stripe.redirectToCheckout({
            sessionId: session.id,
        });
        if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        }
      })
      .catch(err => console.log(err));
  };

  function dateChanege(action) {
    let date = new Date(expirationDate)
    if (action === "minus") {
      if (numMonths > 0) {
        date.setMonth(date.getMonth() - 1)
        setExpirationDate(date.toDateString())
      }
    }
    if (action === "plus") {
      date.setMonth(date.getMonth() + 1)
      setExpirationDate(date.toDateString())
    }
  }

  function onDecrementClick(event) {
    if (numMonths > 1) {
      setNumMonths(numMonths - 1)
      setCost(cost - 5)
      dateChanege("minus")
    }
  }

  function onIncrementClick(event) {
    if (numMonths < 12) {
      setNumMonths(numMonths + 1)
      setCost(cost + 5)
      dateChanege("plus")
    }
  }
  
  useEffect(() => {
    setLiveExpirationDate(requestCardData.expirationDate)
  }, [])
  
  useEffect(() => {

    let today = new Date()
    let currentExpirationDate = new Date(liveExpirationDate)
    let date = (today > currentExpirationDate) ? today : currentExpirationDate
    date.setMonth(date.getMonth() + 1)
    setExpirationDate(date.toDateString())
  }, [liveExpirationDate])
  
  useEffect(() => {
    setLiveExpirationDate(requestCardData.expirationDate)
    let newExpirationDate = new Date(expirationDate)
    setExpirationDate(newExpirationDate.toDateString())
  }, [requestCardData.expirationDate, expirationDate])
  
  
  return (
    <>
      <div className='score-card stripe-card'>
        <div className="section-1">
          <div className="score-area num-months">
              <p className="score-area__text">Keep live for</p>
              <p className="score-area__score">{numMonths}</p>
              <p className="score-area__text">extra month</p>
          </div>
          <div className="month-calc-area">
            <div className="month-calc minus" onClick={onDecrementClick}>
              <img className="month-calc-icon" src={minusIcon} alt="Add one month" />
            </div>
            <div className="month-calc plus" onClick={onIncrementClick}>
              <img className="month-calc-icon" src={plusIcon} alt="Take away one month" />
            </div>
          </div>
        </div>

        <div className="section-middle">
          <p className="is-centered expiration-preview">This would stay live until<br />{ expirationDate || ""}</p>
          <p className="is-centered">Keep this request live long term without having to complete a new task every 9 days. It costs $5 to keep a request live for 30 extra days.</p>
        </div>

        <div className="section-3">
            <div className="cost">
              <p className="dollar-sign">$</p>
              <p className="score-area__score">{cost}</p>
              </div>
            <div className="checkout">
              <div className="request-card__action-area top-col-1" onClick={onCheckoutClick}>
                  <img className="icon" src={checkoutIcon} alt="Extend request's expiration date icon" />
                  <div className="action-area__text">Buy expiration date</div>
              </div>
            </div>
        </div>
      </div>
      <div className="info-box">
        <p>Note: You can edit your request at any time. So, if you wanted to, you could completely change your request as many times as you’d want during its public lifespan.</p>
      </div>
      
  </>
  );
}