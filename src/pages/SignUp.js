import React ,{useState}from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
const SignUp = () => {
  const[auth,setAuth]=useState(-1);
  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });
  const onSubmit = (data) => {
    let value1 = data.password;
    let value2 = data.confirmPassword;
    // console.log(value1);
    // console.log(value2);
    if (value1 === value2) {
      axios
        .post("http://localhost:3024/users/registration", data)
        .then((response) => {
          if(response.data.error)
          {
            alert(response.data.error);
          }
          else
          {
            alert(response.data.message);
            navigate("/");
            

          }
          
        });
    }
    else
    {
      setAuth(0);

    }
  };
  return (
    <>
    {auth===0 && <h3>Passwords don't match !!.</h3>}
    
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="Sid"
            autocomplete="off"
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputCreatePost"
            name="password"
            placeholder="Your password..."
            autocomplete="off"
            type="password"
          />
          <label>Confirm Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputCreatePost"
            name="confirmPassword"
            placeholder="Confirm password..."
            autocomplete="off"
            type="password"
          />
          <button type="submit">SignUp</button>
        </Form>
      </Formik>
    </div>
    </>
  );
};

export default SignUp;
