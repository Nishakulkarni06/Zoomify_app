// import React, { useRef, useState ,useEffect} from 'react'
// import { useNavigate } from 'react-router-dom';
// import styles from "../styles/videoComp.module.css"
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// // import { connectToSocket } from '../../../backend/src/controllers/socketManager';
// import { io } from 'socket.io-client';
// import { IconButton } from '@mui/material';
// import VideoCamIcon from '@mui/icons-material/Videocam';
// import VideoCamOffIcon from '@mui/icons-material/VideocamOff';
// import CallEndIcon from '@mui/icons-material/CallEnd';
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff'; 
// import ScreenShare from '@mui/icons-material/ScreenShare';
// import StopScreenShare from '@mui/icons-material/StopScreenShareOutlined';
// import ChatIcon from '@mui/icons-material/Chat';
// import Badge from '@mui/material/Badge';
// const description = "Some value"; // Define or retrieve the description value

// const server_url  = "http://localhost:3000"
// var connections = {}; 
// const peerConfigConnections = {
//     "iceServers":[
//       {"urls": "stun:stun.l.goggle.com:19302"}
//     ]
// }

// function VideoMeet() {
// var socketRef = useRef();
// const socketIdRef = useRef(null);

// let localVideoRef = useRef();

// let [videoAvailable , setVideoAvailable] = useState(true);
// let [audioAvailable, setAudioAvailable] = useState(true);
// let [video,setVideo] = useState(true);
// let [audio,setAudio] = useState(); 
// let [screen , setScreen] = useState(); 
// let [showModal , setModal] = useState(false); 
// let [screenAvailable,setScreenAvailable] = useState(); 
// let [messages,setMessages] = useState([]); 
// let [message ,setMessage] = useState([]); 
// let [newMessages,setNewMessages] =useState(); 
// let [askForUsername,setAskForUsername] = useState(true); 
// let [username ,setUsername] = useState(""); 

// const videoRef = useRef([]); 
// let [videos,setVideos] = useState([]);

// // it takes video and audio permissions
// const getPermissions = async ()=>{
//     try{
//       const videoPermissions = await navigator.mediaDevices.getUserMedia({video:true});
      
//       if (videoPermissions){
//         setVideoAvailable(true);
//       }else{
//         setVideoAvailable(false); 
//       }
    
//       const audioPermissions = await navigator.mediaDevices.getUserMedia({audio:true});
      
//       if (audioPermissions){
//         setAudioAvailable(true);
//       }else{
//         setAudioAvailable(false); 
//       }

//       if(navigator.mediaDevices.getDisplayMedia){
//         setScreenAvailable(true);
//       }else{
//         setScreenAvailable(false);
//       }

//       if(videoAvailable || audioAvailable){
//         const userMediaStream = await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});
        
//         if(userMediaStream){
//            window.localStream = userMediaStream;
//            if(localVideoRef.current){
//             localVideoRef.current.srcObject = userMediaStream;
//            }
//         }
//       }
//     }
//     catch(e){
//         console.log(e);
//     }
// }

// useEffect(()=>{
// getPermissions();
// },[]);

// let getUserMediaSuccess= (stream)=>{
//  try{
//     console.log("video stream sent");
//     if (window.localStream) {
//   window.localStream.getTracks().forEach(track => track.stop());
//     }
//  }catch(e){console.log(e)}
//  window.localStream = stream;
//  localVideoRef.current.srcObject = stream;

//  for(let id in connections){
//   if(id === socketIdRef.current) continue ;
//   connections[id].addStream(window.localStream);
// //   connections[id].setLocalDescription(description)
// //   .then(()=>{
// //     socketIdRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}));
// //   })
// //   .catch(e=>console.log(e))
// connections[id].createOffer()
//   .then((description) => {
//     // Set the local description with the created offer
//     return connections[id].setLocalDescription(description);
//   })
//   .then(() => {
//     // Emit the SDP to the other peer through the signaling server
//     socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }));
//   })
//   .catch(e => console.log(e));  // Handle any errors that occur

//   }
//   stream.getTracks().forEach(track => track.onended = ()=>{
//     setVideo(false);
//     setAudio(false);

