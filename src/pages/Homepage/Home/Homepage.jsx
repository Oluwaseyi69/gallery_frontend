import React from 'react'
import backgroundImage from "../../../assets/images/aaron-burden-FHWgqOniOSY-unsplash.jpg"
import PictureUploader from '../../uploadImage/PictureUploader';
import GhostButton from '../../../components/Button/GhostButton/ghostButton';
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
      <header className="bg-pink-600 p-5 mb-10">
        <div className="max-w-5xl m-auto">
          <div className=" text-xl font-bold text-white w-fit ml-70"> E-Gallery</div>
        </div>
        <div className="absolute top-0 right-0 font-bold text-xl mt-2 mr-8 ">
            <GhostButton text={"View Image"} padding={""} callBack={view}/>
        </div>
        
      </header>
    
      <h1 className="text-3xl font-bold mb-5 md:text-4xl text-white"> </h1>
      
              
      <main>
        <div className="flex flex-col-reverse align-center justify-center p-20
                    m-auto md:max-w-4xl md:flex-row ">
        <div className="w-full md:w-2/3 mr-24 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-10">

        <PictureUploader />  
    </div>
  </div>


  </main>


    </div>   
  )
}

export default Homepage