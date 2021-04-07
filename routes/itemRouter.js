const express = require("express");

const router = express.Router();


router.get("/:item", validateRoute,(req,res)=>{
    
        console.log("get from items route", global.configuration);

        res.status(302).json({
            message: "You did it!"
        })
    
})
//middleware to handle invalid match

function validateRoute(req,res,next){
    const body = req.body;
    !body || body === {}
    ? res.status(400).json({ message: "post not included" })
    : req.params.item !== global.configuration.routes[0].sourcePath.replace('/', '')
    ? res.status(404).json({message: "sourcePath match not found"})
    : next();
}

module.exports = router;
