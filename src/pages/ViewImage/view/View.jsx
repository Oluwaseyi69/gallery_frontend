import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from "../../../assets/images/anu.jpeg";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/media');
        setImageUrls(response.data); 
        setSuccess(true);
        console.log('Image URLs:', response.data); 
      } catch (error) {
        console.error('Error fetching image URLs:', error);
        setErrMsg("Failed to View");
      }
    };

    fetchImageUrls();
  }, []);

  console.log('Image url------>', imageUrls);



  return (
    <div
    
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      className='bg-contain bg-center bg-no-repeat h-screen sm:bg-cover bg-bl'>
        <div className='flex flex-col justify-center items-center h-screen'>
          <div className="grid grid-cols-3 gap-4">
            {/* {Array.isArray(imageUrls) && imageUrls.map((imageUrl, index) => {
              // Check if the URL ends with an image file extension
              const isImage = /\.(jpeg|jpg|png)$/.test(imageUrl);


              
        
              if (isImage) {
                return (
                  <div key={index} className="cursor-pointer" onClick={() => handleViewFile(imageUrl)}>
                    IMAGES
                    <img src={imageUrl} alt={`Image ${index}`} className="rounded-lg" />
                  </div>
                );
              } else {
                return null; // Skip non-image URLs
              }
            })} */}
            {
              imageUrls.map((obj, index) =>{
                console.log('====================================');
                console.log(obj);
                console.log('====================================');
                return <div key={index}>
                  {obj.url && <img src={obj.url} alt="" />}
                </div>
})
            }
          </div>
        </div>

    </div>
  );
};

export default ImageGallery;