//     try{
//       let tracks = localVideoRef.current.srcObject.getTracks();
//       tracks.forEach(track =>track.stop())
//     }catch(e){console.log(e)}

//     let blackSilence = (...args) => new MediaStream([black(...args),silence()]);
//     window.localStream = blackSilence(); 
//      localVideoRef.current.srcObject =window.localStream;

//     for (let id in connections){
//       connections[id].addStream(window.localStream);
//       connections[id].createOffer().then((description)=>{
//         connections[id].setLocalDescription(description) 
//         .then (()=>{
//           socketRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}));
//         })
//         .catch((e)=>{
//           console.log(e);
//         })
//       })
//     }
//   })
// }

//   let silence = ()=>{
//     let ctx = new AudioContext();
//     let oscillator = ctx.createOscillator();

//     let dst = oscillator.connect(ctx.createMediaStreamDestination());

//     oscillator.start();
//    ctx.resume();
//    return Object.assign(dst.stream.getAudioTracks()[0] ,{enabled:false});
//   } 

//   let black =({width = 640 , height = 480} = {})=>{
//     let canvas = Object.assign(document.createElement("canvas"),{width,height});

//     canvas.getContext('2d').fillRect(0,0,width,height);
//     let stream  = canvas.captureStream();
//     return Object.assign(stream.getVideoTracks()[0] ,{enabled : false});
//   }

// let getUserMedia =()=>{
//     if((video && videoAvailable) || (audio && audioAvailable)){
//         navigator.mediaDevices.getUserMedia({video:video , audio:audio})
//         .then(getUserMediaSuccess)
//         .then((stream)=>{})
//         .catch((e)=>{console.log(e)})
//     }else{
//         try{
//           let tracks = localVideoRef.current.srcObject.getTracks();
//           tracks.forEach(track => track.stop());
//         }catch(e){

//         }
//     }
// }


// let connect = () => {
//   setAskForUsername(false);
//   getMedia();
// }

// useEffect(()=>{
//     if(video !== undefined && audio !== undefined){
//         getUserMedia();
//     }
// },[audio,video])

// let gotMessageFromServer = (fromId,message)=>{
//  var signal = JSON.parse(message);

//  if(fromId !== socketIdRef.current){
//   if(signal.sdp){
//     connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
//     .then(()=>{
//       if(signal.sdp.type === "offer"){
//         connections[fromId].createAnswer().then((description)=>{
//           connections[fromId].setLocalDescription(description).then(()=>{
//             socketRef.current.emit("signal",fromId,JSON.stringify({"sdp":connections[fromId].localDescription})
//           );
//           }).catch( e =>console.log(e))
//         }).catch( e =>console.log(e))
//       }
//     }).catch( e =>console.log(e))
//   }
//  }
//  if(signal.ice){
//   connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e))
//  }
// }

// let addMessage = (data,sender,socketIdSender)=>{
//  setMessage((prevMessages)=>[
//   ...prevMessages,
//   {sender: sender , data : data}
//  ]); 

//  if(socketIdSender !== socketIdRef.current){
//   setNewMessages((prevMessages)=>prevMessages + 1); 
//  }
// }

// let connectToSocketServer = () => {
//     // Establish connection to the socket server
//     socketRef.current = io.connect(server_url, { secure: false });
  
//     // Listen for incoming WebRTC signals (SDP/ICE)
//     socketRef.current.on('signal', gotMessageFromServer);
  
//     // Handle socket connection event
//     socketRef.current.on("connect", () => {
//         console.log("Connected to signaling server"); 
//       socketRef.current.emit("join-call", window.location.href); // Join call
//       socketIdRef.current = socketRef.current.id; // Fix: use lowercase 'id' for socket.io
      
//       // Listen for chat messages
//       socketRef.current.on("chat-message", addMessage);
  
//       // Handle a user leaving
//       socketRef.current.on("user-left", (id) => {
//         console.log("Disconnected from signaling server"); 
//         setVideos((videos) => videos.filter((video) => video.socketId !== id));
//       });
  
//       // Handle a user joining
//       socketRef.current.on("user-joined", (id, clients) => {
//         console.log("User joined:", id, clients);
  
//         // Create peer connections for each client
//         clients.forEach((socketListId) => {
//             console.log("Creating peer connection for:", socketListId);
//           connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
  
