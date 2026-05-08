import mongoose from "mongoose";

const blockschema = mongoose.Schema(
    {
        name :{
            type : String,
            required : [true,"Room name is required"],
            unqiue : true,
            trim : true,
        },
        description :{
            type : String,
            trim : true,
        },
        isActive :{
            type : Boolean,
            default :true,
        },
    },
    {timestamps : true}
);

export default mongoose.model("Block",blockschema);