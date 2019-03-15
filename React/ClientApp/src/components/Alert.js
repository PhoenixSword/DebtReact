import React from "react";
import { MDBContainer, MDBAlert } from 'mdbreact';

export function Alert(props) {
  if (!props.message) {
    return null;
  }

  return (
     <MDBContainer className="mt-3">
      <MDBAlert color="danger" >
        {props.message}
      </MDBAlert>
    </MDBContainer>
  );
}