//           // Handle ICE candidates
//           connections[socketListId].onicecandidate = (event) => {
//             if (event.candidate) {
//               console.log("Sending ICE candidate:", event.candidate);
//               socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }));
//             }
//           };
  
//           // Handle incoming media streams
//           connections[socketListId].onaddstream = (event) => {
//             console.log("Received stream from:", socketListId);
            
//             // Check if video already exists for this socket ID
//             let videoExists = videoRef.current.find(video => video.socketId === socketListId);
            
//             if (videoExists) {
//               // Update existing video stream
//               setVideos((videos) => {
//                 const updatedVideos = videos.map((video) => (
//                   video.socketId === socketListId ? { ...video, stream: event.stream } : video
//                 ));
//                 videoRef.current = updatedVideos;
//                 return updatedVideos;
//               });
//             } else {
//               // Add a new video stream
//               let newVideo = {
//                 socketId: socketListId,
//                 stream: event.stream,
//                 autoPlay: true,
//                 playsInline: true
//               };
              
//               setVideos((videos) => {
//                 const updatedVideos = [...videos, newVideo];
//                 videoRef.current = updatedVideos;
//                 return updatedVideos;
//               });
//             }
//           };
  
//           // Add local stream if available
//           if (window.localStream) {
//             connections[socketListId].addStream(window.localStream);
//           } else {
//             // Create a "black and silent" stream if no local stream is available
//             const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
//             window.localStream = blackSilence(); 
//             connections[socketListId].addStream(window.localStream);
//             console.log("No local stream available, using black/silent stream.");
//           }
//         });
  
//         // If this is the current user, initiate connections
//         if (id === socketIdRef.current) {
//           for (let id2 in connections) {
//             if (id2 === socketIdRef.current) continue; // Skip self
  
//             try {
//               connections[id2].addStream(window.localStream);
//             } catch (e) {
//               console.error("Error adding local stream:", e);
//             }
  
//             // Create and send SDP offer
//             connections[id2].createOffer()
//               .then((description) => {
//                 return connections[id2].setLocalDescription(description);
//               })
//               .then(() => {
//                 socketRef.current.emit('signal', id2, JSON.stringify({ "sdp": connections[id2].localDescription }));
//               })
//               .catch((e) => {
//                 console.error("Error creating offer:", e);
//               });
//           }
//         }
//       });
//     });
//   };
  
// let routeTo = useNavigate(); 

// let getMedia = ()=>{
//     setVideo(videoAvailable);
//     setAudio(audioAvailable);

//     connectToSocketServer(); 
// }

// let handleVideo = ()=>{
//   setVideo(!video);
// }

// let handleAudio = ()=>{
//   setAudio(!audio);
// }

// let getDisplayMediaSuccess=(stream)=>{
//   try{
//    window.localStream.getTracks().forEach(track => track.stop())
//   }catch(e){console.log(e)}

// window.localStream = stream; 
// localVideoRef.current.srcObject = stream; 

// for(let id in connections){
//   if(id === socketRef.current) continue ;
//   connections[id].addStream(window.localStream)
//   connections[id].createOffer().then((description)=>[
//     connections[id].setLocalDescription(description)
//     .then(()=>{
//       socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
//     })
//     .catch(e => console.log(e))
//   ])
// }

// stream.getTracks().forEach(track => track.onended = ()=>{
//   setScreen(false);

//   try{
//     let tracks = localVideoRef.current.srcObject.getTracks();
//     tracks.forEach(track =>track.stop())
//   }catch(e){console.log(e)}

//   let blackSilence = (...args) => new MediaStream([black(...args),silence()]);
//   window.localStream = blackSilence(); 
//    localVideoRef.current.srcObject =window.localStream;

//   getUserMedia(); 
// })
// }

// let getDisplayMedia = ()=>{
//   if(screen){
//     if(navigator.mediaDevices.getDisplayMedia){
//       navigator.mediaDevices.getDisplayMedia({video:true , audio:true})
//       .then(getDisplayMediaSuccess)
//       .then((stream) => {})
//       .catch((e)=>console.log(e))
//     }
//   }
// }

// useEffect(()=>{
//   if(screen !== undefined){
//     getDisplayMedia();
//   }
// },[screen]); 

