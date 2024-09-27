"use client";

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GrMultiple } from 'react-icons/gr';
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {

  const [showbtn, setShowbtn] = useState(false);
  const router = useRouter();

  const handleShowbtn = () => {
    setShowbtn(!showbtn);
  }

  const handleLogout = async() => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`
        await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        router.push('/login');
      } catch (error) {
          console.log(error.message);
      }
 }

  return (
    <div className='w-full h-[70px] bg-[#ffffff] sticky top-0 z-10 shadow-[0_25px_50px_0px_rgba(0,0,0,0.1)] flex justify-between items-center px-4 sm:px-12 md:px-24 lg:px-44' >
      <div className="flex items-center justify-center gap-1 font-bold hover:cursor-pointer text-2xl sm:text-3xl">
        <GrMultiple size={28} className='text-red-500'  />
        <h2>PDF Splitter </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:block font-semibold bg-[#e5322d] px-3 py-2 rounded-md text-white hover:bg-[#dc615d] ">
          <Link href="/allpdf">All files</Link>
        </div>
        <div className="hidden md:block font-semibold border px-3 py-1.5 border-red-400 rounded-md hover:text-[#e5322d]">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className='hover:cursor-pointer md:hidden relative'>
        <RxHamburgerMenu onClick={handleShowbtn}  className="sm:text-4xl hover:opacity-60 text-3xl " />
        {
        showbtn && (<div className='absolute right-[2px] bg-black opacity-90 p-4 rounded-md '>
          <div className="font-medium bg-[#e5322d] px-3 py-2 rounded-md text-white hover:bg-[#dc615d] ">
            <Link href="/allpdf" >All files</Link>
          </div>
          <div className="font-medium text-white border mt-4 px-3 py-1.5 border-red-400 rounded-md hover:text-[#e5322d]">
            <button onClick={handleLogout} >Logout</button>
          </div>
        </div>)
        }
      </div>
    </div>
  )
}

export default Header