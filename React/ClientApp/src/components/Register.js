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
  MDBBtn,
  MDBInput
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
      <MDBRow className="justify-content-center register ">
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
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                    <div className="grey-text pt-3">
                     <div className="input-group justify-content-center">
                        <MDBInput
                          id="email"
                          label="Enter your email"
                          type="email"
                          icon="envelope"
                          group
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required 
                          ref={node => (this.email = node)}
                          className={
                            errors.email && touched.email ? 'form-control text-input text-danger error' : 'form-control text-input'
                          }
                          validate
                          error="wrong"
                          success="right"
                          style={{width: '400px'}}
                        />
                         {errors.email &&
                        touched.email && <div className="text-danger input-feedback">{errors.email}</div>}
                        </div>
                       <div className="input-group m-0 justify-content-center">   
                      <MDBInput
                          id="password"
                          label="Enter your password"
                          type="password"
                          icon="key"
                          group
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required 
                          ref={node => (this.password = node)}
                          className={
                            errors.password && touched.password ? 'form-control text-input text-danger error' : 'form-control text-input'
                          }
                          validate
                          error="wrong"
                          success="right"
                          style={{width: '400px'}}
                        /> 
                      {errors.password &&
                        touched.password && <div className="text-danger input-feedback">{errors.password}</div>}
                        </div>
                         <div className="input-group m-0 justify-content-center">   
                      <MDBInput
                          id="passwordConfirm"
                          label="Enter your password confirm"
                          type="password"
                          icon="key"
                          group
                          value={values.passwordConfirm}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required 
                          ref={node => (this.passwordConfirm = node)}
                          className={
                            errors.passwordConfirm && touched.passwordConfirm ? 'form-control text-input text-danger error' : 'form-control text-input'
                          }
                          validate
                          error="wrong"
                          success="right"
                          style={{width: '400px'}}
                        /> 
                      {errors.passwordConfirm &&
                        touched.passwordConfirm && <div className="text-danger input-feedback">{errors.passwordConfirm}</div>}
                        </div>
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
