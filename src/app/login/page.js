"use client";
import React, { useState} from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import TextInput from '../components/TestInput/TextInput';
import Loading from '../components/Loading/Loading';
import CustomButton from '../components/CustomBotton/CustomButton';
import { useRouter } from 'next/navigation';
import { GrMultiple } from 'react-icons/gr';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({mode:'onChange'});
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {

    setIsSubmitting(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();

      if(resData?.success === true){
        router.push("/");
      } else{
        setErrMsg("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setErrMsg("Something went wrong!");
    }
    finally{
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className='w-full h-[100vh] flex'>
      {/* LEFT */}
        <div className='w-full md:w-1/2 h-full p-6 md:px-10 xl:px-32 2xl:px-32 flex flex-col justify-center bg-[#f3f5f1] '>
          <div className='w-full flex gap-2 items-center justify-center mb-4'>
            <div className='p-[6px] bg-red-500 rounded text-white'>
              <GrMultiple size={20}/>
            </div>
            <span className='text-2xl font-semibold'>PDF Splitter</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold text-center'>Log in to your account</p>
          <span className='text-sm mt-2 text-center'>
            welcome back
          </span>
          <form className='py-6 flex flex-col items-center gap-4' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name='email' placeholder='email@example.com' type='email'
              label='Email Address' register={ register('email', {required: 'Email is required!'})} 
              error={errors.email? errors.email.message : ""}
              styles='w-full'
              labelStyles='ml-2'
            />
            <div className='w-full relative flex items-center gap-2'>
              <TextInput
                name='password' placeholder='password' type={isPasswordVisible ? 'text' : 'password'}
                label='password' register={ register('password', {required: 'Password is required!'})} 
                error={errors.password? errors.password.message : ""}
                styles='w-full'
                labelStyles='ml-2'
              />
              <button
                type='button'
                className='absolute top-11 right-4 transform -translate-y-1/64 cursor-pointer '
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FaRegEyeSlash size={30} /> : <FaRegEye size={30} />}
              </button>
            </div>

          {
            errMsg && (<span className="text-sm text-[#f64949fe]">{errMsg}</span>)
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-red-500 px-16 py-2.5 tracking-wide text-md font-medium text-white outline-none `} title='Login'/>
          }
          </form>
          <p className='text-ascent-2 pt-6 text-sm text-center'>
            Don&lsquo;t have an account? <Link href='/register' className='text-red-500 font-semibold ml-2 cursor-pointer'>Sign up</Link>
          </p>
        </div>
        {/* RIGHT */} 
        <div className='hidden w-1/2 h-full md:flex flex-col items-center justify-center bg-[#f2f3f8] '>
          <div className='relative w-full flex items-center justify-center'>
            <Image src="/registerImg.png" height={450} width={450} alt='Bg Img' />
          </div>
          <div className='md:px-8 mt-2 text-center'>
            <p className='text-[#33333b] font-bold text-2xl'>
              PDF tool for everyone
            </p>
            <span className='text-sm text-[#33333b] '>
              PDF Splitter is a PDF tool that allows you to split PDF files into multiple files. It is simple and easy to use.
            </span>
          </div>
        </div>
    </div>
  )
}

export default LoginPage