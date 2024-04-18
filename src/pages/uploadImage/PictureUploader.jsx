import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import{ faTimes } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const PictureUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  // const [description, setDescription] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };    

  const handleUpload = async () => {
    // if (!selectedFile) {
    //   alert('Kindly select a file');
    //   return;
    // }

    setLoading(true);

    const formData = new FormData();
    formData.append('uploader', uploadStatus)
    formData.append('file', selectedFile);
    // formData.append('description',description )

   


    try {
      const response = await axios.post('http://localhost:8080/api/v1/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } 
      });
      console.log(JSON.stringify(response?.data))
      // setUploadStatus('Upload successful!');
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      // setUploadStatus('Upload failed. Please try again.');
      setShowFailureMessage(true);

      setTimeout(() => {
        setShowFailureMessage(false);
        setUploadStatus('');
      }, 3000);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
   
    <div>
      <form id="generate-form" className="mt-8">
        <input 
          type="file"
          onChange={handleFileChange}
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
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mr-2" /> <br />
            <p className="text-lg text- 200">Successfully Uploaded</p>
          </div>
        )}
        {showFailureMessage && (
          <div className="flex items-center justify-center mt-4">
            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-6xl mr-2" /> <br />
            <p className="text-lg text- 200 text-red-600 ">Kindly Choose a File</p>
          </div>
        )}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>

  </div>

  );
};

export default PictureUploader;
