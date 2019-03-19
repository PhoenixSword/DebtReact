export const debtService={
    getAll,
    getToken,
    fullInfo
  }
  
  function getToken() {
      let token = localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token
      return token;
    }
    
  
  function getAll(memberId) {
      const requestOptions = {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + getToken()}
      };
      return fetch(`/api/debts?memberId=${memberId}`, requestOptions).then(handleResponse);
  }
  
  
  function fullInfo(taskId) {
      const requestOptions = {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + getToken()}
      };
      return fetch(`/api/debts/info`, requestOptions).then(handleResponse);
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
