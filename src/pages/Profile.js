import React from "react";
// import './App.css';
import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { useNavigate ,useParams} from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { AuthState,setAuthState } = useContext(AuthContext);
  const userName = useParams().username;
  // console.log(userName);
  

  const [listofpost, setListofposts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://posts-app-backend-sidd.vercel.app/${userName}`).then((response) => {
      // console.log(response);
      if(response.data.length===0)
      {
        navigate('*');
      }
      else
      {
        setListofposts(response.data);

      }
    //   console.log(response.data);
    });
  }, [userName]);
  const likePost = (post_id) => {
    axios
      .post(
        "https://posts-app-backend-sidd.vercel.app/like",
        { Post_ID: post_id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        // console.log(response);
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        if (response.data.liked === true) {
          alert("You liked a post!");

          setListofposts(
            listofpost.map((post) => {
              if (post.id === post_id) {
                return { ...post, likes_count: post.likes_count + 1 };
              } else {
                return post;
              }
            })
          );
        } else {
          alert("You disliked a post!");

          setListofposts(
            listofpost.map((post) => {
              if (post.id === post_id) {
                return { ...post, likes_count: post.likes_count - 1 };
              } else {
                return post;
              }
            })
          );
        }
      });
  };

  const updateUser=()=>{
    let newUsername=prompt("Enter new Username: ");
    axios
      .put(
        "https://posts-app-backend-sidd.vercel.app/users/changeUsername",
        {
          newUsername:newUsername
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
            
        }
        else
        {
            alert(response.data.message);
            localStorage.removeItem("accessToken");
            setAuthState({username:"",id:0,status:false});
            navigate("/login");
        }
      })
  };
  return (
    <>
    
    {AuthState.username===userName && <button id="change-password-btn" onClick={() => navigate(`/changePassword`)} >change password</button>}
    {AuthState.username===userName && <button id="change-username-btn" onClick={updateUser}>change username</button>}

      {listofpost.map((post) => (
        <>
          <div className="post">
            <div className="title" onClick={() => navigate(`/post/${post.id}`)}>
              {post.title}
            </div>
            <div className="body" onClick={() => navigate(`/post/${post.id}`)}>
              {post.postText}
            </div>
            <div className="footer">
              <div className="username">{post.username}</div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likePost(post.id);
                  }}
                  className="unlikeBttn"
                />
                {/* <ThumbUpAltIcon onClick={()=>{likePost(post.id)}} className="unlikeBttn"/> */}
              </div>
              <label>{post.likes_count}</label>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default Profile;