// let handleScreen = ()=>{
//   setScreen(!screen);
// }

// let sendMessage = ()=>{
//   // setMessages([...messages, [  username, message ]]);
//   socketRef.current.emit('chat-message',message,username); 
//   setMessage(""); 
// }

// let handleEndCall = ()=>{
//   try{
//     let tracks = localVideoRef.current.srcObject.getTracks(); 
//     tracks.forEach(track =>track.stop()); 
//   }catch(e){
//      routeTo("/home");
//   }
// }

// return (
//   <div>
//     {messages.length}
//       {askForUsername ? (
//           <div>
//               <h2>Enter into lobby</h2>
//               <TextField
//                   id="outlined-basic"
//                   label="Username"
//                   value={username}
//                   onChange={e => setUsername(e.target.value)}
//                   variant="outlined"
//               />
//               <Button variant="contained" onClick={connect}>Connect</Button>

//               <div>
//                   <video ref={localVideoRef} autoPlay muted />
//               </div>
//           </div>
//       ) : (

//           <div className={styles.meetVideoContainer}>
              
//               {showModal ?   <div className={styles.chatRoom}>
//                 <div className={styles.chatContainer}>
//                 <h1>Chat</h1> 
//                 <div className={styles.chattingDisplay}>
//                  { messages.length > 0 ?  messages.map((item,index)=>{
//                   console.log(messages);
//                   return (
//                     <div key={index}>
//                          <p style={{fontWeight:'bold'}}>{item.sender}</p>
//                          <p>{item.data}</p>
//                     </div>
//                   );
//                  }) : <p>No messages yet!</p>
//                 }
//                 </div>
//                 <div className={styles.chattingArea}>
               
//                 <TextField
//           id="outlined-multiline-flexible"
//           className='chatInput'
//           label="Chat"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           multiline
//           maxRows={100}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//                 sendMessage();
//             }
//         }}
//         />
//         <button variant='contained' onClick={sendMessage}>Send</button>
//                 </div>
//               </div>
//               </div>
//                : <></>}
              
//                <div className="video-container">   
//     <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted />
//     <div className={styles.conferenceView}>
//         {videos.map((video,index) => (
//             <div key={index}>
//                 <video
//                     data-socket={video.socketId}
//                     ref={ref => {
//                         if (ref && video.stream) {
//                             ref.srcObject = video.stream; 
//                         }
//                     }}
//                     autoPlay
//                 />
              
//             </div>
//         ))}
//     </div>
//     <div className={styles.buttonContainers}>
//                    <IconButton onClick={handleVideo} style={{color:"white" }} >
//                     {(video ===true) ? <VideoCamIcon/> : <VideoCamOffIcon/> }
//                    </IconButton>
//                    <IconButton onClick={handleAudio} style={{color:"white" }} >
//                    {(audio === true) ? <MicIcon/> : <MicOffIcon/>}
//                    </IconButton>
//                    <IconButton style={{color:"red" }} onClick={handleEndCall}>
//                    <CallEndIcon/>
//                    </IconButton>
//                    <IconButton onClick={handleScreen} style={{color:"white" }} >
//                    {(screen === true) ? <ScreenShare/> : <StopScreenShare/>}
//                    </IconButton>
//                    <Badge badgeContent={newMessages} max ={99} color='secondary' >
//                     <IconButton style={{color:"white" }} onClick={()=>setModal(!showModal)}>
//                       <ChatIcon/>
//                     </IconButton>
//                    </Badge>
//                 </div>
// </div>

//           </div>
//       )}


//   </div>
// );
// }

// export default VideoMeet


import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComp.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
// import server from '../environment';

const server_url = "http://localhost:3000";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
     
      
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
      
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/home"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div>


                    <h2>Enter into Lobby </h2>
                    <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                    <Button variant="contained" onClick={connect}>Connect</Button>


                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>

                </div> :


                <div className={styles.meetVideoContainer}>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <h1>Chat</h1>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )
                                }) : <p>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                                <Button variant='contained' onClick={sendMessage}>Send</Button>
                            </div>


                        </div>
                    </div> : <></>}


                    


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />                        </IconButton>
                        </Badge>

                    </div>

                </div>

            }

        </div>
    )
}