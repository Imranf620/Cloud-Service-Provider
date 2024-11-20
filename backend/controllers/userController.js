import catchAsyncError from "../middleware/catchAsyncErrors.js";
import apiResponse from "../utils/apiResponse.js";
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return apiResponse(
      false,
      "Please fill all required fields",
      null,
      400,
      res
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  if (!validateEmail(email)) {
    return apiResponse(
      false,
      "Please enter a valid email address",
      null,
      400,
      res
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

 delete user.password;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES,
  });

  res
    .status(201)
    .cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User created successfully",
      data:user,
    });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return apiResponse(
      false,
      "Please fill all required fields",
      null,
      400,
      res
    );
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  if (!validateEmail(email)) {
    return apiResponse(
      false,
      "Please enter a valid email address",
      null,
      400,
      res
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return apiResponse(false, "User not found", null, 401, res);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return apiResponse(false, "Invalid credentials", null, 401, res);
  }

 delete user.password;


  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES,
  });
  res
    .status(201)
    .cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged in successfully",
      data:user
    });
});


export const logout = catchAsyncError(async (req,res,next) =>{
     res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    apiResponse(true, "logged out successfully", null, 200, res);
})


export const updateUser = catchAsyncError(async (req,res,next)=>{
    const id = req.user;
    const { name, email } = req.body;

  

    const user = await prisma.user.update(
        {
            where:{id},
            data: {
                name,
                email
            }
        }
    )

    delete user.password;

    apiResponse(true, "profile updated successfully", user, 200, res);
})

export const updatePassword = catchAsyncError(async(req,res,next)=>{
    const id = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where:{id}
    })
    
    if(!user){
        return apiResponse(false, "User not found", null, 401, res);
    }

    const isPassMatched = await bcrypt.compare(oldPassword, user.password);
    if(!isPassMatched){
        return apiResponse(false, "Invalid credentials", null, 401, res);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

 await prisma.user.update({
        where:{id},
        data:{
            password:hashedPassword
        }
    })


    apiResponse(true, "Password updated successfully", null, 200, res);
})

export const fetchMyProfile= catchAsyncError(async(req,res,next)=>{
   const id = req.user;
   const user = await prisma.user.findUnique({
       where:{id}
   })

   delete user.password;

   apiResponse(true, `Welcome ${user.name}`, user, 200, res);
})