import apiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

export const isAuthenticated =  (req, res, next) => {
    const {token} = req.cookies

    if(!token){
        return apiResponse(false, "Please login to access this page", null, 400, res)
    }

    const decodedData  =  jwt.verify(token, process.env.JWT_SECRET)
    if(!decodedData){
        return apiResponse(false, "Invalid token", null, 401, res)
    }
    req.user = decodedData.id
    next()

}