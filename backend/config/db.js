import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(`Mongo db connected ${connect.connection.host}`);
    }catch(error){
        console.error(`mongo db connection error ${error.message}`);
        process.exit(1);
    };
};

export default  connectDB;