import React from 'react'
import { useValidation } from '../utils/ValidationContext'; // Import the useValidation hook


const Login = () => {

    const {validated, setValidatedWithExpiration} = useValidation();
    console.log("protected routes " + validated);

    window.location.href = 'http://localhost:3001/auth/google'; //redirect user to backend for authentification
    setValidatedWithExpiration();
    console.log("protected routes " + validated);
  return (
    <div>login</div>
  )
}

export default Login;

