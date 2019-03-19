import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn
} from "mdbreact";

import {userService} from "./services/UserService.js";
import {Alert} from "./Alert.js";
import { Formik } from 'formik';
import * as Yup from 'yup';

export class Login extends Component {
  static displayName = Login.name;
  constructor (props) {
    super(props);
    this.service = userService;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {alert: null, redirect: false};
    this.temp = "";
  }

  handleSubmit(data){
    this.service.login(data).then(response => 
    this.setState(state => ({
      alert: response,
      redirect: true
    })));
  }

  render () {
    if (this.state.redirect && !this.state.alert) {
      return <Redirect to='/'/>;
    }
    return (
      <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <MDBCard>
           <Alert message={this.state.alert} />
            <MDBCardBody>
              <MDBCardHeader className=" form-header deep-blue-gradient rounded">
                <h3 className="my-3">
                  <MDBIcon icon="lock" /> Login:
                </h3>
              </MDBCardHeader>
               <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values) => {
                    this.handleSubmit(values);
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email('Email must be a valid email address')
                    .required('Required'),
                  password: Yup.string()
                    .min(5, 'Password has to be longer than 5 characters') 
                    .required('Required'),
                })}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                    <div className="grey-text pt-3">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon">
                            <MDBIcon icon="at" />
                          </span>
                        </div>
                        <input
                          id="email"
                          placeholder="Enter your email"
                          type="text"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required 
                          ref={node => (this.email = node)}
                          className={
                            errors.email && touched.email ? 'form-control text-input text-danger error' : 'form-control text-input'
                          }
                        /></div>
                         {errors.email &&
                        touched.email && <div className="text-danger input-feedback">{errors.email}</div>}

                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon">
                            <MDBIcon icon="key" />
                          </span>
                        </div>
                      <input
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required 
                        aria-label="Password" 
                        aria-describedby="basic-addon"
                        ref={node => (this.password = node)}
                        className={
                          errors.password && touched.password ? 'form-control text-input text-danger error' : 'form-control text-input'
                        }
                      /></div>
                      {errors.password &&
                        touched.password && <div className="text-danger input-feedback">{errors.password}</div>}
                        </div>
                    <div className="text-center mt-4">
                      <MDBBtn
                        color="light-blue"
                        className="mb-3"
                        type="submit"
                        disabled={isSubmitting}>
                        Login
                      </MDBBtn>
                    </div>
                    </form>
                  );
                }}
              </Formik>
              <hr/>
              <div className=" text-center">
                <div className="font-weight-light">
                  <p>Not a member? Sign Up</p>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
  }
}
