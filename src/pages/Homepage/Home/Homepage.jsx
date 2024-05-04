import React from 'react'
import backgroundImage from "../../../assets/images/anu.jpeg"
import PictureUploader from '../../uploadImage/PictureUploader';
import GhostButton from '../../../components/Button/GhostButton/ghostButton';
import {useNavigate} from "react-router-dom";




const Homepage = () => {
  const navigate = useNavigate();

  function view(){
    navigate('view')
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat', 
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  
  }}
    className='bg-contain bg-center 
    bg-no-repeat h-screen sm:bg-cover bg-bl '>
      <header className="bg-pink-600 p-5 mb-10">
        <div className="max-w-5xl m-auto">
          <div className=" text-xl font-bold text-white"> E-Gallery</div>
        </div>
        <div className="absolute top-0 right-0 font-bold text-xl mt-2 mr-5 ">
            <GhostButton text={"View Image"} padding={""} callBack={view}/>
        </div>
        
      </header>
      <nav>
      <h1 className="text-3xl font-bold mb-5 md:text-4xl text-white">
        
      </h1>
      </nav>
      <main>
    <div className="flex flex-col-reverse align-center justify-center p-20
                m-auto md:max-w-4xl md:flex-row ">
    <div className="w-full md:w-2/3 mr-24 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-10">
    

      <p className="mb-4 text-white text-xl p-20">
        {/* E-Gallery allow smartphone users to upload, view and relive memories... */}
      </p>
      <p  className="text-white mt-1 text-3xl">
        {/* Kindly upload your
        Picture */}
      </p>
      <PictureUploader />  
    </div>
    <div className="w-full md:w-1/3 self-center">
      <img src="img/qr-code.svg"
       alt="" 
       className="w-1/2 m-auto mb-10 md-:w-full"/>
    </div>
  
  </div>


  </main>


    </div>   
  )
}

export default Homepage