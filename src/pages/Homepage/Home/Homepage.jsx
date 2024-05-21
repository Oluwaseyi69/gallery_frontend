import React from 'react'
import backgroundImage from "../../../assets/images/anu.jpeg"
import PictureUploader from '../../uploadImage/PictureUploader';
import {useNavigate} from "react-router-dom";




const Homepage = () => {
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
            className='py-3 px-6 bg-green-300 text-white border-none rounded-full font-bold '
            onClick={() => console.log("clicked on view")}>
            View Pictures
          </button>
        
      </div>
        
      <main>
        <div className="flex flex-col-reverse align-center justify-center p-20 m-auto md:max-w-4xl md:flex-row ">
          <div className="w-full md:w-2/3 mr-24 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-10">
            <PictureUploader />  
          </div>
        </div>
      </main>
    </div>   
  )
}

export default Homepage