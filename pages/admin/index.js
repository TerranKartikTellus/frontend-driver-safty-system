import { useState, useEffect } from 'react';
import { w3cwebsocket } from 'websocket';




export default function Admin(){
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('NaN');
  let data= {'drowsy': null , 'time':null};
 const [socket, setSocket] = useState(null);
 const [number, setNumber] = useState({'drowsy': null , 'time':null});
 useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765/');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data){
        data= {'drowsy': null , 'time':null}
      }
      console.log('data: ',data);
      setNumber(data);
    };
    return () => ws.close();
  }, []);



  return(
    <div className='flex flex-row items-center justify-center space-x-3'>
      Admin
      <div className="p-10 bg-gray-800 text-gray-200"> 
       Yawning: {number && number.yawn?1:0}
      <p>Time: {number && number.yawn ? number.time : NaN}</p> 
      </div>
      <div className="p-10 bg-gray-800 text-gray-200">
      Drowsy: {number && number.drowsy?1:0}
      <p>Time: {number && number.drowsy ? number.time : NaN}</p>
      </div>
    </div>
  );
}