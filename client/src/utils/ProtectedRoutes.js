import React, {useLayoutEffect, useState} from 'react'
import { Outlet, Navigate } from "react-router-dom";

async function requestAuth() {
    let ret = true;
    fetch('http://localhost:3001/api/validation', {
        method: 'GET',
        credentials: 'include', // ensure cookies are sent with the request
    })
    .then(res => res.json())   
    .then(data => {
        console.log(data);
        if (data.authorized) {
            ret = true;
            console.log("if is authenitcated ret is: " + ret);
        } else {
            ret = false;
        }
    })
    .catch (err => {
        console.log('Error fetching validation data:', err);
        ret = false;
    });
    return ret;
}
function ProtectedRoutes() {
    // const {validated} = useValidation();
    // console.log("protected routes " + validated);
    // // Handle loading state if validation is still being checked

    // if (validated === null) {
    //     return <div>Loading...</div>; // replace with loading ui
    // }
    const [validated, setValidated] = useState([]);
    console.log("validated value right after declaration:  " + validated);
    useLayoutEffect(() => {
        const checkAuth = async () => {
        const isValidated = await requestAuth();
        console.log("isValidated: " + isValidated);
        setValidated(isValidated);
        };
        checkAuth();
    }, []);
   
    // console.log("is validated a truthy?: " + (validated == true));
    return (
        <div>
            {validated ? <Outlet/> : <Navigate to="/login"/>}
        </div>
    )
}
export default ProtectedRoutes