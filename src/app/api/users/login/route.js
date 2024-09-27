import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function POST(request){

    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        // console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400});
        }
        // console.log(user);
        
        //create token data
        const tokenData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email
        }
        //create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"});
        user.password = undefined;
        const response = NextResponse.json({
            message: "Login successful",
            user,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}