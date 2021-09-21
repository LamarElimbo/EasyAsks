import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useUser } from "../context";
import ScoreCard from "./cards/score-card"

function Button( {onPage} ) {
    const user = useUser();
    const history = useHistory();
    
    function onLogout() {
        localStorage.clear()
        history.push("/")
        window.location.reload()
        return false;
    }

    switch ( onPage ) {
        default:
            if (Object.keys(user).length > 0) {
                return (
                    <Link to="/your-account" style={{textDecoration: "none", color: "white"}}>
                        <div className="header-button">Your profile</div>
                    </Link>
                )
            } else {
                return (
                    <>
                        <Link to="/create-account" style={{textDecoration: "none", color: "white"}}>
                            <div className="header-button">Create Account</div>
                        </Link>
                        <Link to="/login" style={{textDecoration: "none", color: "white"}}>
                            <div className="header-button">Login</div>
                        </Link>
                    </>
                )
            }
        
        case "profile":

        // Refresh expiration button
        // <button className="header-button" onClick={onRefreshExpiration}>Refresh Expiration</button>
            return (
                <>
                    <button className="header-button" onClick={onLogout}>Logout</button>
                    <Link to="/delete-account" style={{textDecoration: "none"}}>
                        <div className="header-button delete-account">Delete your Account</div>
                    </Link>
                </>
            )
        case "create account":
            return (
                <Link to="/login" style={{textDecoration: "none", color: "white"}}>
                    <div className="header-button">Login</div>
                </Link>
            )
        case "login":
            return (
                <Link to="/create-account" style={{textDecoration: "none", color: "white"}}>
                    <div className="header-button">Create Account</div>
                </Link>
            )
    }
}

export function Title() {
    return (
        <>
            <Link to="/" style={{textDecoration: "none"}}>
                <h1 className="title">Easy Asks</h1>
            </Link>
        </>
    )
}

function Tagline({onPage}) {
    switch(onPage) {
        case "home":
            return <p className="tagline is-centered">What’s a simple online task that<br />someone can do to improve your day?</p>
        case "login":
            return <p className="tagline is-centered">Welcome back!</p>
        case "create account":
            return <p className="tagline is-centered">Great to have you here!</p>
        case "profile":
            return <p className="tagline is-centered">Here you'll find a summary of your interactions</p>
        case "create request":
            return <p className="tagline is-centered">Thanks for being such a good samaritan!</p>
        case "edit request":
            return <p className="tagline is-centered">Feel free to edit the content of your request and extend its expiration date.</p>
        case "delete account":
            return <p className="tagline is-centered">Feel free to come back anytime</p>
        default:
            return null
    }
}

export function About({onPage}) {

    const user = useUser();

    switch (onPage) {
        default:
            return null
        case "home":
        case "profile":
            if (Object.keys(user).length === 0) {
                return (
                    <div className="info-box about-section">
                        <h2>How This Works</h2>
                        <p className="about-text is-centered">Complete 1 request to earn 1 point</p>
                        <p className="about-text is-centered">Earn 3 points to create your own request</p>
                        <p className="about-text is-centered">Requests remain public for 9 days</p>
                    </div>
                )
            } else {
                return <ScoreCard action="create" />
            }
        }
    }

export function Header( {onPage} ) {
    return (
        <>
            <Tagline onPage={onPage} />
            <div className="header-buttons">
                <Button onPage={onPage} />
            </div>
        </>
    )
}