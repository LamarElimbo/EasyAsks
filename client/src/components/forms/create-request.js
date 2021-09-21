import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router";
import { useUser, useUserUpdate } from "../../context";
import { About } from "../header";

export default function CreateRequest() {

  const [description, setDescription] = useState('')
  const [requiresValidation, setRequiresValidation] = useState(false)
  const [optionalLink, setOptionalLink] = useState('')
  const user = useUser();
  const setUser = useUserUpdate();
  const history = useHistory();

  function onChangeRequest(e) { setDescription(e.target.value) }
  function onChangeRequiresValidation(e) { setRequiresValidation(!requiresValidation) }
  function onChangeOptionalLink(e) { setOptionalLink(e.target.value) }
  
  function onSubmit(e) {
      e.preventDefault();

      const newRequest = {
        description: description,
        requiresValidation: requiresValidation,
        link: optionalLink,
        postedBy: user._id
      };

      axios
        .post('/requests/add', newRequest)
        .then(res => setUser( "requestsPosted", res.data._id ));
      
      history.push("/")
  }

  if (user.availablePoints < 3) {
    return (
      <>
        <h2>Create New Request</h2>
        <About onPage="home" />
      </>
    )
  }

  return (
    <>
      <h2>Create New Request</h2>
      <form className="form" onSubmit={onSubmit}>
        <div className="input-field__area">
          <label className="label">What’s your request</label>
          <textarea placeholder="Input your request" 
                    maxLength="500" 
                    id="field" 
                    name="field" 
                    className="textarea" 
                    value={description}
                    onChange={onChangeRequest}></textarea>
          <p className="word-limit">{description?.length || 0}/500</p>
        </div>

        <div className="input-field__area">
          <label className="label">Leave an optional link</label>
          <input className="input-field" 
                  maxLength="256" 
                  name="name" 
                  data-name="Name" 
                  placeholder="Input a website url" 
                  type="text" 
                  id="name"
                  value={optionalLink}
                  onChange={onChangeOptionalLink} />
        </div>

        <div className="input-field__area">
          <label className="checkbox-field">
            <input type="checkbox" 
                  id="checkbox" 
                  name="checkbox" 
                  data-name="Checkbox" 
                  className="w-checkbox-input checkbox" 
                  checked={requiresValidation}
                  onChange={onChangeRequiresValidation} />
            <span className="label is-left-aligned w-form-label">Do you want to see proof that your request was fullfilled? If yes, make sure you mention what you would like the image to be.</span>
          </label>
          <input type="submit" data-wait="Please wait..." className="button" value="Create New Request" />
        </div>
      </form>
    </>
  )
}