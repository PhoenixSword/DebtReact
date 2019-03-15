import React, { Component } from 'react';

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBModalFooter,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput
} from "mdbreact";

import {userService} from "./services/UserService";
export class Login extends Component {
  static displayName = Login.name;
  constructor (props) {
    super(props);
    this.service = userService;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    const target = event.target;
    const email = target.email;
    const password = target.password;
    console.log(email + password)
  }

  render () {
    return (
      <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className=" form-header deep-blue-gradient rounded">
                <h3 className="my-3">
                  <MDBIcon icon="lock" /> Login:
                </h3>
              </MDBCardHeader>
              <form>
                <div className="grey-text pt-3">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <MDBIcon icon="at" />
                      </span>
                    </div>
                    <input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon" required/>
                  </div>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon">
                        <MDBIcon icon="key" />
                      </span>
                    </div>
                    <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon"  required/>
                  </div>
                </div>

              <div className="text-center mt-4">
                <MDBBtn
                  color="light-blue"
                  className="mb-3"
                  type="submit"
                >
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
