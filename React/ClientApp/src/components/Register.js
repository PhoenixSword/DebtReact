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

export class Register extends Component {
  static displayName = Register.name;
  constructor (props) {
    super(props);
    this.service = userService;
    this.state = {alert: null, redirect: false};
  }

  handleSubmit(data){
      this.service.register(data)
      .then(response => 
        this.setState(state => ({
          alert: response,
          redirect: true
        })
      )
      );
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
                  <MDBIcon icon="lock" /> Register:
                </h3>
              </MDBCardHeader>
               <Formik
                initialValues={{ email: '', password: '', passwordConfirm: '' }}
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
                  passwordConfirm: Yup.string()
                    .test('passwords-match', 'Passwords must match ya fool', function(value) {
                      return this.parent.password === value;
                    }),
                })}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
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
                        className={
                          errors.password && touched.password ? 'form-control text-input text-danger error' : 'form-control text-input'
                        }
                      /></div>
                      {errors.password &&
                        touched.password && <div className="text-danger input-feedback">{errors.password}</div>}


                        <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon">
                            <MDBIcon icon="key" />
                          </span>
                        </div>
                      <input
                        id="passwordConfirm"
                        placeholder="Password Confirm"
                        type="password"
                        value={values.passwordConfirm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required 
                        aria-label="PasswordConfirm" 
                        aria-describedby="basic-addon"
                        className={
                          errors.passwordConfirm && touched.passwordConfirm ? 'form-control text-input text-danger error' : 'form-control text-input'
                        }
                      /></div>
                      {errors.passwordConfirm &&
                        touched.passwordConfirm && <div className="text-danger input-feedback">{errors.passwordConfirm}</div>}


                    </div>
                    <div className="text-center mt-4">
                      <MDBBtn
                        color="light-blue"
                        className="mb-3"
                        type="submit"
                        disabled={isSubmitting}>
                        Register
                      </MDBBtn>
                    </div>
                    </form>
                  );
                }}
              </Formik>

              <hr/>
              <div className=" text-center">
                <div className="font-weight-light">
                  <p>Alreay a member? Login</p>
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
