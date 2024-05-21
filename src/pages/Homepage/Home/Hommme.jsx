import React from 'react'
import backgroundImage from "../../../assets/images/anu.jpeg"
import PictureUploader from '../../uploadImage/PictureUploader';
import {useNavigate} from "react-router-dom";

const Hommme = () => {
  const navigate = useNavigate();

  function view(){
    navigate('/view')
  }
  return ( 
    <div
      style={{ backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    
      }}
      className='bg-contain bg-center bg-no-repeat h-screen sm:bg-cover bg-bl '>
      
          <div className="flex bg-pink-600 p-5 mb-10 justify-between">
                <div className=" text-xl font-bold text-white w-fit"> E-Gallery</div>
                <button
                  className='py-3 px-6 bg-pink-600 text-white border-none rounded-full font-bold '
                  onClick={view}>
                  View Pictures
                </button>
              
          </div>

          
          <div className="flex flex-col-reverse align-center justify-center p-20 m-auto md:max-w-4xl md:flex-row ">
          <PictureUploader />  

          </div>

    </div>
      
    
  )
}

export default Hommme