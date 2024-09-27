// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import {
//   PiCaretCircleLeftFill,
//   PiCaretCircleRightFill,
//   PiPauseFill,
//   PiPlayFill
// } from "react-icons/pi";
// import { MdOutlineClose } from "react-icons/md";
// // import { AspectRatio } from "@/components/ui/aspect-ratio";
// import ReactPlayer from "react-player";

// interface StoryViewerProps {
//   stories: {
//     channels: Channel[];
//     duration: number;
//   };
// }
// interface Channel {
//   name: string;
//   items: StoryItem[];
// }
// interface StoryItem {
//   image: string;
//   video: string;
//   title: string;
//   href: string;
//   seen: boolean;
// }

// function StoryViewer({ stories }: StoryViewerProps) {
//   const [selectedChannelIndex, setSelectedChannelIndex] = useState<number | null>(null);
//   const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(0);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [progress, setProgress] = useState(0);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);
//   const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
//   const [longPressed, setLongPressed] = useState(false);
//   const [message, setMessage] = useState("");
//   const duration = (stories?.duration * 1000) / 2;

//   useEffect(() => {
//     let animationFrameId: number | null = null;
//     let startTime: number | null = null;
//     let elapsedTime = progress;

//     const animate = (timestamp: number) => {
//       if (startTime === null) startTime = timestamp;
//       const elapsed = timestamp - startTime;
//       const progress = Math.min((elapsed / duration) + elapsedTime, 1);
//       setProgress(progress);
//       if (progress < 1 && isPlaying && selectedChannelIndex !== null && selectedItemIndex !== null) {
//         animationFrameId = requestAnimationFrame(animate);
//       } else if (progress >= 1 && isPlaying && selectedChannelIndex !== null && selectedItemIndex !== null) {
//         setProgress(0);
//         startTime = null;
//         elapsedTime = 0;
//         animationFrameId = requestAnimationFrame(animate);
//         handleNextItem();
//       }
//     };
//     if (isPlaying) {
//       startTime = null;
//       animationFrameId = requestAnimationFrame(animate);
//     } else {
//       elapsedTime = progress;
//       if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//       }
//     }
//     return () => {
//       if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//       }
//     };
//   }, [isPlaying, selectedItemIndex, selectedChannelIndex, progress, duration]);

//   const handlePlayPause = (event: any) => {
//     event.stopPropagation();
//     console.log(isPlaying, "handlePlayPause");
//     setIsPlaying((prevIsPlaying) => !prevIsPlaying);
//   };

//   const handleOpenChannel = (index: number) => {
//     setSelectedChannelIndex(index);
//     setSelectedItemIndex(0);
//     setProgress(0);
//     setIsPlaying(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedChannelIndex(null);
//     setSelectedItemIndex(null);
//     setIsPlaying(false);
//     setProgress(0);
//     setMessage("");
//   };

//   const handleNextItem = () => {
//     if (selectedChannelIndex === null || selectedItemIndex === null) return;
//     const nextItemIndex = selectedItemIndex + 1;
//     const currentChannel = stories.channels[selectedChannelIndex];
//     if (nextItemIndex < currentChannel.items.length) {
//       setSelectedItemIndex(nextItemIndex);
//       setProgress(0);
//       setMessage("");
//       setIsPlaying(true);
//     } else {
//       handleNextChannel();
//     }
//   };

//   const handlePrevItem = () => {
//     if (selectedChannelIndex === null || selectedItemIndex === null) return;
//     const prevItemIndex = selectedItemIndex - 1;
//     if (prevItemIndex >= 0) {
//       setSelectedItemIndex(prevItemIndex);
//       setProgress(0);
//       setMessage("");
//       setIsPlaying(true);
//     } else {
//       handlePrevChannel();
//     }
//   };

//   const handleNextChannel = () => {
//     if (selectedChannelIndex === null) return;
//     const nextChannelIndex = selectedChannelIndex + 1;
//     if (nextChannelIndex < stories.channels.length) {
//       setSelectedChannelIndex(nextChannelIndex);
//       setSelectedItemIndex(0);
//       setProgress(0);
//       setMessage("");
//       setIsPlaying(true);
//     } else {
//       setSelectedChannelIndex(0);
//       setSelectedItemIndex(0);
//       handleCloseModal();
//     }
//   };

//   const handlePrevChannel = () => {
//     if (selectedChannelIndex === null) return;
//     const prevChannelIndex = selectedChannelIndex - 1;
//     if (prevChannelIndex >= 0) {
//       setSelectedChannelIndex(prevChannelIndex);
//       setSelectedItemIndex(stories.channels[prevChannelIndex].items.length - 1);
//       setProgress(0);
//       setMessage("");
//       setIsPlaying(true);
//     } else {
//       handleCloseModal();
//     }
//   };

