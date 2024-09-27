"use client";
import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GrMultiple } from "react-icons/gr";
import { FaCloudDownloadAlt } from "react-icons/fa";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Loading from '../Loading/Loading';

const Hero = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  //uploading file to server
  const uploadFileTOServer = async (file) => {
    try {
      const data = new FormData();
      data.append('file', file);
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/upload`
      const res = await fetch(url, {
        method: 'POST',
        body: data,
      })
      const resJson = await res.json();

      if (resJson.success === true) {
        console.log('File uploaded successfully');
      } 
      else{
        console.log('File upload failed');
      }
    } catch (error) {
      console.log(error);
    }
  }    
  

  const togglePageSelection = (pageNumber) => {
    setSelectedPages((prevSelectedPages) =>
      prevSelectedPages.includes(pageNumber)
        ? prevSelectedPages.filter((page) => page !== pageNumber)
        : [...prevSelectedPages, pageNumber]
    );
  };

  const extractPages = async () => {
    if (!pdfFile || selectedPages.length === 0) return;
    setIsLoading(true);

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdf = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
      newPdf.addPage(copiedPage);
    }

    const newPdfBytes = await newPdf.save();
    const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(newPdfBlob);

    //uploading file to server
    await uploadFileTOServer(pdfFile);

    setIsLoading(false);
    // Trigger download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'extracted_pages.pdf';
    a.click();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedPages = Array.from(selectedPages);
    const [removed] = reorderedPages.splice(result.source.index, 1);
    reorderedPages.splice(result.destination.index, 0, removed);

    setSelectedPages(reorderedPages);
  };

  return (
    <div className='flex bg-[#f5f5fa] min-h-[calc(100vh-70px)] '>
      <div className='flex flex-col gap-2 items-center text-center mt-3 px-4 sm:px-12 md:px-24 lg:px-44 relative'>
        <div className='flex'>
          <h1 className='sm:text-4xl xs:text-2xl text-xl font-bold'>Split PDF file</h1>
          <FaCloudDownloadAlt onClick={extractPages} className='md:hidden text-red-500  hover:text-red-400 hover:cursor-pointer bg-white shadow-xl rounded-full p-1 sm:text-5xl text-4xl absolute sm:right-8 right-4' />
        </div>
        <p className='text-sm sm:text-base '>
          Select a PDF file and choose the pages you want to extract by clicking on the page. Then click the &quot;Extract PDF&quot; button to download a new PDF containing the selected
          pages.
        </p>
        <div className='md:my-2 border-8 rounded-full hover:opacity-80'>
          <input type="file" accept=".pdf" onChange={handleFileChange} className='bg-red-500 w-[100%] rounded-full text-white file:sm:h-[70px] file:h-[50px]
          file:sm:mr-6 file:xs:mr-5 file:sm:py-2 file:xs:px-4 flex file:sm:w-2/5 justify-center items-center file:border-none file:text-sm file:sm:text-base file:font-medium file:bg-violet-50 ' />
        </div>
        <p>or drop PDF here</p>
        {pdfFile && (
          <div className=''>
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
              <div className='flex gap-5 flex-wrap max-w-3xl'>
                {Array.from({ length: numPages }, (_, index) => (
                  <div key={index} className='flex flex-col items-center' >
                    <Page
                      width={100}
                      pageNumber={index + 1}
                      onClick={() => togglePageSelection(index + 1)}
                      className={`${selectedPages.includes(index + 1) ? 'border-8' : 'none'} hover:shadow-lg`}
                    />
                    <p>{index + 1}</p>
                  </div>
                ))}
              </div>
            </Document>
            {
              selectedPages.length === 0 && (
                <p className='text-red-500 font-semibold'>Select pages to extract</p>
                )
            }
            {
              selectedPages.length !== 0 && (
                <div className='w-full bg-slate-600 opacity-60 h-[1px] mt-1'></div>
                )
            }
            {selectedPages.length > 0 && (
              <div className='mt-4'>
                <DragDropContext onDragEnd={handleDragEnd}>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} >
                <Droppable droppableId="selectedPages"  direction="horizontal" >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-5 flex-wrap items-center justify-center">
                      {selectedPages.map((pageNumber, index) => (
                        <Draggable key={pageNumber} draggableId={`page-${pageNumber}`} index={index} >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-col items-center hover:cursor-grab"
                            >
                              <Page pageNumber={pageNumber} width={100} className="hover:cursor-grab hover:shadow-lg " />
                              <p>{pageNumber}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                </Document>
                </DragDropContext>
              </div>
            )}
            {
              selectedPages.length > 1 && (
                <p className='text-red-500 mb-3 font-medium'>Drag & Drop to reorder</p>
              )
            }
          </div>
        )}
      </div>
      <div className='hidden md:flex flex-col justify-between items-center w-[40%] h-[calc(100vh-70px)] bg-white sticky top-[70px] right-0'>
        <div className='flex items-center justify-center gap-3 text-center text-4xl font-bold pt-4 text-[#33333b] '>
          <h1>Extract</h1> 
          <GrMultiple size={28} />
        </div>
        <div className='sm:p-4 md:p-8 lg:p-12'>   
        {
          isLoading ? (<Loading />) : 
          (               
          <button onClick={extractPages} className='flex gap-3 font-semibold text-2xl bg-red-500  text-white md:px-5 lg:px-8 py-5 rounded-2xl'>
            <h1>Download</h1> 
            <FaCloudDownloadAlt size={30} />
          </button>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default Hero