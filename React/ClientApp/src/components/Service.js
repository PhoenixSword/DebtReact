import React, { Component } from 'react';
import { MDBBtn } from "mdbreact";

export const userService={
  token,
  login,
  register,
  prot,
  logout
}

function token() {
  let temp = localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token
  return { headers: {'Authorization': 'Bearer ' + temp}};
}

function login() {
 fetch('/api/users/login', 
  {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({'email': 'qwe@qwe', 'password': 'qwe123'}) 
  })
.then((resp)=>{ return resp.text() })
.then((json)=>{ localStorage.setItem('currentUser', json); })
}

function register() {
 fetch('/api/users/register',
 {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify({'email': 'qwe@qwe021', 'password': 'qwe123'}) 
  })
.then((resp)=>{ return resp.json() })
.then((json)=>{ 
  json.resultStatus && localStorage.setItem('currentUser', JSON.stringify(json));
})
}

function prot() {
 fetch('/api/users/Protected', token())
 .then((resp)=>{ return resp.text() })
 .then((json)=>{ console.log() })
}


function logout() {
      localStorage.removeItem('currentUser');
}