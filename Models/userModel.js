import mongoose from "mongoose";



const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    fullname: { type: String, required: true },
    email:{
        type:String,    
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileimg:{
        type:String,
        default:""
    },
    coverImg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
         type:String,
        default:""
    }
},{timestamps:true});

 const User = mongoose.model("User",authSchema);

 export default User;