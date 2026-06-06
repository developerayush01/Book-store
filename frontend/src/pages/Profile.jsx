import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import { useNavigate} from "react-router-dom";

function Profile() {
    const {user}=useAuth();
    const navigate = useNavigate();

    if(!user) {
    return <p>Please login first</p>;
}
    return (
            <div>
        <div>{user.name}</div>
        <div>{user.phone}</div>
        <div>{user.email}</div>
        <button onClick={() => navigate("/profile/edit")}>Edit profile</button>
        <div><Link to="/my-books">Listed books</Link></div>
    </div>
    );
}

export default Profile;