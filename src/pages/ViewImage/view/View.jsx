import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');


  const loginUrl ='https://gallery-backend-z7i7.onrender.com/user/login'
  const getImagesUrl ='https://gallery-backend-z7i7.onrender.com/api/images'

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [loading, setLoading] = useState(false); 

  const openModal = (url) => {
    setSelectedImageUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImageUrl('');
    setModalIsOpen(false);
  };

  const userName = "AOG"
  const validPassword = "AOG2024"

  const handleLogin = async (e) => {
    if(username !== userName || password !== validPassword){
      return;
    }
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(loginUrl, {
        method: 'PATCH', headers: {

          'Content-Type': 'application/json',
        }, body:JSON.stringify({username, password})
       });

       if(!response.ok){
        
       }

      
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    }
     catch (error) {
      console.error('Login failed:', error);
      setErrMsg('Login failed. Please check your credentials.');
    }finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
      const fetchImageUrls = async () => {
        try {
          if (!isLoggedIn) {
            return;
          }
          
          const response = await axios.get(getImagesUrl);

          setImageUrls(response.data);
          console.log('Image URLs:', response.data);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
          setErrMsg('Failed to view');
        }

      }

    fetchImageUrls();
  }, [isLoggedIn]);


  const handleDownload = (url, index) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `image_${index}.jpg`); 
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => console.error('Download failed:', error));
  };

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      className='bg-contain bg-color-pink-300 bg-center bg-no-repeat h-screen sm:bg-cover bg-bl sm:p-16 flex flex-col justify-center '>
          {
            !isLoggedIn && (
              <form onSubmit={handleLogin} className="w-64 max-w-sm flex flex-col my-32 mx-16">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                {loading ? 'Logging in...' : 'Login'}                
                </button>
                <div className='text-red-700'>
                  <p>
                  Authorised users only
                  </p>
                </div>
              </form>
            )
 
          }
          <div className='flex flex-col justify-top items-top h-screen '>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
            {imageUrls.data?.map((obj, index) => (
              <div key={index} className="relative p-4">
                <img className='p-1' src={obj.link}  alt="" onClick={() => openModal(obj.link)} />
                <p className="text-gray-700 p-1 font-semibold">Uploader: {obj.name}</p>
                <button
                className="absolute bottom--1 left-0 bg-white border border-gray-400 rounded-full p-1 m-2 text-gray-700 hover:bg-gray-400"
                onClick={(e) =>{
                e.stopPropagation();
                handleDownload(obj.link, index)}}>
                Download
              </button>
      </div>
      
    ))}
     <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
      >
        <button onClick={closeModal}>X</button>
        <img src={selectedImageUrl} alt="" />
      </Modal>
  </div>
</div>        

     
    </div>
  );
};

export default ImageGallery;

