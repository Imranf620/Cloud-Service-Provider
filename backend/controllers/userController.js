import catchAsyncError from "../middleware/catchAsyncErrors.js";
import apiResponse from "../utils/apiResponse.js";
import prisma from "../utils/prisma.js";

export const register = catchAsyncError( async(req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return apiResponse(false, "Please fill all required fields", null, 400, res);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validateEmail = (email) => {
        return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
        return apiResponse(false, "Please enter a valid email address", null, 400, res);
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });

    console.log(user);

    apiResponse(true, "User created successfully", user, 201, res);
});
