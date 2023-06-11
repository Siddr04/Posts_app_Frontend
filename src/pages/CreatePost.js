import React from 'react'
import {Formik,Form,Field,ErrorMessage} from "formik"
import { useNavigate } from "react-router-dom";

import * as Yup from 'yup';
import axios from 'axios';
 
const CreatePost = () => {
  const navigate = useNavigate();
  const initialValues={
    title:"",
    postText:"",
    username:""
  };

  const validationSchema=Yup.object().shape({

    title: Yup.string().required(),
    postText :Yup.string().required(),
  })
  const onSubmit=(data)=>{
    axios.post("https://posts-app-backend-sidd.vercel.app/",data,{headers:{
      accessToken:localStorage.getItem("accessToken")
    }}).then((response)=>{
        if(response.data.error)
        {
          alert(response.data.error);
        }
        else
        {
          alert("You have created a new Post");

          navigate("/");

        }
        // setListofposts(response.data);
      })
  }
  return (
    <div className='createPostPage'>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='formContainer'>
                
                <label>Title: </label>
                <ErrorMessage name="title" component="span"/>
                <Field id='inputTitlePost' 
                name='title' placeholder='My Post' autoComplete="off"/>
                <label>Post: </label>
                <ErrorMessage name="postText" component="span"/>
                <Field id='inputCreatePost' name='postText' placeholder='Whats on your mind ?' autoComplete="off"/>
                {/* <label>Name: </label>
                <ErrorMessage name="username" component="span"/>
                <Field id='inputPostUsername' name='username' placeholder='Sid' autoComplete="off"/> */}
                <button type="submit">Create Post</button>
            </Form>
        </Formik>
    </div>
  )
}

export default CreatePost