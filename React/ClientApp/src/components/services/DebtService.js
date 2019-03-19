import {userService} from "./UserService.js";
export const debtService={
  get
}

function get(memberId) {
    return fetch(`/api/debts?memberId=${memberId}`, userService.token()).then(handleResponse);
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