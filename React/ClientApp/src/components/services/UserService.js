export const userService={
  token,
  authorize,
  login,
  register,
  logout
}

var message = "";

function authorize() {
  return localStorage.getItem('currentUser') ? true : false;
}

function token() {
  let temp = localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token
  return { headers: {'Authorization': 'Bearer ' + temp}};
}

function login(data) {
 return fetch('/api/users/login', 
  {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  })
.then((resp)=>{ return resp.json() })
.then((json)=>{ 
  if(json.resultStatus)
  {
    localStorage.setItem('currentUser', JSON.stringify(json)); 
    message = null;
  }
  else
    message = "Incorrect login or password";
  return message;
  })
}

function register(data) {
 return fetch('/api/users/register',
 {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(data) 
  })
.then((resp)=>{ return resp.json() })
.then((json)=>{ 
  if(json.resultStatus)
  {
    localStorage.setItem('currentUser', JSON.stringify(json)); 
    message = null;
  }
  else
    message = json.errors[0].description;
  return message;
  })
}


function logout() {
  localStorage.removeItem('currentUser');
}