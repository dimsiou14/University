import { useLayoutEffect } from 'react';
// import AdminHome from './AdminHome';
import UserHome from './UserHome';

const Home = () => {
    let username = "user"

    const usernameHandler = () => {
        username = "admin"
        return username
    }

    useLayoutEffect(() => {
        usernameHandler()
    })

    return (
        <div>
            {/* {username === "admin" ? <AdminHome /> : username === "param" ?  */}
            <UserHome /> 
            {/* : null} */}
        </div>
    )
}
export default Home