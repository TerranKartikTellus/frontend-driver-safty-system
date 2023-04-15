import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
// import WebcamInput from '@/components/WebCamInputs';
import { w3cwebsocket } from 'websocket';
import util from 'util';

// const car = ;
// const carBlue = ;
// const carBlue = ;
// const carBlue = ;
function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}
function playAudio3() {
  const audio = new Audio('/attentive.mp3');
  // audio.currentTime = 0;
audio.play();

}

function playAudio2() {
  const audio = new Audio('/a3.mp3');
audio.play();

}
function playAudioYawn() {
  const audio = new Audio('/a3.mp3');
  // const audio = new Audio('/yawn.mp3');
audio.play();

}

function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

    
  if(hh > 12){
      session = "PM";
   }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   return hh + ":" + mm + ":" + ss;
}

export default function Panel(){
  const[alert,setAlert] = useState({flag:false})
  const [frame, setFrame] = useState(null);
  const sleep = util.promisify(setTimeout);

  const [leftShow,setLeftShow] = useState({'exMark':false, 
                'drowsyRed':false,'drowsy':false,'drowsyTime':0,'FirstdrowsyTime':0,'NdrowsyTime':0,'NFirstdrowsyTime':0, 
              'yawnCount':0,  'yawnRed':false,'yawn':false, 'yawnTime':0, 'FirstyawnTime':0,'NyawnTime':0,'NFirstyawnTime':0
              });
  const [carStatus,setCarStatus] = useState({
    parked: true,
    speed : 1,
    currentCar: alert.flag ? "/car/redCar.svg" : "/car/whiteCar.svg",
    pingCar: false,
    maxSpeed: 30,
    drowsy: 0, drowsy_time: 0,
    
  });
  
  let dr = 0;
  let ndr = 0;

  useEffect( function(){
  
    const intervalId = setInterval(async () => {


      if ( carStatus.speed <= carStatus.maxSpeed){
        setCarStatus({ ...carStatus , speed: carStatus.speed + 1});
      }else if ( !carStatus.parked ){
         
          setCarStatus({ ...carStatus , speed: carStatus.speed - getRandomNumber() });  
          
          if (carStatus.speed-1 == carStatus.maxSpeed && !leftShow.exMark)
          {
            playAudio2()
              const audio = new Audio('/speed-limit.mp3');
              audio.play();
            setTimeout(() => {
            playAudio2()  
            }, 1000);
            
            setLeftShow({...leftShow,exMark:true});
            alert.flag = true
            setAlert({...alert,flag:true})
            setTimeout(()=>{
              setLeftShow({...leftShow,exMark:false});
              alert.flag = false
                setAlert({...alert,flag:false})
            },5000)
            toast('Speed Limit Reached!',
          {
             position: "bottom-center",
            duration: 1000,
            icon: '⚠️',
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
      }

    
      }, 1500);

      

    return () => clearInterval(intervalId);


  }, [carStatus]);



useEffect(()=>{
},[carStatus])

function TimeToSeconds(timeStr){
  timeStr=timeStr.toString()
const [hourStr, minuteStr, secondStr] = timeStr.split(":");  // split the time string into its components
const hour = parseInt(hourStr);  // convert the hour string to an integer
const minute = parseInt(minuteStr);  // convert the minute string to an integer
const second = parseInt(secondStr);  // convert the second string to an integer
const totalSeconds = hour * 3600 + minute * 60 + second;  // calculate the total seconds
return (totalSeconds)  // print the total seconds

}
 const [number, setNumber] = useState({'drowsy': null ,'yawn':0, 'time':null});
 const [countD,setCountD] = useState(1)
 
 useEffect(() => {
   const ws = new WebSocket('ws://localhost:8765/');
   ws.onmessage = async (event) => {
     const data = JSON.parse(event.data);
     if (!data){
       data= {'drowsy': null , 'time':null}
      }
      console.log('data: ',data);
      // console.log(TimeToSeconds(data.time));
      // console.log(TimeToSeconds(currentTime()));
      
      setNumber(data);

      leftShow.drowsyRed="bg-gray-100 text-gray-900"
      if(data.drowsy==1){
        leftShow.NFirstdrowsyTime=0
        if(leftShow.FirstdrowsyTime==0){
          leftShow.FirstdrowsyTime= TimeToSeconds(data.time)
        }
        leftShow.drowsyTime = TimeToSeconds(currentTime())   
        let dif =  leftShow.drowsyTime - leftShow.FirstdrowsyTime
          
          if(dif==1){  leftShow.drowsyRed="bg-red-100"    }
          if(dif==2){  leftShow.drowsyRed="bg-red-200"    }
          if(dif==3){  leftShow.drowsyRed="bg-red-300"    }
          if(dif==4){  leftShow.drowsyRed="bg-red-400"    }
          if(dif==5){  leftShow.drowsyRed="bg-red-500 text-gray-100"    }
          if(dif==6){  leftShow.drowsyRed="bg-red-600 text-gray-100"    }
          if(dif==7){  leftShow.drowsyRed="bg-red-700 text-gray-100"    }
          if(dif==8){  leftShow.drowsyRed="bg-red-800 text-gray-100"    }
          if(dif>=9){  leftShow.drowsyRed="bg-red-900 text-gray-100"  ;playAudio3()  }

          if(dif==3){
            leftShow.drowsy=true
            setTimeout(function(){leftShow.drowsy=false},3000)
            playAudio3()
            
          }
          
      }
      if(data.drowsy==0){
        leftShow.FirstdrowsyTime=0
          if(leftShow.NFirstdrowsyTime==0){
            leftShow.NFirstdrowsyTime= TimeToSeconds(data.time)
          }
          leftShow.NdrowsyTime = TimeToSeconds(currentTime())   
      }


      // const audio = new Audio('/yawn.mp3');
      if(data.yawn==1){
        // audio.play();
        leftShow.yawnCount = leftShow.yawnCount+1 
        leftShow.yawn=true
        playAudio2()
        playAudioYawn()
        leftShow.yawnRed="bg-red-500/90" 
        setTimeout(() => {
          leftShow.yawn=false
          leftShow.yawnRed="bg-gray-100"
        }, 3000);



        leftShow.NFirstyawnTime=0
        if(leftShow.FirstyawnTime==0){
          leftShow.FirstyawnTime= TimeToSeconds(data.time)
        }
        leftShow.yawnTime = TimeToSeconds(currentTime())   
        let dify =  leftShow.yawnTime - leftShow.FirstyawnTime
          
          // if(dify==1){  leftShow.yawnRed="bg-red-900"    }
          // if(dify==2){  leftShow.yawnRed="bg-red-200"    }
          // if(dify==3){  leftShow.yawnRed="bg-red-300"    }
          // if(dify==4){  leftShow.yawnRed="bg-red-400/50"    }
          // if(dify==5){  leftShow.yawnRed="bg-red-500/50"    }
          // if(dify==6){  leftShow.yawnRed="bg-red-600/50"    }
          // if(dify==7){  leftShow.yawnRed="bg-red-700/50"    }
          // if(dify==8){  leftShow.yawnRed="bg-red-800/50"    }
          // if(dify>=9){  leftShow.yawnRed="bg-red-900/50"  ;playAudio3()  }

          // if(dify==3){
          //   leftShow.yawn=true
          //   setTimeout(function(){leftShow.yawn=false},3000)
          //   playAudio3()
            
          // }
          
      }
      if(data.yawn==0){
        leftShow.FirstyawnTime=0
          if(leftShow.NFirstyawnTime==0){
            leftShow.NFirstyawnTime= TimeToSeconds(data.time)
          }
          leftShow.NyawnTime = TimeToSeconds(currentTime())   
      }


















    };
    return () => ws.close();
  }, []);
  function Color(){
    let arr = ["bg-red-400","bg-red-500","bg-red-600"]
  }
  return (
    <div className={` ${leftShow.yawnRed  ? leftShow.yawnRed  : "bg-gray-100"} ${leftShow.drowsyRed  ? leftShow.drowsyRed  : "bg-gray-100"}  text-right w-full h-full flex flex-row item-center justify-center pt-`}>
        <div className='fixed top-0 right-0'>Ankit 20MIC0004 | Kartik 20MIS0106 | Shashwat 20MIS0255</div>
    <main className="bg-gray-900 text-gray-50 font-sans w-11/12 h-6/6 my-14  rounded-md shadow-2xl">
      <div className='w-full'><Toaster/></div>
      {/* <div className='bg-red-500 w-full h-full fixed top-0 left-0 z-10'> 
        sdsd
      </div> */}
        <div className='bg-black fixed top-5 left-5 text-white hidden'>
         <p>Time: {number.time && number.time}</p>
         <p>Drowsy: {number.drowsy?1:0}</p>
         <p>Yawn: {number.yawn?1:0}</p>
         <p>CountD: {countD}</p>
         <p>FDTime: {leftShow.FirstdrowsyTime}</p>
         <p>LDTIme: {leftShow.drowsyTime}</p>
         <p>NFDTime: {leftShow.NFirstdrowsyTime}</p>
         <p>NLDTIme: {leftShow.NdrowsyTime}</p>
         
         
        </div>
        <div className='w-full h-5/6 flex flex-row items-start justify-center'>
          <Left alert={alert}  carStatus={carStatus} setCarStatus={setCarStatus}></Left>
          <Right leftShow={leftShow} carStatus={carStatus} setCarStatus={setCarStatus}></Right>
        </div>
        <div className='w-full h-1/6 border-t-[1px] border-gray-300/30'>
          <Bottom   carStatus={carStatus} setCarStatus={setCarStatus}></Bottom>
        </div>
    </main>
</div>
  );
}

function Left({carStatus,setCarStatus,alert}){
  const [animate,setAnimation] = useState(200);
  
  return (
    <div className="w-2/6 h-full bg-redd  border-r-[1px] border-gray-300/30 p-4 overflow-hidden">
      {/* // park/moving */}
      <div className="text-9xl font-semibold text-center h-[140px]">
        {carStatus.parked ? <div>P</div> : <div>{carStatus.speed} <p className="text-lg">Km/h</p></div>}
      </div>


      {/* // car */}
      <div className="  flex flex-row items-center justify-between ">
        <img src="/steering.svg" className={`w-[50px] ${carStatus.parked ? "opacity-50" : "opacity-100" }`}  
        onClick={()=>{setCarStatus({...carStatus,speed:0,parked: !carStatus.parked})}}></img>

        <div className="text-xl flex flex-row items-end justify-center space-x-3 font-semibold"> 
          <p className={`${!carStatus.parked ? "opacity-100" : "opacity-50"} ` }> D </p>
          <p className={`opacity-50`}> N </p>
          <p className={`opacity-50`}> R </p>
          <p className={`${carStatus.parked ? "opacity-100" : "opacity-50"} ` }> P </p>
        </div>
      </div>
      <div >

      </div>

      {/* // menu */}
      <div className=" relative  ">
        <img src="/car/driving.svg" className={`${ carStatus.parked && "hidden"} absolute z-30 animate-pulse "`}></img>
        <img src={!alert ? "/car/redCar.svg" : !carStatus.parked ? "/car/whiteCar.svg":  "/parkcar.svg"} className={` ${ carStatus.parked ? "left-[180px] top-[170px] " : "left-[206px] top-[350px]  "} absolute z-50 top-[350px]   ${ carStatus.pingCar && "animate-ping"}  `}></img>
      </div>
    </div>  
  );
}
function Right({carStatus, setCarStatus,leftShow}){
  const [trip,setTrip] = useState(1);
  return (
    <div className="w-4/6 h-full border-r2 border-gray300 relative">
        <img src="/map.svg" className="object-cover overflow-hidden z-30 w-full h-full absolute"></img>
{leftShow.exMark && <div className="fixed top-28 right-28 animate-ping text-8xl z-50">⚠️</div>}
{leftShow.drowsy && <div className="fixed top-28 right-28 animate-ping text-8xl z-50">😴</div>}
{leftShow.yawn && <div className="fixed top-28 right-28 animate-ping text-8xl z-50">🥱</div>}

        
        

        {!trip && <img className="object-cover absolute z-50 translate-y-3 translate-x-10 border-2 rounded-l-full rounded-r-full w-[300px] h-[60px] " src="/navigate.svg"></img>}
        { trip &&
          <div className='absolute z-50 '>
          <div className='absolte bg-gray-900 rounded translate-y-36 translate-x-3'>
            {/* <img src="/direction/nav.svg" className="w100"></img> */}
            <img src="/direction/nav row-5.svg" className=" w-72 z-50"></img>
            <img src="/direction/nav row-4.svg" className=" w-72 z-50"></img>
            <img src="/direction/nav row-3.svg" onClick={()=>{ setTrip(0) }} className="hover:bg-gray-800 w-72 z-50"></img>
            <img src="/direction/nav row-2.svg" className=" w-72 z-50"></img>
            <img src="/direction/nav row-1.svg" className=" w-72 z-50"></img>
            
            
            
          </div>
         </div>
        }
    </div>
  );
}
function Bottom({carStatus,setCarStatus}){
  
  return (
  <div className={`${  "bg-gray-900"} w-full space-x-[100px] h-full flex flex-row items-center justify-center` }>
   
        <img src="/car-icon.svg"></img>
        <img src="/cold-icon.svg"></img>
        <img src="/heat-icon.svg"></img>
   
        <img src="/seat-icon.svg"></img>
        <img src="/Fan-icon.svg"></img>
        {/* <img src="/steering.svg"></img> */}
        
      <div className='  h-full'>
        <div className='flex flex-row opacity-90 space-x-10 items-center text-center -400 h-full justify-center'>
          <div>
            <button onClick={()=>{ setCarStatus({...carStatus,maxSpeed:carStatus.maxSpeed-1}) }}>
              <img src="/arrow.svg" className="rotate-180"></img>
            </button></div>
          <div className="text-5xl  font-medium">{carStatus.maxSpeed+1}<br></br><p className="text-xl font-normal"><img src="/speed-limit.svg"></img></p></div>
          <div><button onClick={()=>{ setCarStatus({...carStatus,maxSpeed:carStatus.maxSpeed+1}) }}>
             <img src="/arrow.svg" className="rota"></img>
            
            </button></div>
        </div>

      </div>

      
        <img src="/seat-icon1.svg"></img>
        <img src="/music-icon.svg"></img>
        <img src="/phone-icon.svg"></img>
  </div>)
}