import { createContext,useState,useContext, useEffect } from "react";
import axiosInstance from '../api/axios.js'
const AuthContext=createContext();

export function AuthProvider({children})
{
 const[user,setUser]=useState(null);
 const [loading, setLoading] = useState(true);
 const[mode,setMode]=useState("buyer");
 useEffect(()=>{
    const checkLogin=async()=>{
        try {
            const response=await axiosInstance.get("/api/users/profile");
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        }
        finally {
      setLoading(false);
    }
    };
    checkLogin();
 },[]);
    return(
<AuthContext.Provider value={{user, setUser, mode, setMode,loading}}>
    {children}
</AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}