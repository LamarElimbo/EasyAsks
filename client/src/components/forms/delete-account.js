import axios from "axios";
import { useUser } from "../../context";
import { useHistory } from "react-router";

export default function DeleteUser() {

    const user = useUser();
    const history = useHistory();

    const onClick = (e) => {
        e.preventDefault();

        axios.delete('/user/delete-account', { data: { userId: user._id } })

        localStorage.clear()
        history.push("/")
        window.location.reload()
        return false;
    }
    
    return (
        <>
            <p className="text">Are you sure you want to delete account?</p>
            <button className="button is-red" onClick={onClick}>
                <div className="button__text">Delete your account</div>
            </button>
        </>
    );
}