const { default: mongoose } = require("mongoose")
const monggose = require("mongoose")
const storySchema=new mongoose.Schema({
    mediaUrl:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    expiresAt:{
        type:Date,
        required:true
    },

},
{timestamps:true}
)

storySchema.index({expiresAt:1},{expireAfterSeconds:0})

module.exports=mongoose.model("Story",storySchema)