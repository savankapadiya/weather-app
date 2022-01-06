const http = require("http");

const fs = require('fs');
const requests = require("requests");

const homefile = fs.readFileSync("home.html" , "utf-8");

const replaceVal = (tempval , orgval)=>{
  let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
   temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
   temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
   temperature = temperature.replace("{%country%}", orgval.name);
   temperature = temperature.replace("{%location%}", orgval.sys.country);
   temperature = temperature.replace("{%tempStatus%}", orgval.weather[0].main);

  return temperature;
};
const server = http.createServer((req,res)=>{
    if(req.url == "/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=delhi&appid=7ac4a6bc269cd1839ba48c541216ffe8")
    .on("data",(chunk) =>{
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        
        const realtimedata = arrdata.map((val) => replaceVal(homefile, val)).join("");
            res.write(realtimedata);
            // console.log(realtimedata);
            
    })
    .on ("end" , (err) =>{
        if(err) return console.log("connection closed due to errors", err);
       
        res.end();
    });
}
});


server.listen(5000);