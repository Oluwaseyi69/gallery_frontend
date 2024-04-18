// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import backgroundImage from "../../../assets/images/anu.jpeg";

// const ImageGallery = () => {
//   const [imageUrls, setImageUrls] = useState([]);
//   const [errMsg, setErrMsg] = useState('');
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const fetchImageUrls = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/v1/media');
//         setImageUrls(response.data); 
//         setSuccess(true);
//         console.log('Image URLs:', response.data); 
//       } catch (error) {
//         console.error('Error fetching image URLs:', error);
//         setErrMsg("Failed to View");
//       }
//     };

//     fetchImageUrls();
//   }, []);

//   const handleViewFile = async (imageUrl) => {
//     try {
//       const response = await axios.get(imageUrl, { responseType: 'blob' });
//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const url = URL.createObjectURL(blob);
//       window.open(url, '_blank');
//     } catch (error) {
//       console.error('Error fetching file:', error);
//     }
//   };

//   return (
//     <div
    
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//       className='bg-contain bg-center bg-no-repeat h-screen sm:bg-cover bg-bl'>
//         <div className='flex flex-col justify-center items-center h-screen'>
//           <div className="grid grid-cols-3 gap-4">
//             {Array.isArray(imageUrls) && imageUrls.map((imageUrl, index) => {
//               // Check if the URL ends with an image file extension
//               const isImage = /\.(jpeg|jpg|png)$/.test(imageUrl);


              
        
//               if (isImage) {
//                 return (
//                   <div key={index} className="cursor-pointer" onClick={() => handleViewFile(imageUrl)}>
//                     IMAGES
//                     <img src={imageUrl} alt={`Image ${index}`} className="rounded-lg" />
//                   </div>
//                 );
//               } else {
//                 return null; // Skip non-image URLs
//               }
//             })}
//           </div>
//         </div>

//         <div>IMAGES</div>
//     </div>
//   );
// };

// export default ImageGallery;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        // Replace 'cloud_name', 'api_key', and 'api_secret' with your Cloudinary credentials
        const cloudinaryUrl = `https://res.cloudinary.com/da9pykf1q/image/list/<your_image_folder>.json?api_key=969398339924186&api_secret=3zW-ITd7YZKze_wcZ5tcHLJ_X_s`;
        const response = await axios.get(cloudinaryUrl);
        const urls = response.data.resources.map(resource => resource.secure_url);
        setImageUrls(urls); 
        setSuccess(true);
        console.log('Image URLs:', urls); 
      } catch (error) {
        console.error('Error fetching image URLs:', error);
        setErrMsg("Failed to View");
      }
    };

    fetchImageUrls();
  }, []);

  const handleViewFile = async (imageUrl) => {
    try {
      window.open(imageUrl, '_blank');
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  return (
    <div>
      {errMsg && <div>{errMsg}</div>}
      {success && (
        <div className="grid grid-cols-3 gap-4">
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="cursor-pointer" onClick={() => handleViewFile(imageUrl)}>
              <img src={imageUrl} alt={`Image ${index}`} className="rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

