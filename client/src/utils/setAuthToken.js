import axios from 'axios';

const setAuthToken = (Token) => {
  if (Token) {
    axios.defaults.headers.common['x-auth-token'] = Token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
