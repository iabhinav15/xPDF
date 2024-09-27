"use client";
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading/Loading';
import { GrMultiple } from 'react-icons/gr';
import Link from 'next/link';

const AllPdfPage = () => {

  const [pdfs, setPdfs] = useState([]);
  const [isloading, setIsloading] = useState(false);  

  useEffect(() => {
    // Fetch all PDFs from server
    setIsloading(true);
    const fetchPDFs = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/allpdfs`
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setPdfs(data.allpdf);
        } else {
          console.log('Failed to fetch PDFs');
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        setIsloading(false);
      }
    };
    fetchPDFs();
  }, []);


  // To view the PDF
  const showpdf = (fileUrl) => {
    window.open(`${fileUrl}`, '_blank');
  }

  return (
    <div className='bg-white'>
      <Link href="/" className="flex items-center gap-1 font-bold shadow-xl  hover:cursor-pointer text-2xl px-4 py-4 sm:text-3xl sm:px-12 md:px-24 lg:px-44">
        <GrMultiple size={28} className='text-red-500' />
        <h2>PDF Splitter </h2>
      </Link>
      <div className='bg-[#f5f5fa] min-h-[calc(100vh-90px)] '>
      <h1 className='bg-[#f5f5fa] font-bold text-3xl text-center mx-auto my-4 text-[#33333b]'>All PDFs</h1>
      <div className=''>
        {
          isloading ? <Loading/> : <ul>
          {pdfs.length === 0 ? (<div className='text-center'>No files avaliable</div>) : pdfs.map((pdf, index) => (
            <li key={index} className='flex justify-between items-center bg-white shadow-xl py-4 px-2 sm:px-8 md:px-16 lg:px-30 my-4 lg:mx-24 md:mx-16 sm:mx-8 mx-4'>
              <p>{pdf.fileName}</p>
              <button onClick={()=>(showpdf(pdf.fileUrl))} className='bg-[#f5f5fa] text-[#33333b] font-bold py-2 px-4 rounded-lg shadow-md'>Show</button>
            </li>
          ))}
        </ul>
        }
      </div>
      </div>
    </div>
  )
}

export default AllPdfPage