import React, { createContext, useContext, useState, useEffect } from 'react';


// Create a context
const ValidationContext = createContext();

// Custom hook to use the validation context
export const useValidation = () => {
  return useContext(ValidationContext);
};

// ValidationProvider component, defines the value asigned to validated when we call setValidated()
export const ValidationProvider = ({ children }) => {
  const [validated, setValidated] = useState(() => {
    const data = JSON.parse(localStorage.getItem('validated'));
    if (data && Date.now() < data.expirationTime) { // checks to see if it is expired
        return data.validated;
      } else {
        localStorage.removeItem('validated');
        return false; // Expired or not set
      }
  });

// set validated with an experation time
    const setValidatedWithExpiration = (validated) => {
        const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 5;  // make user relogin after 5 days
        const data = { validated, expirationTime };
        localStorage.setItem('validated', JSON.stringify(data));
    };

  return (
    // Corrected the provider name to 'Provider' with the correct case
    <ValidationContext.Provider value={{ validated, setValidated, setValidatedWithExpiration }}>
      {children}
    </ValidationContext.Provider>
  );
};
