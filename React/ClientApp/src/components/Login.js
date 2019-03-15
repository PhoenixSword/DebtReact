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

export class Login extends Component {
  static displayName = Login.name;
  constructor (props) {
    super(props);
    this.service = userService;
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {alert: null, redirect: false};
    this.temp = "";
  }

  handleEmailChange(e) {
     this.setState({email: e.target.value});
  }
  handlePasswordChange(e) {
     this.setState({password: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.service.login({'email': this.email.value, 'password': this.password.value}).then(response => 
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
              <form onSubmit={this.handleSubmit}>
                <div className="grey-text pt-3">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <MDBIcon icon="at" />
                      </span>
                    </div>
                    <input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon" required ref={node => (this.email = node)}/>
                  </div>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <MDBIcon icon="key" />
                      </span>
                    </div>
                    <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon" ref={node => (this.password = node)} />
                  </div>
                </div>

              <div className="text-center mt-4">
                <MDBBtn
                  color="light-blue"
                  className="mb-3"
                  type="submit">
                  Login
                </MDBBtn>
              </div>
              </form>
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
