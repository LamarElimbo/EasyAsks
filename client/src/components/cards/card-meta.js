export default function CardMeta({requestCardData}) {
    let fulfillmentLengthText = (requestCardData.fulfillment.length === 1) ? 
        `This request has been fulfilled 1 time.` :
        `This request has been fulfilled ${requestCardData.fulfillment.length} times.`
        
        
    const expirationDate = new Date(requestCardData.expirationDate);
    let today = new Date()
    let expireVerb =  (expirationDate < today) ? "expired" : "will expire"
    let expirationText = `This ${expireVerb} on ${expirationDate.toDateString()}`
    if (expirationDate.toDateString() === today.toDateString()) {
        expirationText = `This ${expireVerb} today`
    }

    return (
        <div className="bottom-row">
            <p className="request-card-info">{fulfillmentLengthText}</p>
            <p className="request-card-info">{(requestCardData.requiresValidation) ? "This request requires that you upload an image as validation" : ""}</p>
            <p className="request-card-info">{expirationText}</p>
        </div>
    )
}