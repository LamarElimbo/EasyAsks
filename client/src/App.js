import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import { UserProvider } from "./context";
import { Title, Header, About } from "./components/header";
import RequestCardList from "./components/request-card-list";
import EditRequest from "./components/forms/edit-request";
import CreateRequest from "./components/forms/create-request";
import CreateUser from "./components/forms/create-account";
import LoginUser from "./components/forms/login";
import DeleteUser from "./components/forms/delete-account";

export default function App() {
  
  return (
    <UserProvider>
      <Router>
        <div className="page-container">

          <Title onPage="home" />
          
          <Route path="/" exact>
            <Header onPage="home" />
            <About onPage="home" />
            <RequestCardList requestFilter="full" />
          </Route>
          
          <Route path="/create-account" exact>
            <Header onPage="create account" />
            <CreateUser />
          </Route>
          
          <Route path="/login" exact>
            <Header onPage="login" />
            <LoginUser />
          </Route>
          
          <Route path="/your-account" exact>
            <Header onPage="profile" />
            <About onPage="profile" />
            <RequestCardList requestFilter="posted" />
            <RequestCardList requestFilter="fulfilled" />
          </Route>
          
          <Route path="/delete-account" exact>
            <Header onPage="delete account" />
            <DeleteUser />
          </Route>
          
          <Route path="/new-request" exact>
            <Header onPage="create request" />
            <CreateRequest />
          </Route>
          
          <Route path="/edit-request/:requestId">
            <Header onPage="edit request" />
            <EditRequest />
          </Route>

          <div className="height50">.</div>
          <a href="https://www.lamarelimbo.com/" target="_blank" rel="noreferrer" className="made-by">Made by Lamar Elimbo</a>
        </div>
      </Router>
    </UserProvider>
 );
}