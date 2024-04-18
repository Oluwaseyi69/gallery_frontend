import React from 'react'
import backgroundImage from "../../../assets/images/anu.jpeg"
import View from "../../ViewImage/view"


const Homepage = () => {

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, 
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat', 
    // backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  
  }} className='bg-contain bg-center 
    bg-no-repeat h-screen sm:bg-cover bg-bl'>
      <header class="bg-pink-600 p-5 mb-10">
        <div class="max-w-5xl m-auto">
          <div class="text-xl font-bold text-white"> E-Gallery</div>
        </div>
      </header>
      <nav>
      <h1 class="text-3xl font-bold mb-5 md:text-4xl text-white">
        
      </h1>
      </nav>
      <main>
    <div class="flex flex-col-reverse align-center justify-center p-20
                m-auto md:max-w-4xl md:flex-row ">
    <div class="w-full md:w-2/3 mr-24 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-10">
    

      <p class="mb-4 text-white text-xl p-20">
        {/* E-Gallery allow smartphone users to upload, view and relive memories... */}
      </p>
      <p  class="text-white mt-1 text-3xl">
        {/* Kindly upload your
        Picture */}
      </p>
      <View />  
    </div>
    <div class="w-full md:w-1/3 self-center">
      <img src="img/qr-code.svg"
       alt="" 
       class="w-1/2 m-auto mb-10 md-:w-full"/>
    </div>
  
  </div>


  </main>


    </div>   
  )
}

export default Homepage