import React, {useState, useEffect} from "react";
import CardAction from "./card-actions";
import CardContent from "./card-content";
import { useUser } from "../../context";

function Score() {
    const user = useUser();
    const scorePlurality = (user.availablePoints === 1) ? 'point' : 'points'
    return (
        <div className="score-area">
            <p className="score-area__text">You have</p>
            <p className="score-area__score">{user.availablePoints}</p>
            <p className="score-area__text">{scorePlurality}</p>
        </div>
    )
}

export default function ScoreCard({action, requestCardData}) {
    //action = "expire || create"
    
    const [requestData, setRequestData] = useState(requestCardData);

    useEffect(() => {     
        setRequestData(requestCardData)
      }, [requestCardData] )

    function handleExpirationUpdate(updatedRequestCardData) {
        setRequestData(updatedRequestCardData)
    }

    return (
        <div className='score-card'>
            <Score />
            <CardContent cardType="score" action={action} requestCardData={requestData} />
            <CardAction action={action} requestCardData={requestCardData} onChange={handleExpirationUpdate} />
        </div>
    )
}