import React, { useEffect, useState } from 'react';
import NameForm from '../components/NameForm';
import { useLocation } from 'react-router-dom';


const Home = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      if (queryParams.get('signUp') === 'true') {
        setIsModalOpen(true);
      }
    }, [location.search]); //will run when query params change

    return (
       <>
        sup bitch
        
        {isModalOpen && <NameForm closeModal={closeModal}/>}
       </>
    )
}
export default Home;
