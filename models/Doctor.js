import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    department:{
        type:String,
        enum:["Hair","Skin","Dentistry"],
        required:true
    },

    qualification:{
        type:String,
        required:true
    },

    experience:{
        type:Number,
        required:true
    },

    fee:{
        type:Number,
        required:true
    },

    availableDays:{
        type:String,
        required:true
    },

    availableTime:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["verified","unverified"],
        default:"verified"
    }

},
{
    timestamps:true
});

export default mongoose.model("Doctor",doctorSchema);