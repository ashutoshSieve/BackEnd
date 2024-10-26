require("dotenv").config();
const mongoose=require("mongoose");
mongoose.connect(process.env.URL);

const UserSchema=mongoose.Schema({
    name:String,
    password:String,
    User:[
        {
            name:String
        }
    ]
});
const User=mongoose.model("User",UserSchema);
module.exports=User;