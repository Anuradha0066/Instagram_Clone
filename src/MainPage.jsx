
import React from 'react'

const MainPage = () => {
  return (
    <div>
      <div className=' bg-black flex flex-col items-left gap-4 pl-4 pt-10 fixed h-full w-[250px] border-r border-gray-700'>
        <h1 className='text-white italic text-[40px] font-[cursive]'>Instagram</h1>
        <p className='text-white text-[20px]'>Home</p>
        <p className='text-white text-[20px]'>Search</p>
        <p className='text-white text-[20px]'>Explore</p>
        <p className='text-white text-[20px]'>Reels</p>
        <p className='text-white text-[20px]'>Messages</p>
        <p className='text-white text-[20px]'>Notifications</p>
        <p className='text-white text-[20px]'>Create</p>
        <p className='text-white text-[20px]'>Profile</p>
        <p className='text-white text-[20px] pt-30'>More</p>
        <p className='text-white text-[20px]'>Also from data</p>
      </div>

      <div className='flex flex-col items-center gap-4 bg-black h-full overflow-scroll'>
        <div className='pt-10 absolute top-0 flex flex-col gap-4'>
          <div className='flex flex-row items-center gap-4 ml-80'>
            {[...Array(8)].map((_, index) => (
              <div key={index} className='flex flex-col items-center gap-2'>
                <img
                  className='h-20 w-20 rounded-full'
                  src='https://plus.unsplash.com/premium_photo-1683147638125-fd31a506a429?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2ViJTIwZGVzaWdufGVufDB8fDB8fHww'
                  alt='profile-pic'
                />
                <p className='text-white text-[20px]'>Username</p>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-4 '>
          <div className='flex flex-row items-center gap-4 ml-80'>
            <div className='flex flex-row items-center gap-2'>
              <img
                className='h-20 w-20 rounded-full'
                src='https://images.unsplash.com/photo-1755984706919-e0b790398626?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D'
                alt='filmygyan'
              />
              <p className='text-white text-[20px]'>filmygyan@123</p>
            </div>
            </div>
            <img
                className='h-[400px] w-[700px] rounded-lg ml-80'
                src='https://images.unsplash.com/photo-1755984706919-e0b790398626?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D' 
              />
          </div>

           <div className='flex flex-col gap-4 mt-5'> 
          <div className='flex flex-row items-center gap-4 ml-80'>
            <div className='flex flex-row items-center gap-2'>
              <img
                className='h-20 w-20 rounded-full'
                src='https://images.unsplash.com/photo-1755984706919-e0b790398626?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D'
                alt='filmygyan'
              />
              <p className='text-white text-[20px]'>filmygyan@123</p>
            </div>
            </div>
            <img
                className='h-[400px] w-[700px] rounded-lg ml-80'
                src='https://images.unsplash.com/photo-1755984706919-e0b790398626?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D' 
              />
          </div>

        </div>
      </div>
    </div>
  )
}

export default MainPage
