import React, {useEffect, useState} from 'react'
import { Outlet, Navigate } from "react-router-dom";
import { useValidation } from './ValidationContext'; // Import the useValidation hook

function ProtectedRoutes() {
    const {validated, setValidated} = useValidation();
    console.log("protected routes " + validated);
    return (
        <div>
            {validated ? <Outlet/> : <Navigate to="/login"/>}
        </div>
    )
}
export default ProtectedRoutes