import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required : [true,"Room name is required"],
            trim : true,
        },
        block :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Block",
            required : [true,"Block is required"],
        },
        capacity : {
            type : Number,
            required : [true , "capacity is required"],
            min : [1,"capacity must be atleast 1"],
        },
        allowedPurposes:{
            type : [String],
            enum : ['OA','Interview','PPT'],
            default : ['OA','Interview','PPT'],
        },
        isAvailable :{
            type : Boolean,
            default : true,
        },
        notes :{
            type : String,
            trim : true,
        }
    },
    {timestamps : true},
)

roomSchema.index(
    {name : 1,block : 1},
    {unique : true}
);

const Room = mongoose.model("Room",roomSchema);
export default Room;