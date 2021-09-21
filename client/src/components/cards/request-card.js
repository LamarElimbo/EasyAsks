import { useUser } from "../../context";
import CardAction from "./card-actions";
import CardMeta from "./card-meta";
import CardContent from "./card-content";

export default function RequestCard({requestCardData}) {
    
    const user = useUser();
    
    const usersFulfilledRequests = user.requestsFulfilled ? user.requestsFulfilled : []
    const usersPostedRequests = user.requestsPosted ? user.requestsPosted : []
    let action = ""
    if (usersPostedRequests.includes(requestCardData._id)) {
        action = "edit"
    } else {
        if (usersFulfilledRequests.includes(requestCardData._id)) {
            action = "complete"
        } else {
            action = (requestCardData.requiresValidation) ? "validate" : "checkbox"
        }
    }
    let pressed = (action === "edit" || action === "complete") ? "pressed" : ""

    return (
        <div className={`request-card ${pressed}`}>
            <div className="top-row">
                <div className="top-col-1">
                    <CardAction action={action} requestCardData={requestCardData} />
                </div>
                <div className="top-col-2">
                    <CardContent cardType="request" requestCardData={requestCardData} />
                </div>
            </div>
            <CardMeta requestCardData={requestCardData} />
        </div>
    )
}