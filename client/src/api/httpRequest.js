import axios from 'axios';

let token;
if(localStorage.token) {
    token = localStorage.getItem('token');
}

console.log(token);

export default axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'x-auth-token': token
    },
    withCredentials: false
});