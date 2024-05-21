import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const PictureUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0])
  };

  const handleUpload = async () => {
    console.log("I got here")
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile)
    formData.append('upload_preset', 'wedding_preset')

    const cloudUrl = "https://api.cloudinary.com/v1_1/da9pykf1q/image/upload"
    const endpoint = "https://gallery-backend-z7i7.onrender.com/api/upload"


    try {
      console.log("i got inside method call")
      const response = await axios.post(
        cloudUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
     {
      const link = response.data.secure_url; 
      const name = description;
      // await axios.post(endpoint, { link, name });

      fetch(endpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ link, name })
      })
      .then(res => res.json())
      .then(res => {
          console.log(res)
      })
      .catch(error => {
          console.log(error);
      });

      console.log(JSON.stringify(response?.data));
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        setUploadStatus('');
      }, 3000);

    } }catch (error) {
      console.error('Error uploading file:', error);
      setShowFailureMessage(true);

      setTimeout(() => {
        setShowFailureMessage(false);
        setUploadStatus('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center p-16'>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <div>
        <form id="generate-form" className="w-full max-w-sm flex flex-col my-1 mx-1  " >
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border-2 border-gray-200 rounded p-3 text-gray-dark mr-2 focus:outline-none mb-5"
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-2 border-gray-200 rounded p-3 text-gray-dark mr-2 focus:outline-none mb-5"
          />
          <button
            className="bg-pink-500 rounded w-full text-white py-3 px-4 mt-5 hover:bg-black"
            type="button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
        {showSuccessMessage && (
          <div className="flex items-center justify-center mt-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mr-2" />{' '}
            <br />
            <p className="text-lg text-200 text-green-500">Successfully Uploaded</p>
          </div>
        )}
        {showFailureMessage && (
          <div className="flex items-center justify-center mt-4">
            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-6xl mr-2" /> <br />
            <p className="text-lg text-200 text-red-600 ">Kindly Choose a File</p>
          </div>
        )}
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default PictureUploader;
