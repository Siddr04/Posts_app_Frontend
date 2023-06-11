import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setAuthState}=useContext(AuthContext);

  const login = () => {
    axios
      .post("https://posts-app-backend-sidd.vercel.app/users/login", {
        Username: username,
        Password: password,
      })
      .then((response) => {
        if (response.data.error) {
          // setError(response.data.error);
          alert(response.data.error);
        } else 
        {
          localStorage.setItem("accessToken", response.data.token);
          console.log("here_login");

          setAuthState({username:response.data.username,id:response.data.id,status:true});
          navigate("/");
        }
      })
      
  };

  return (
    <div className="loginContainer">
      {/* {error && <h3>{error}</h3>} */}
      <label>Username:</label>
      <input
        type="text"
        value={username}
        placeholder="Your username.."
        onChange={(event) => setUsername(event.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        placeholder="Your password.."
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