//   const handleTouchStart = (e: any) => {
//     setTouchStart(e.targetTouches[0].clientX);
//     const timer = window.setTimeout(() => {
//       handlePlayPause(e);
//       setLongPressed(true);
//     }, 500);
//     setLongPressTimer(timer);
//   };

//   const handleTouchMove = (e: any) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//     if (longPressTimer) {
//       clearTimeout(longPressTimer);
//       setLongPressTimer(null);
//     }
//   };

//   const handleTouchEnd = (e: any) => {
//     if (longPressTimer) {
//       clearTimeout(longPressTimer);
//       setLongPressTimer(null);
//     }
//     if (longPressed) {
//       handlePlayPause(e); // Pause the video
//       setLongPressed(false);
//     } else {
//       if (!touchStart || !touchEnd) return;
//       const distance = touchStart - touchEnd;
//       const isLeftSwipe = distance > 50;
//       const isRightSwipe = distance < -50;
//       if (isLeftSwipe) {
//         handleNextChannel();
//       }
//       if (isRightSwipe) {
//         handlePrevChannel();
//       }
//     }
//   };

//   const handleStepNextPreviousStory = (event: React.MouseEvent<HTMLDivElement>) => {
//     const { clientX, currentTarget } = event;
//     const { left, width } = currentTarget.getBoundingClientRect();
//     const clickedPosition = clientX - left;
//     if (isPlaying) {
//       if (clickedPosition < width / 2) {
//         handlePrevItem();
//       } else {
//         handleNextItem();
//       }
//     } else {
//       setIsPlaying(true);
//     }
//   };

//   const handleWriteMessage = (event: any) => {
//     event.stopPropagation();
//     setIsPlaying(false);
//   };

//   const handleVideoPlay = () => {
//     setIsPlaying(true);
//   };

//   const handleVideoPause = () => {
//     setIsPlaying(false);
//   };
//   const renderSideChannels = (direction: "left" | "right") => {
//     if (selectedChannelIndex === null) return null;
//     const offset = direction === "left" ? -1 : 1;
//     const channelsToRender = [];
//     for (let i = 1; i <= 2; i++) {
//       const index = selectedChannelIndex + i * offset;
//       if (index >= 0 && index < stories.channels.length) {
//         const isAllStorySeen = stories.channels[index].items.some((item: StoryItem) => item.seen === false);
//         channelsToRender.push(
//           <div 
//             key={index} 
//             onClick={() => handleOpenChannel(index)}
//             className={`relative ${i === 1 ? `w-60 h-[448px]` : `w-44 h-80`}`}
//           >
//             {/* <AspectRatio ratio={16 / 9}> */}
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <motion.img
//                 src={stories.channels[index].items[0].image}
//                 alt={stories.channels[index].name}
//                 className={`w-14 h-14 p-1 border rounded-full object-cover cursor-pointer ${!isAllStorySeen ? "border-neutral-content" : "border-primary"}`}
//               />
//               <p className="font-secondary text-xs font-semibold text-white text-center bg-black/50 p-1 mt-1 rounded-md">{stories.channels[index].name} </p>
//             </div>
//             <motion.img
//               src={stories.channels[index].items[0].image}
//               alt={stories.channels[index].name}
//               className={`object-cover cursor-pointer rounded-3xl transition-all duration-300 ease-in-out ${i === 1 ? `w-60 h-[448px]` : `w-44 h-80`
//                 }`}
//             />
//             {/* </AspectRatio> */}
//           </div>
//         );
//       }
//     }
//     if (direction === "left") {
//       return channelsToRender.reverse();
//     }
//     return channelsToRender;
//   };
// console.log(isPlaying)
//   return (
//     <div className="flex justify-center gap-2 bg-black ">
//       {stories.channels.map((channel: Channel, index: number) => {
//         const isAllStorySeen = channel.items.some((item: StoryItem) => item.seen === false);
//         return (
//           <div key={index} className="flex flex-col gap-2">
//             {/* <AspectRatio ratio={1}> */}
//             <motion.img
//               key={index}
//               src={channel.items[0].image}
//               alt={channel.name}
//               className={`w-14 h-14 p-1 border rounded-full object-cover cursor-pointer ${!isAllStorySeen ? "border-neutral-content" : "border-primary"}`}
//               onClick={() => handleOpenChannel(index)}
//             />
//             {/* </AspectRatio> */}
//             <p className="text-white text-xs font-semibold font-secondary text-center line-clamp-2">{channel.name}</p>
//           </div>
//         )
//       })}

