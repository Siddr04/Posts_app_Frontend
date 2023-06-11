// import logo from './logo.svg';
import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes, Link ,useNavigate} from "react-router-dom";
import { useState,useEffect } from "react";
import PageNotFound from "./pages/PageNotFound";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ChagePassword from "./pages/ChagePassword";
import {AuthContext} from "./helpers/AuthContext";
import axios from "axios";


function App() {
  const [loading, setLoading] = useState(true);
  const [AuthState, setAuthState] = useState({username:"",id:0,status:false});
  // const [userName, setuserName] = useState("");
  // const navigate=useNavigate();

  useEffect(() => {
    axios
      .get("https://posts-app-backend-sidd.vercel.app/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          
          setAuthState({ username: "", id: 0, status: false });
        } else {
          console.log("here");
          console.log(response.data);

          setAuthState({ username: response.data.Username, id: response.data.id, status: true });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  
  console.log(AuthState.status);
  const logout=(()=>{
    localStorage.removeItem("accessToken");
    setAuthState({username:"",id:0,status:false});

  })
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <AuthContext.Provider value={{ AuthState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/">Home</Link>
            <Link to="/createPost">New Post</Link>
            {!(AuthState.status) && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">SignUp</Link>
              </>
            )}
              {/* {AuthState.status===false && <div id='no-login-id'>Welcome</div>} */}

            {AuthState.status && (
              <>

                {AuthState.status && <div id='user-id'>Welcome, {AuthState.username}</div>}
                
                <Link id="nav-btn" onClick={logout} to="/">Logout</Link>
                <Link id="profile-btn" to={`/${AuthState.username}` }>Profile</Link>


              </>
            )}
          </div>
          {AuthState.status===false && <div id='no-login-id'>Welcome</div>}

          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/createPost" element={<CreatePost />} exact />
            <Route path="/login" element={<Login />} exact />
            <Route path="/signup" element={<SignUp />} exact />
            <Route path="/post/:id" element={<Post />} exact />
            <Route path="/changePassword" element={<ChagePassword />} exact />
            <Route path="*" element={<PageNotFound />} />

            <Route path="/:username" element={<Profile />} exact />

          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

