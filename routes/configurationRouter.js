const express = require("express");

const configurationRouter = express.Router();



configurationRouter.post("/",(req,res)=>{
    console.log("headers", req.headers);
    console.log("body", req.body);

    let clients = req.body.clients;
    let routes = req.body.routes;

    //set request body to memory for configuration
    global.configuration = req.body;

    
    console.log("CONFIG", configuration);


    if(!req.get("client-id")){
        res.status(400).json({
            message: "no client ID in header"
        });
    }

    if(clients.length === 0 || routes.length === 0){
        res.sendStatus(200);
    }

    if(!configuration.clients[0].clientId && req.get("client-id")){
        res.status(403).json({
            message: "client ID in header but not in configuration body"
        })
    }

    if(typeof clients === 'undefined' || typeof routes === 'undefined' ){
        res.sendStatus(400);
    }

    
    //check if sourcePath or destination is missing in payload

    if(!configuration.routes[0].sourcePath || !configuration.routes[0].destinationUrl){
        res.status(400).json({
            message: "no sourcePath or destination specified"
        });
    }


    //set limits to 1 if there are none
    if(!configuration.clients[0].limit){
        configuration.clients[0].limit = 1;
    };

    if(!configuration.clients[0].seconds){
        configuration.clients[0].seconds = 1;
    };

    // checks to see if client exists in global request array and adds if it doesn't

    if(global.request.length === 0){
        global.request.push(req.body.clients[0]);
        console.log("REQ array", global.request);
    }else if(global.request.filter(e=>e.clientId === configuration.clients[0].clientId).length===0){
        global.request.push(req.body.clients[0]);
    }
    // replaces the object in our requests array with an updated object with updated values if one is sent
    else if(global.request.filter(e=>e.clientId === configuration.clients[0].clientId).length===1){
        let index = global.request.findIndex(i=>i.clientId === configuration.clients[0].clientId);

        global.request.splice(index,1,req.body.clients[0]);
        console.log("Successfully replaced with new client configs");
    }
    



    res.status(200).json({
        message: "all clear"
    });
    
    
})

module.exports = {configurationRouter};
