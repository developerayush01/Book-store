import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'

function Profile() {
    const {user}=useAuth();

    if(!user) {
    return <p>Please login first</p>;
}
    return (
            <div>
        <div>{user.name}</div>
        <div>{user.phone}</div>
        <div>{user.email}</div>
        <div><Link to="/my-books">Listed books</Link></div>
    </div>
    );
}

export default Profile;