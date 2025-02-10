
const Listing = require("../models/listing.js");
const initdata = require("./data.js");
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/WanderLust"
main().then(()=>{
    console.log("MongoDb Connected");
}).catch(()=>{
    console.log("MongoDb Not Connected");
})
async function main(){
    try{
       await  mongoose.connect(MONGO_URI);
    }catch(e){
        console.log(e);
    }
}


const initDb = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data Inserted Successfully");
}


initDb();
