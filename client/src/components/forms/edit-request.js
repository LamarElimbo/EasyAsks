import React, { useState, useEffect } from 'react';
import { useUser } from "../../context";
import axios from 'axios';
import { useHistory, useParams, useLocation } from "react-router";
import ScoreCard from "./../cards/score-card";
import StripeCheckout from "../stripe-checkout";


function Gallery({requestData}) {
  if (requestData.requiresValidation) {
    return (
      <>
        {requestData.fulfillment.map((currentFulfillment) => {
          return(
            <div className="gallery" key={currentFulfillment.image}>
              <a target="_blank" href={currentFulfillment.image} rel="noreferrer">
                <img src={currentFulfillment.image} alt="Request validation" width="600" height="400" />
              </a>
            </div>
          )
        })}
      </>
    )
  } else {
    return null
  }
}

export default function EditRequest() {
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState({})
  const [_description, setDescription] = useState("")
  const [_requiresValidation, setRequiresValidation] = useState(false)
  const [_link, setLink] = useState("")
  const [message, setMessage] = useState("");
  
  const location = useLocation();
  const history = useHistory();
  const user = useUser();

  useEffect(() => {
    try {
      setRequestData(location.state.requestCardData)
    }
    catch {
      const getRequest = async () => {
        try {
            const response = await axios.get(`/requests/${requestId}`)
            setRequestData(response.data)

            // Check to see if this is a redirect back from Checkout
            const query = new URLSearchParams(window.location.search);
            if (query.get("extension-success") && !(response.data.stripeSessionIds.includes(query.get("session_id")))) {
              const addMonths = parseInt(query.get("extension-success"))
              let today = new Date()
              let expirationDate = new Date(response.data.expirationDate)
              let date = (today > expirationDate) ? today : expirationDate
              date.setMonth(date.getMonth() + addMonths)
              
              const dataToSend = {"newDate": date, "userId": user._id, "dec": 0, "session_id": query.get("session_id")}
              axios.put(`/requests/extend-expiration/${requestId}`, dataToSend)
                .then(res => console.log(res.data));

              setRequestData( prevState => {
                let req = {...prevState}
                req.expirationDate = date.toDateString()
                return req
              });

              setMessage(`Extension success! This request will now remain live until ${date.toDateString()}.`);
            }
        } catch (e) {
            console.log(e)
        }
      }
      getRequest()  
    }
  }, [])

  useEffect(() => { 

    const { description, requiresValidation, link } = requestData

    setDescription(description)
    setRequiresValidation(requiresValidation)
    setLink(link)
  }, [requestData] )

  function onChangeDescription(e) { 
    setDescription(e.target.value) 
  }

  function onChangeRequiresValidation() { 
    setRequiresValidation(!_requiresValidation) 
  }

  function onChangeLink(e) { 
    setLink(e.target.value) 
  }

  function onSubmit(e) {
    e.preventDefault();
  
    const updatedRequest = {
        description: _description,
        requiresValidation: _requiresValidation,
        link: _link
      };

    axios.put(`/requests/update/${requestId}`, updatedRequest)
      .then(res => console.log(res.data));
    
    history.push("/")
  }

  function onDeleteRequest(e) {
    axios.delete(`/requests/${requestId}`)
      .then(res => console.log(res.data));
    
      history.push("/")
  }

  //const requestFulfillment = (requestData?.fulfillment.length === 1) ? '1 person has' : `${requestData.fulfillment.length} people have`
  const requestFulfillment = (function () {
    try{
      return (requestData?.fulfillment.length === 1) ? '1 person has' : `${requestData.fulfillment.length} people have`
    }
    catch {
      return null
    }
  })()


  return (
    <>
      <h2>Your Request</h2>
      <form className="form" onSubmit={onSubmit}>

      {(message.length > 1) ? (
        <section className="info-box">
          <p>{message}</p>
        </section>
      ) : (
        <div></div>
      )}
      
        
        <label className="label">This request's fulfillment</label>
        <p>{`${requestFulfillment} completed this request.`}</p>
        <Gallery requestData={requestData} />
        <div className="height50"></div>

        <label className="label">Extend Expiration Date</label>
        <ScoreCard action="expire" requestCardData={requestData} />
        <StripeCheckout requestCardData={requestData} />
        
        <div className="input-field__area">
          <label className="label">Update your request</label>
          <textarea placeholder="Change your request" 
                    maxLength="500" 
                    className="textarea w-input" 
                    value={_description || ""}
                    onChange={onChangeDescription}>{_description}</textarea>
          <p className="word-limit">{_description?.length || 0}/500</p>
        </div>

        <div className="input-field__area">
          <label className="label">Update your link</label>
          <input className="input-field w-input" 
                  maxLength="256"
                  placeholder="Change your website url" 
                  type="text" 
                  value={_link || ""}
                  onChange={onChangeLink} />
        </div>

        <div className="input-field__area">
          <label className="w-checkbox checkbox-field">
            <input type="checkbox" 
                  id="checkbox" 
                  name="checkbox" 
                  data-name="Checkbox" 
                  className="w-checkbox-input checkbox" 
                  checked={_requiresValidation || false}
                  onChange={onChangeRequiresValidation} />
            <span className="label is-left-aligned">Do you want to see proof that your request was fullfilled?</span>
          </label>
          <input type="submit" data-wait="Please wait..." className="button" value="Update this Request" />
        </div>
      </form>

      <button className="button is-red" onClick={onDeleteRequest}>
        <div style={{textDecoration: "none", color: "white"}}>
          <div className="button__text">Delete this request</div>
        </div>
      </button>
    </>
  )
}