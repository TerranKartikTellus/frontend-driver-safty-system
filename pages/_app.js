import '@/styles/globals.css'
import { useEffect, useState } from 'react'
import { w3cwebsocket as WebSocket } from 'websocket';

import { toast, Toaster } from 'react-hot-toast';




function Say(text){
      toast(text,
          {
             position: "bottom-center",
            duration: 1000,
            icon: '👏',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '20px',
              width: '2270px',
            },
          }
        );
      
}


export default function App({ Component, pageProps }) {
const [alert, setAlert] = useState({
  flag: 0, duration: 500
})
const [data, setData] = useState('ee')


  useEffect(() => {

    const ws = new WebSocket('ws://localhost:8000');

    // Receive data from the WebSocket connection
    ws.onmessage = (event) => {
      setData(prevData => prevData + event.data);
    };

    const handleKeyPress = (event) => {
      if (event.key === "f") {
            Say("Drowsy");
            setAlert({...alert,flag:1})
            setTimeout(() => {
            setAlert({...alert,flag:0})  
            }, 200);

      }
      if (event.key === "g") {
            Say("Detected Phone");
            setAlert({...alert,flag:1})
            setTimeout(() => {
            setAlert({...alert,flag:0})  
            }, 200);
      }
      if (event.key === "h") {
            Say("Yawning");
            setAlert({...alert,flag:1})
            setTimeout(() => {
            setAlert({...alert,flag:0})  
            }, 200);
      }


      
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);


return <div className={`${ alert.flag ? "bg-red-700 text-gray-200" :"bg-gray-100/95" } h-screen flex flex-col items-center justify-center `}>
<Toaster/>
    <Component alert={alert} {...pageProps} />
    {/* <div>data:{data}</div> */}
    {/* <div className="fixed top-3 right-3">
    Ankit	20MIC0004 | Kartik 20MIS0106  | Shashwat 20MIS0255
    </div> */}
    </div>
}
