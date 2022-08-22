const {RegisterUser,RegisterOtp} = require("../Services/userService");

module.exports.signUp = async(req,res) => {
    try {
        const newUser = await RegisterUser(req.body);
        const {success, message} = newUser;
        if(success){
            res.status(201).json({success,message})
        }else{
            res.status(404).json({success,message})
        }
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports.verifyOtp = async(req,res) => {
    try {
        const newOtp = await RegisterOtp(req.body);
        const {success} = newOtp;
        if(success){
            res.status(200).json(newOtp);
        }else{
            res.status(400).json(newOtp)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
};