import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        room :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Room',
            required : [true,"Room is required"]
        },
        bookedBy :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            reuired : true,
        },
        date :{
            type : Date,
            required :[true,"Date is needed"],
        },
        startTime : {
            type : String,
            required : [true ,"Start time is needed"],
            match : [/^([01]\d|2[0-3]):([0-5]\d)$/,
        'Time must be in HH:MM format',]
        },
        endTime : {
            type : String,
            required : [true,"End time is required"],
            match : [ /^([01]\d|2[0-3]):([0-5]\d)$/,
        'Time must be in HH:MM format']
        },
        purpose :{
            type : String ,
            enum : ['OA','Interview','PPT'],
            required : true,
        },
        participantCount : {
            type : Number,
            required : [true,"particpant count is needed"],
            min : [1,"Atleast 1 participant needed"],
        },
        companyName :{
            type : String,
            trim : true,
        },
        status :{
            type : String,
            enum : ['confirmed','cancelled'],
            default : 'confirmed',
        },
        cancelledBy :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        cancelReason :{
            type:String,
            trim : true,
        },
        notes : {
            type:String,
            trim:true,
        },
    },
    {timestamps : true}
);

bookingSchema.statics.hasconflict = async function(roomId,date,startTime,endTime,excludeBookingTime = null){
    const bookingDate = new Date(date);

    bookingDate.setHours(0,0,0,0);
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
        room :roomId,
        status : 'confirmed',
        date :{
            $gte : bookingDate,
            $lt : nextDay,
        },
        $or :[
            {
                startTime : { $lte : startTime},
                endTime : { $gt : startTime},
            },
            {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime },
            },
            {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime },
            },
        ],
    };
    if(excludeBookingId){
        query._id = { $ne : excludeBookingId};
    }

    const conflict = await this.findOne(query);
    return conflict;
};

const Booking = mongoose.model("Booking",bookingSchema);
export default Booking;