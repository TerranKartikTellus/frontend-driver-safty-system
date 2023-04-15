export default async function handler(req, res) {
  const { flag } = await req.body;
  
  const d = new Date();
  // console.log(flag==undefinetd?"0":"1");
  let time = d.getTime();
  // let date = 
  // if (flag==undefined){
  //   flag=0
  // }
  // let dc1=

    flag==1 && console.log(`${time} : Drowsy : ${flag==1?1:0}`)
    await res.json({ 'drowsy': flag==1?1:0, 'time': time });
  
}