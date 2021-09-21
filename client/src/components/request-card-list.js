import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestCard from './cards/request-card';
import { useUser } from "../context";

export default function RequestCardList( {requestFilter} ) {

    const [requests, setRequests] = useState([])
    const user = useUser();

    useEffect(() => {
        const getRequests = async () => {
            try {
                const response = await axios.get('/requests/')
                setRequests( response.data );
            } catch (e) {
                console.log(e)
            }
        }
        getRequests()
    }, [])

    switch (requestFilter) {
        case "full":
            let today = new Date()
            return (
                <>
                    { requests.map((currentrequest) => {
                        let expirationDate = new Date(currentrequest.expirationDate)
                        let notExpired = (today < expirationDate) ? true : false
                        if (notExpired) {
                            return <RequestCard requestCardData={currentrequest} key={currentrequest._id} />
                        } else {
                            return null
                        }
                    }) }
                </>
            )
        case "posted":
            if (user.requestsPosted.length > 0) {
                return (
                    <>
                        <h2>Posted</h2>
                        { requests.map((currentrequest) => {
                            if (user.requestsPosted.includes(currentrequest._id)) {
                                return <RequestCard requestCardData={currentrequest} key={currentrequest._id} />
                            }
                            return null
                        }) }
                    </>
                )
            } else {
                return (
                    <>
                        <h2>Posted</h2>
                        <div className="empty-list-containter">
                            <p className="empty-list-text">You have not posted any requests yet.</p>
                        </div>
                    </>
                )
            }
        case "fulfilled":
            if (user.requestsFulfilled.length > 0) {
                return (
                    <>
                        <h2>Fulfilled</h2>
                        { requests.map((currentrequest) => {
                            if (user.requestsFulfilled.includes(currentrequest._id)) {
                                return <RequestCard requestCardData={currentrequest} key={currentrequest._id} />
                            }
                            return null
                        }) }
                    </>
                )
            } else {
                return (
                    <>
                        <h2>Fulfilled</h2>
                        <div className="empty-list-containter">
                            <p className="empty-list-text">You have not fulfilled any requests yet.</p>
                        </div>
                    </>
                )
            }
        default:
            return null
    }
}