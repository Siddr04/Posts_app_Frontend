import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const Post = () => {
  const navigate = useNavigate();

  const id = useParams();
  const [postValue, setPostValue] = useState([]);
  const [commentList, setcommentList] = useState([]);
  const [newComment, setnewComment] = useState("");
  const { AuthState } = useContext(AuthContext);

  // const [username, setUsername] = useState("");
  useEffect(() => {
    axios.post("https://posts-app-backend-sidd.vercel.app/post", id).then((response) => {
      setPostValue(response.data);
    });
    axios.post("https://posts-app-backend-sidd.vercel.app/comments", id).then((response) => {
      setcommentList(response.data);
      // console.log("Comment Added !")
    });
  }, []);
  const addComment = () => {
    axios
      .post(
        "https://posts-app-backend-sidd.vercel.app/comments/new",
        {
          commentBody: newComment,
          Pid: id,
          Username: "",
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // setUsername(response.data.Username)
          setcommentList(response.data);
        }
        // console.log("Comment Added");
      });
    setnewComment("");
    // setUsername("");
    console.log(newComment);
    // console.log(username);
  };
  const editComment=(commentId)=>{
    let newComment = prompt("Enter New comment:");
    axios
        .put(
          "https://posts-app-backend-sidd.vercel.app/comments/edit",
          {
            commentid:commentId,
            new_comment:newComment
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
            setcommentList((prevcommentList) =>
            prevcommentList.map((comment) => {
                if(comment.Cid===commentId)
                {
                  return {...comment,commentBody:newComment};
                }
                // return { ...post, postText: newBodyText };
              })
            );
          }
        })
  }

  const deleteComment = (comment_id) => {
    axios
      .delete(`https://posts-app-backend-sidd.vercel.app/${id.id}/${comment_id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setcommentList((prevComments) =>
            prevComments.filter((comment) => comment.Cid !== comment_id)
          );
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  };

  const deletePost = () => {
    axios
      .delete(`https://posts-app-backend-sidd.vercel.app/${id.id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert(response.data.message);
          navigate("/");
        }
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      if(!newTitle){return;}
      axios
        .put(
          `https://posts-app-backend-sidd.vercel.app/${id.id}/title`,
          {
            title: newTitle,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            alert(response.data.message);
          }
        });
      setPostValue((prevPostValue) =>
        prevPostValue.map((post) => {
          return { ...post, title: newTitle };
        })
      );
    } else {
      let newBodyText = prompt("Enter New content:");
      if(!newBodyText){return;}
      axios
        .put(
          `https://posts-app-backend-sidd.vercel.app/${id.id}/content`,
          {
            content: newBodyText,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            alert(response.data.message);
          }
        });
      // setPostValue({...postValue,postText:newBodyText});
      setPostValue((prevPostValue) =>
        prevPostValue.map((post) => {
          return { ...post, postText: newBodyText };
        })
      );
    }
  };
  const likePost=(post_id)=>{
    axios.post("https://posts-app-backend-sidd.vercel.app/like",{Post_ID:post_id},{headers:{
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
        
        setPostValue(postValue.map((post)=>{
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
        
        setPostValue(postValue.map((post)=>{
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
 
  if (!postValue.length) return <div>Loading...</div>;

  return (
    <>
      {postValue.map((post) => (
        <div className="postPage">
          <div className="leftSide">
            <div className="post">
              <div
                className="title"
                onClick={() => {
                  if (AuthState.username === post.username) {
                    editPost("title");
                  }
                }}
              >
                {post.title}
              </div>
              <div
                className="body"
                onClick={() => {
                  if (AuthState.username === post.username) {
                    editPost("body");
                  }
                }}
              >
                {post.postText}
              </div>
              <div className="footer">
                {post.username}
                {AuthState.username === post.username && (
                  <button onClick={deletePost}>Delete Post</button>
                )}
                <div className="buttons">
                <ThumbUpAltIcon onClick={()=>{likePost(post.id)}} className="unlikeBttn"/>
                
              </div>
              <label>{post.likes_count}</label>
              </div>
            </div>
          </div>
          <div className="rightSide">
            <div className="addCommentContainer">
              <input
                type="text"
                value={newComment}
                placeholder="Comment..."
                autoComplete="off"
                onChange={(event) => {
                  setnewComment(event.target.value);
                }}
              />
              {/* <input
                type="text"
                placeholder="Name"
                value={username}
                autoComplete="off"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              /> */}
              <button onClick={addComment}>Add</button>
            </div>
            <div className="listOfComments">
              {commentList.map((comment) => {
                return (
                  <div
                    key={comment.Cid}
                    className="
                comment"
                  >
                    {comment.commentBody}
                    <p>-{comment.Username}</p>
                    {AuthState.username === comment.Username && (
                      <>
                      <button
                        onClick={() => {
                          deleteComment(comment.Cid);
                        }}
                      >
                        X
                      </button>
                      <button
                        onClick={() => {
                          editComment(comment.Cid);
                        }}
                      >
                        Edit
                      </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Post;
