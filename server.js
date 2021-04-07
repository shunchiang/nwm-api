const express = require("express");
const rateLimit = require("express-rate-limit");



const {configurationRouter} = require("./routes/configurationRouter");
const itemRouter = require("./routes/itemRouter");


const server = express();
server.use(express.json());

//config memory

/* because we lack a DB we are saving to local memory but in production this is bad practice */

global.configuration = {

}

// request is an array of objects detailing what limitations each client has
global.request = []

// sets current client so we can dynamically read their most current rates/limit

client = "";

//middleware functions

function logger(req, res, next) {
    const method = req.method;
    const endpoint = req.originalUrl;
  
    console.log(`${method} to ${endpoint}`);
    next();
  }

function getCurrentClient(req,res,next){
    if(req.get("client-id")){
        client = global.request.filter(e=>e.clientId === req.get("client-id"))[0];
        console.log("CURRENT CLIENT", client)
        next();
    }else{
        res.status(404).json({
            message: "clientId needed in header"
        })
    }
}

const rateLimiter = rateLimit({

    windowMs: client !== "" ? client.seconds * 1000 : 1000

    ,
    
    max: (req,res)=>{
        if(global.request.filter(e=>e.clientId === req.get("client-id")).length>0){
            let matchLimit = global.request.filter(e=>e.clientId === req.get("client-id"))[0].limit;
            console.log("SUCCESS in LIMIT!!!", matchLimit);
            return matchLimit;
        }else{
            console.log("HIT DEFAULT", global.request.filter(e=>e.clientId === req.get("client-id")))
            return 1;
        }        
    }
  });
  





server.use("/configure", logger, getCurrentClient, configurationRouter);
server.use("/", logger, getCurrentClient, rateLimiter, itemRouter);





module.exports = server;