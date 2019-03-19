export const taskService={
  getAll,
  getToken,
  remove,
  get,
  save
}

function getToken() {
    let token = localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token
    return token;
  }
  

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + getToken()}
    };
    return fetch('/api/tasks', requestOptions).then(handleResponse);
}


function remove(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {'Authorization': 'Bearer ' + getToken()}
    };
    return fetch(`/api/tasks/${id}`, requestOptions).then(handleResponse);
}


function get(taskId) {
    const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + getToken()}
    };
    return fetch(`/api/tasks/AddOrEditTask/${taskId}`, requestOptions).then(handleResponse);
}

function save(task) {
     const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(task)
    };
    return fetch(`/api/tasks`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}