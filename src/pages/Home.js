import React from "react";
// import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
const Home = () => {
  const [listofpost, setListofposts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3024/").then((response) => {
      // console.log(response);
      setListofposts(response.data);
      // console.log(response.data);
    });
  }, []);
  const likePost=(post_id)=>{
    axios.post("http://localhost:3024/like",{Post_ID:post_id},{headers:{
      accessToken:localStorage.getItem("accessToken")
    }}).then((response)=>{
      // console.log(response);
      if(response.data.error)
      {
        alert(response.data.error);
        return;
      }
      if(response.data.liked===true)
      {
        alert("You liked a post!");
        
        setListofposts(listofpost.map((post)=>{
          if(post.id===post_id)
          {
            return{...post,likes_count:post.likes_count+1};
          }
          else
          {
            return post;
          }
        }))
      }
      else
      {
        alert("You disliked a post!");
        
        setListofposts(listofpost.map((post)=>{
          if(post.id===post_id)
          {
            return{...post,likes_count:post.likes_count-1};
          }
          else
          {
            return post;
          }
        }))
      }
      
    })
  }
  return (
    <>
      {listofpost.map((post) => (
        <>
          <div className="post" >
            <div className="title" onClick={() => navigate(`/post/${post.id}`)}>{post.title}</div>
            <div className="body" onClick={() => navigate(`/post/${post.id}`)}>{post.postText}</div>
            <div className="footer">
              <div className="username" onClick={() => navigate(`/${post.username}`)}>{post.username}</div>
              <div className="buttons">
                <ThumbUpAltIcon onClick={()=>{likePost(post.id)}} className="unlikeBttn"/>
              </div>
              <label>{post.likes_count}</label>
              </div>
          </div>
        </>
      ))}
    </>
  );
};

export default Home;



