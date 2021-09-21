import React, { useState, useEffect } from 'react';
import { useUser } from "../../context";

export default function CardContent({cardType, action, requestCardData}) {        
    const [expirationDate, setExpirationDate] = useState()
    const user = useUser();

    useEffect(() => {
        const _expirationDate = new Date(requestCardData?.expirationDate)
        setExpirationDate(_expirationDate.toDateString())
      })
        
    if (cardType === "request") {
        const link = requestCardData.link
        const firstPeriod = link.indexOf(".")
        const nearestSlash = link.indexOf("/", firstPeriod)
        const shortenedLink = link.slice(0, nearestSlash)

        return (
            <>
                <p>{requestCardData.description}</p>
                <a href={requestCardData.link} target="_blank" rel="noreferrer" className="link">{shortenedLink}</a>
            </>
        )
    }

    if (cardType === "score") {
        switch (action) {
            case 'create':
                if (user.availablePoints >= 3) {
                    return <p className="score-info section-middle">A request costs 3 points, so you've earned enough points to add your own request.</p>
                } else {
                    return <p className="score-info section-middle">{`You'll need to fullfill ${3 - user.availablePoints} more requests before you can create one of your own.`}</p>
                }
            case 'expire':
                const _expirationDate = new Date(expirationDate);
                let today = new Date()
                let expireVerb =  (_expirationDate < today) ? "expired" : "will expire"
                let expirationText = `This ${expireVerb} on ${_expirationDate.toDateString()}`
                if (_expirationDate.toDateString() === today.toDateString()) {
                    expirationText = `This ${expireVerb} today`
                }

                if (user.availablePoints > 0) {
                    return <p className="score-info section-middle">{`${expirationText}. You can trade in one point for three extra days.`}</p>
                } else {
                    return <p className="score-info section-middle">{`${expirationText}. You'll need to fullfill at least one request to extend this request by 3 days.`}</p>
                }
            default:
                return null
        }
    }
}