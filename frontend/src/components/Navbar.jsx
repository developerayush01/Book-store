import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'

function Navbar(){
    const { user, mode, setMode } = useAuth();
return(
<nav>
    <Link to="/">Home</Link>
    {
        user ?(
            <span>Welcome,{user.name}</span>
        ):
        (
            <Link to="/login">Login</Link>
        )
    }
</nav>
)
}

export default Navbar;