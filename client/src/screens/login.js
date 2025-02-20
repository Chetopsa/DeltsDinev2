import React from 'react';

const Login = () => {

    // const {validated, setValidatedWithExpiration} = useValidation();
    // console.log("protected routes " + validated);

    window.location.href = 'localhost:5001/auth/google'; //redirect user to backend for authentification
    // setValidatedWithExpiration();
    // console.log("protected routes " + validated);
  return (
    <div>login</div>
  )
}

export default Login;

