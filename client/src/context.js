import React, {createContext, useContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

// User context storage
const UserContext = createContext();
const UserUpdateContext = createContext();

// User state and setState retieval functions
export function useUser() { 
    return useContext(UserContext) 
}

export function useUserUpdate() { 
    return useContext(UserUpdateContext) 
}

// Function for populating user state and setState
export function UserProvider({children}) {
    const [user, setUser] = useState({});

    // Everytime the homepage is called check whether there is a user that has previously logged in
    useEffect(() => {
        if (localStorage.jwtToken) { 
            updateUser('getUser', localStorage.jwtToken)
        };
    },[])

    // Function for setting the user's global state context
    function updateUser(field , data){

        // Collect user info from database and set user state
        if (field === "getUser") {
            //data = localStorage jwtToken
            const user = jwt_decode(data)
            axios
                .get(`/user/${user.id}`)
                .then(res => { setUser(res.data); })
                .catch(err => { return err });
        }

        // Login an existing user
        if (field === "login") {
            //data = { email: email, password: password }
            axios
                .post("/user/login", data)
                .then(res => {
                    // Set token to localStorage
                    const { token } = res.data;
                    localStorage.setItem("jwtToken", token);
                    // Set current user with decoded token
                    updateUser("getUser", token);
                })
                .catch(err => { return err });
        }

        // Mark a request as complete
        if (field === "requestsFulfilled") {
            //data = requestId
            const requestsFulfilledUpdated = [...user.requestsFulfilled, data]

            setUser( prevState => {
                let u = {...prevState}
                u.requestsFulfilled = requestsFulfilledUpdated
                u.availablePoints = user.availablePoints + 1
                return u
            });

            axios
                .put('/user/add-fulfilled-request', { userId: user._id, requestsId: data })
                .catch(err => { return err });
        }

        // Create a new request
        if (field === "requestsPosted") {
            //data = requestId
            const requestsPostedUpdated = [...user.requestsPosted, data]
        
            setUser( prevState => {
                let u = {...prevState}
                u.requestsPosted = requestsPostedUpdated
                u.availablePoints = user.availablePoints - 3
                return u
            });

            axios
                .put('/user/add-posted-request', { userId: user._id, requestId: data })
                .then(res => console.log(res.data));
        }

        // Decrement available points
        if (field === "decrementPoints") {
        
            setUser( prevState => {
                let u = {...prevState}
                u.availablePoints = user.availablePoints - 1
                return u
            });
        }
    }
    
    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                { children }
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}