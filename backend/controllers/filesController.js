import catchAsyncError from "../middleware/catchAsyncErrors.js";
import apiResponse from "../utils/apiResponse.js";
import prisma from "../utils/prisma.js";

export const uploadFile = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return apiResponse(false, "No file uploaded", null, 400, res);
  }

  const { customName, originalname, path: filePath, size, mimetype } = req.file;
  const userId = req.user;
  

  const file = await prisma.file.create({
    data: {
      name: originalname, 
      size: size,
      type: mimetype,
      path: `uploads/${customName}`, 
      userId,
      private: true,
    },
  });

  return apiResponse(true, "File uploaded successfully", file, 200, res);
});

export const getAllFiles = catchAsyncError(async(req,res,next)=>{

  const userId = req.user;
  const files = await prisma.file.findMany({
    where:{
      userId
    },
    include:{
      trash:true,
    }
  })

  const withoutTrash = files.filter(file=>file.trash.length==0)

  return apiResponse(true, "Files retrieved successfully", withoutTrash, 200, res);
})



export const getVideoFiles = catchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const videoMimeTypes = ["video/mp4", "video/mkv", "video/avi"];
  const videos = await prisma.file.findMany({
    where: {
      userId,
      type: { in: videoMimeTypes },
    },
  });

  return apiResponse(true, "Video files retrieved successfully", videos, 200, res);
});

export const getImageFiles = catchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const images = await prisma.file.findMany({
    where: {
      userId,
      type: { in: imageMimeTypes },
    },
    include:{
          trash:true,
        }
  });
  const withoutTrash = images.filter(image=>image.trash.length==0)


  return apiResponse(true, "Image files retrieved successfully", withoutTrash, 200, res);
});

export const getDocumentFiles = catchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const documentMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const documents = await prisma.file.findMany({
    where: {
      userId,
      type: { in: documentMimeTypes },
    },
    include:{
          trash:true,
    }

  });

  const withoutTrash = documents.filter(document=>document.trash.length==0)

  return apiResponse(true, "Document files retrieved successfully", withoutTrash, 200, res);
});

export const getOtherFiles = catchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const excludedMimeTypes = [
    "video/mp4", "video/mkv", "video/avi", // Video types
    "image/jpeg", "image/png", "image/gif", "image/webp", // Image types
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Document types
  ];
  const others = await prisma.file.findMany({
    where: {
      userId,
      NOT: { type: { in: excludedMimeTypes } },
    },
    include:{
          trash:true,
    }
  });
  const withoutTrash = others.filter(other=>other.trash.length==0)

  return apiResponse(true, "Other files retrieved successfully", withoutTrash, 200, res);
});
