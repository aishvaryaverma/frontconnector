import axios from 'axios';

const setAuthToken = token => {
    if(token) {
        // Adding header type for HTTP Request
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default setAuthToken;