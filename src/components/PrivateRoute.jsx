import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus();

    //if checking status is true return loading
    if (checkingStatus) {
        return <Spinner />
    }

    return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute;