const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");

const {User} = require("../Models/userModel");
const Otp = require("../Models/otpModel");

module.exports.RegisterUser = async(data) => {
    try {
        const user = await User.findOne({
            number: data.number
        });
        if(user) return {success: false,message: "User already registered!"};
    
        const OTP = otpGenerator.generate(6,{
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const number = data.number;
        console.log(OTP);

        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(OTP,salt); 
        const newOtp = new Otp({number: number, otp: hashedOtp});
        const result = await newOtp.save();
        return {success: true,message: "OTP sent successfully"};
    } catch (error) {
        console.log(error.message);
        return {success: false, message: error}
    }
}

module.exports.RegisterOtp = async (data) => {
    try {
        const otpHolder = await Otp.find({
            number: data.number,
        });
        if (otpHolder.length === 0 ) return {success: false, message: "You used an expired OTP!"};
        const righteOtpFind = otpHolder[otpHolder.length - 1];
        const validateUser = await bcrypt.compare(data.otp,righteOtpFind.otp);
        console.log(validateUser);
        if(righteOtpFind.number === data.number && validateUser){
            const user = new User(_.pick(data,["number"]));
            const token = user.generateJWT();
            const result = await user.save();
            const OTPDelete =  await Otp.deleteMany({
                number: righteOtpFind.number
            });

            return {success: true,
                message: "User Registeration Successfull!",
                token: token,
                data: result
                }
        }else{
            return {success: false, message: "Otp was wrong" }
        }
    } catch (error) {
        console.log(error);
        return {success,message: error}
    }
}
