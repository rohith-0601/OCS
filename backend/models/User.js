import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, "Name is required"],
        trim : true,
    },
    email :{
        type : String,
        required : [true,"Email id is required"],
        unqiue : true,
        lowercase : true,
        trim : true,
        matches: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password :{
        type : String,
        required : true,
        minlength : 6,
        select : false
    },
    role :{
        type : String,
        enum : ['admin','core','viewer'],
        default : 'viewer',
    },
    department : {
        type : String,
        trim : true,
    },
    isActive :{
        type : Boolean,
        default : true,
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

},{timestamps : true});

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password,12);
    next();
});

userSchema.methods.matchPassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
}

export default mongoose.model("User",userSchema);