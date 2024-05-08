const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jobsHistorySchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        maxlength: 70,
    },

    description: {
        type: String,
        trim: true
    },
    salary: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
    },
    interviewDate: {
        type: Date,
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },

    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },



}, { timestamps: true })


const userScheme = mongoose.Schema({
    firstName: {
        type:String,
        trim : true,
        required: [true, 'first name is required'],
        maxlength: 32,
    },
    lastName: {
        type:String,
        trim : true,
        required: [true, 'last name is required'],
        maxlength: 32,
    }, 
    email: {
        type:String,
        trim : true,
        required: [true,'email is required'],
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             'Please fill a valid email address'
        ]
    }, 
    password: {
        type:String,
        trim : true,
        required: [true,'password is required'],
        minlength: [6,'password must have (6) characters'],
    },  

    jobsHistory: [jobsHistorySchema],
    
    role:{
        type:Number,
        default:0,
    }
},{timestamps:true})
 
//encrypting the password before saving
userScheme.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this.password,10)
})

// compare user password
userScheme.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

// return a JWT token 
userScheme.methods.getJwtToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn: 3600
    });
}


module.exports = mongoose.model("User",userScheme );