//       <AnimatePresence>
//         {selectedChannelIndex !== null && selectedItemIndex !==null && (
//           <motion.div
//             className="w-screen h-screen fixed inset-0 bg-background z-50 flex items-center justify-center bg-black"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="">
//               <button
//                 onClick={handleCloseModal}
//                 className="hidden sm:inline-block absolute top-4 right-4 text-white text-2xl z-50"
//               >
//                 <MdOutlineClose />
//               </button>
//               <div className="w-full h-full flex justify-center items-center">
//                 <div className="absolute right-[61%] flex items-center z-50">
//                   <div className="sm:flex items-center gap-4 hidden">
//                     {renderSideChannels("left")}
//                   </div>
//                   <button
//                     onClick={handlePrevChannel}
//                     className="text-white text-2xl z-50 ml-1 hidden sm:inline-block"
//                   >
//                     {renderSideChannels("left") && renderSideChannels("left")!.length > 0 ?
//                       <PiCaretCircleLeftFill /> : ""
//                     }
//                   </button>
//                 </div>
//                 <div className="absolute h-full sm:w-80 w-full flex flex-1 items-center justify-center">
//                   <motion.div className="relative w-full h-full sm:h-[576px] sm:rounded-3xl overflow-hidden"
//                     onClick={handleStepNextPreviousStory}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                   >
//                     <div className="absolute z-10 flex gap-2 w-full p-4">
//                       {stories.channels[selectedChannelIndex].items.map((_: any, index: number) =>
//                         <div
//                           key={index}
//                           className={`relative bg-white rounded-md h-1 w-full`}
//                         >
//                           {index === selectedItemIndex && (
//                             <motion.div
//                               className="absolute top-0 left-0 h-full rounded-full bg-black/50"
//                               style={{ width: `${progress * 100}%` }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute w-full mt-4 flex items-center justify-between p-3">
//                       <div className="flex items-center gap-2">
//                         <Image
//                           src={stories.channels[selectedChannelIndex].items[0].image}
//                           width={32}
//                           height={32}
//                           alt="image"
//                           className="z-10 object-cover object-center rounded-full"
//                         />
//                         <p className="z-10 font-secondary text-xs font-bold text-background">{stories.channels[selectedChannelIndex].name}</p>
//                         <p className="z-10 font-secondary text-xs font-light text-background">12h</p>
//                       </div>
//                       <button className="flex gap-2 z-[51] cursor-pointer">
//                         {isPlaying ? (
//                           <PiPauseFill
//                             onClick={handlePlayPause}
//                             className="h-6 w-6 text-background"
//                           />
//                         ) : (
//                           <PiPlayFill
//                             onClick={handlePlayPause}
//                             className="h-6 w-6 text-background"
//                           />
//                         )}
//                         <MdOutlineClose
//                           onClick={handleCloseModal}
//                           className="h-6 w-6 text-background sm:hidden"
//                         />
//                       </button>
//                     </div>
//                     {/* <div className="bg-white rounded-t-3xl absolute z-50 bottom-0 w-full h-60"></div> */}
//                     <div className="absolute bottom-5 z-[51] w-full px-3">
//                       <input
//                         onClick={handleWriteMessage}
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Send message"
//                         className="w-full h-9 px-3 py-2 bg-black/20 outline-none border border-background rounded-xl placeholder:font-secondary placeholder:text-xs placeholder:font-semibold placeholder:text-white text-white font-secondary text-xs font-semibold"
//                       />
//                     </div>
//                     {/* <AspectRatio ratio={9 / 16}> */}
//                       <div
//                         onTouchStart={handleTouchStart}
//                         onTouchMove={handleTouchMove}
//                         onTouchEnd={handleTouchEnd}
//                         className="w-full h-full"
//                       >
//                         {stories.channels[selectedChannelIndex].items[selectedItemIndex].video ? (
//                           <ReactPlayer
//                             url={stories.channels[selectedChannelIndex].items[selectedItemIndex].video}
//                             playing={isPlaying}
//                             controls={false}
//                             loop={false}
//                             // onReady={handleVideoPlay}
//                             // onPause={handleVideoPause}
//                             onBuffer={handleVideoPause}
//                             onBufferEnd={handleVideoPlay}
//                             fallback={<CircularLoader />}
//                             width="100%"
//                             height="100%"
//                             className="w-full h-full object-cover flex justify-center items-center z-10"
//                           />
//                         ) : <motion.img
//                           key={selectedItemIndex}
//                           src={stories.channels[selectedChannelIndex].items[selectedItemIndex].image}
//                           alt={stories.channels[selectedChannelIndex].items[selectedItemIndex].title}
//                           className="w-full h-full object-cover"
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                         />}
//                       </div>
//                     {/* </AspectRatio> */}
//                   </motion.div>
//                 </div>
//                 <div className="absolute left-[61%] flex items-center z-50">
//                   <button
//                     onClick={handleNextChannel}
//                     className="text-white text-2xl z-50 mr-1 hidden sm:inline-block"
//                   >
//                     {renderSideChannels("right") && renderSideChannels("right").length > 0 &&
//                       <PiCaretCircleRightFill />
//                     }
//                   </button>
//                   <div className="sm:flex items-center gap-4 hidden">
//                     {renderSideChannels("right")}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default StoryViewer;

// const CircularLoader = () => {
//   return (
//     <div className="flex justify-center items-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-500"></div>
//     </div>
//   );
// };