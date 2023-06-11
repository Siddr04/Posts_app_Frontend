import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const ChagePassword = () => {
    const [oldpassWord, setoldpassWord] = useState("");
    const [newpassWord, setnewpassWord] = useState("");
    const navigate=useNavigate();
    const passChange=()=>{
        axios
      .put(
        "http://localhost:3024/users/changePassword",
        {
          oldpassWord: oldpassWord,
          newpassWord: newpassWord,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      ).then((response)=>{
        if(response.data.error)
        {
            alert(response.data.error);
            setoldpassWord("");
            setnewpassWord("");
        }
        else
        {
            alert(response.data.message);
            navigate("/");
        }
      })
    }

    return (
        <div className="loginContainer">
          {/* {error && <h3>{error}</h3>} */}
          <label>Old Password:</label>
          <input
            type="password"
            value={oldpassWord}
            placeholder="Your username.."
            onChange={(event) => setoldpassWord(event.target.value)}
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newpassWord}
            placeholder="Your password.."
            onChange={(event) => setnewpassWord(event.target.value)}
          />
          <button onClick={passChange}>Change</button>
        </div>
      );
}

export default ChagePassword