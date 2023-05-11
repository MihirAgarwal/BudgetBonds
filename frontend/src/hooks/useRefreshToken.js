import Axios from "axios"

const useRefreshToken = () => {
    const response = async() => {
        const response = await Axios.post('http://localhost:2600/api/refresh_token',{
            withCredentials : true
        });
        console.log(response);
    }
  return refresh;
}

export default useRefreshTokenAxios;

