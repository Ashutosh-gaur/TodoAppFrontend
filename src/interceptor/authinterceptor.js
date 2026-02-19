import axios from "axios";

 const api = axios.create({
  baseURL: process.env.REACT_APP_API",
});


api.interceptors.response.use(
    response=>response,error=>{
        if(error.response?.status===401){
             localStorage.removeItem("token");
            window.location.href="/login"
        }
    }
)
export default api;
