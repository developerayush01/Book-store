import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../api/axios";

function Profile() {
    const {setUser}=useAuth();
    const navigate=useNavigate();
    
    return <div>Profile Page</div>
}
export default Profile;