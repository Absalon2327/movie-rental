import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const LoginService = {
login: async (formData) => {
    const response = await axios.post(`${BACKEND_URL}/login`, formData, {
    });
    return response.data;
  },
};
export default LoginService;