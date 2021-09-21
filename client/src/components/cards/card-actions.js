import axios from "axios";
import { Link } from 'react-router-dom';
import { useUser, useUserUpdate } from "../../context";
import editIcon from "../../assets/edit_icon.png"
import uploadIcon from "../../assets/upload_icon.png"
import timeIcon from "../../assets/time_icon.png"
import timeInactiveIcon from "../../assets/time_inactive_icon.png"
import createIcon from "../../assets/create_icon.png"
import createIconInactive from "../../assets/create_inactive_icon.png"


function UploadImage ( { requestId } ) {
    const user = useUser();
    const setUser = useUserUpdate();

    const handleImageUpload = (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('upload_preset', 'cekyihaj');
        const options = {
            method: 'POST',
            body: formData,
        };

        return fetch('https://api.Cloudinary.com/v1_1/dqjkxq18e/image/upload', options)
            .then(res => res.json())
            .then(res => {
                const fulfillmentUpdated = { fulfilledBy: user.id, image: res.secure_url }
                setUser( "requestsFulfilled", requestId );
                axios
                    .put(`/requests/update-fulfilled/${requestId}`, {fulfillmentUpdated: fulfillmentUpdated})
                    .catch(err => { return err });
            })
            .catch(err => console.log(err));
        }
      
    return (
        <form>
            <label htmlFor={requestId} className="request-card__action-area">
                <img className="icon" src={uploadIcon} alt="Upload icon" />
                <div className="action-area__text">Upload<br/>image</div>
            </label>
            <input id={requestId} type="file" onChange={handleImageUpload}/>
        </form>
    );
};

export default function CardAction({ action, requestCardData, onChange }) {
    const user = useUser();
    const setUser = useUserUpdate();

    function handleRequestCompletion() {
        setUser( "requestsFulfilled", requestCardData._id );
        const fulfillmentUpdated = { fulfilledBy: user.id }
        axios
            .put(`/requests/update-fulfilled/${requestCardData._id}`, {fulfillmentUpdated: fulfillmentUpdated})
            .catch(err => { return err });
    }

    function extendExpirationDate() { 
        let today = new Date()
        let expirationDate = new Date(requestCardData.expirationDate)
        let date = (today > expirationDate) ? today : expirationDate
        date.setDate(date.getDate() + 3)
        setUser("decrementPoints", 0)
    
        onChange({"_id": requestCardData._id, 'expirationDate': date})

        axios.put(`/requests/extend-expiration/${requestCardData._id}`, {"newDate": date, "userId": user._id, "dec": 1})
          .then(res => console.log(res.data));
      }

    if (Object.keys(user).length > 0) {
        switch(action) {
            case 'edit':
                return (
                    <Link to={{
                        pathname: `/edit-request/${requestCardData._id}`,
                        state: {requestCardData: requestCardData}
                    }}  className="without-underline request-card__action-area">
                        <img className="icon" src={editIcon} alt="Create request icon" />
                        <div className="action-area__text">Edit<br/>request</div>
                    </Link>
                )
            case 'complete':
                return (
                    <div className="request-card__action-area">
                        <input type="checkbox" 
                        className="w-checkbox-input checkbox" 
                        checked
                        readOnly />
                        <div className="action-area__text">Completed</div>
                    </div>
                )
            case 'validate':
                return (
                    <UploadImage requestId={requestCardData._id}/>
                )
            case 'checkbox':
                return (
                    <div className="request-card__action-area">
                        <input type="checkbox" 
                        className="w-checkbox-input checkbox"
                        checked={false}
                        onChange={handleRequestCompletion} />
                        <div className="action-area__text">Mark<br/>complete</div>
                    </div>
                )
            case 'create':
                return (
                    <Link to="/new-request" className="without-underline request-card__action-area top-col-1 new-request">
                        <img className="icon" src={createIcon} alt="Create request icon" />
                        <div className="action-area__text">Create<br/>request</div>
                    </Link>
                )
            case 'expire':
                if (user.availablePoints > 0) {
                    return (
                        <div className="request-card__action-area top-col-1 new-request" onClick={extendExpirationDate}>
                            <img className="icon" src={timeIcon} alt="Extend request's expiration date icon" />
                            <div className="action-area__text">Budge<br/>expiration date</div>
                        </div>
                    )
                } else {
                    return (
                        <div className="request-card__action-area is-inactive">
                            <img className="icon" src={timeInactiveIcon} alt="Extend request's expiration date icon" />
                            <div className="action-area__text-inactive">Extend<br/>expiration date</div>
                        </div>
                    )
                }
            default:
                return null
        }
    } else {
        switch(action) {
            case 'checkbox':
                return (
                    <Link to="/create-account" style={{textDecoration: "none", color: "white"}} className="request-card__action-area">
                        <input type="checkbox" 
                        className="w-checkbox-input checkbox"
                        checked={false}
                        readOnly />
                        <div className="action-area__text">Mark<br/>complete</div>
                    </Link>
                )
            case 'validate':
                return (
                    <Link to="/create-account" style={{textDecoration: "none", color: "white"}} className="request-card__action-area">
                        <img className="icon" src={uploadIcon} alt="Upload icon" />
                        <div className="action-area__text">Upload<br/>image</div>
                    </Link>
                )
            case 'create':
                return (
                    <div className="request-card__action-area is-inactive top-col-1">
                        <img className="icon" src={createIconInactive} alt="Create request icon" />
                    <div className="action-area__text-inactive">Create<br/>request</div>
                </div>
                )
            default:
                return null
        }
    }
}