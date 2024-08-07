const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = () => {

     mongoose.connect( process.env.MONGODB_URL)
        
     .then( () => console.log(`Database Connected & Running Successfully...`) )

     .catch( (error) => {
             console.log(`Error ::: DB Connection Issue`)
             console.log(error)
             process.exit(1)
     })
     
}