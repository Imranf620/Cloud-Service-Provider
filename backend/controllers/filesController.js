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

export const getAllFiles = catchAsyncError(async (req, res, next) => {
  const { orderBy, orderDirection = "asc" } = req.query;
  console.log("order by", orderBy, orderDirection)



  
  const validOrderByFields = {
    date: "createdAt",
    name: "name",
    size: "size",
  };

  const orderField = validOrderByFields[orderBy] || "createdAt"; 

  const userId = req.user;
  const files = await prisma.file.findMany({
    where: {
      userId,
    },
    orderBy: {
      [orderField]: orderDirection.toLowerCase() === "desc" ? "desc" : "asc",
    },
    include: {
      trash: true,
    },
  });

  const withoutTrash = files.filter(file => file.trash.length === 0);
  

  return apiResponse(true, "Files retrieved successfully", withoutTrash, 200, res);
});

export const getVideoFiles = catchAsyncError(async (req, res, next) => {
  const { orderBy, orderDirection = "asc" } = req.body;
  const userId = req.user;
  const videoMimeTypes = ["video/mp4", "video/mkv", "video/avi"];

  const validOrderByFields = {
    date: "createdAt",
    name: "name",
    size: "size",
  };

  const orderField = validOrderByFields[orderBy] || "createdAt";

  const videos = await prisma.file.findMany({
    where: {
      userId,
      type: { in: videoMimeTypes },
    },
    orderBy: {
      [orderField]: orderDirection.toLowerCase() === "desc" ? "desc" : "asc",
    },
  });

  return apiResponse(true, "Video files retrieved successfully", videos, 200, res);
});

export const getImageFiles = catchAsyncError(async (req, res, next) => {
  const { orderBy, orderDirection = "asc" } = req.body;
  const userId = req.user;
  const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const validOrderByFields = {
    date: "createdAt",
    name: "name",
    size: "size",
  };

  const orderField = validOrderByFields[orderBy] || "createdAt";

  const images = await prisma.file.findMany({
    where: {
      userId,
      type: { in: imageMimeTypes },
    },
    orderBy: {
      [orderField]: orderDirection.toLowerCase() === "desc" ? "desc" : "asc",
    },
    include: {
      trash: true,
    },
  });

  const withoutTrash = images.filter(image => image.trash.length === 0);

  return apiResponse(true, "Image files retrieved successfully", withoutTrash, 200, res);
});

export const getDocumentFiles = catchAsyncError(async (req, res, next) => {
  const { orderBy, orderDirection = "asc" } = req.body;
  const userId = req.user;
  const documentMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validOrderByFields = {
    date: "createdAt",
    name: "name",
    size: "size",
  };

  const orderField = validOrderByFields[orderBy] || "createdAt";

  const documents = await prisma.file.findMany({
    where: {
      userId,
      type: { in: documentMimeTypes },
    },
    orderBy: {
      [orderField]: orderDirection.toLowerCase() === "desc" ? "desc" : "asc",
    },
    include: {
      trash: true,
    },
  });

  const withoutTrash = documents.filter(document => document.trash.length === 0);

  return apiResponse(true, "Document files retrieved successfully", withoutTrash, 200, res);
});

export const getOtherFiles = catchAsyncError(async (req, res, next) => {
  const { orderBy, orderDirection = "asc" } = req.body;
  const userId = req.user;
  const excludedMimeTypes = [
    "video/mp4", "video/mkv", "video/avi", // Video types
    "image/jpeg", "image/png", "image/gif", "image/webp", // Image types
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Document types
  ];

  const validOrderByFields = {
    date: "createdAt",
    name: "name",
    size: "size",
  };

  const orderField = validOrderByFields[orderBy] || "createdAt";

  const others = await prisma.file.findMany({
    where: {
      userId,
      NOT: { type: { in: excludedMimeTypes } },
    },
    orderBy: {
      [orderField]: orderDirection.toLowerCase() === "desc" ? "desc" : "asc",
    },
    include: {
      trash: true,
    },
  });

  const withoutTrash = others.filter(other => other.trash.length === 0);

  return apiResponse(true, "Other files retrieved successfully", withoutTrash, 200, res);
});



export const getLatestFiles = catchAsyncError(async(req,res,next)=>{
  const userId = req.user;
  const latestFiles = await prisma.file.findMany({
    where:{
      userId
    },
    orderBy:{
      createdAt: "desc",
    },
    take:10,
    include:{
          trash:true,
    }
  })



  const withoutTrash = latestFiles.filter(file => file.trash.length === 0);

  return apiResponse(true, "Latest files retrieved successfully", withoutTrash, 200, res);
})


export const editFileName = catchAsyncError(async(req,res,next)=>{
  const {fileId, newName} = req.body;
  const userId = req.user;
  if (!fileId || !newName) {
    return apiResponse(false, "File ID and new name are required", null, 400, res);
  }

  const file = await prisma.file.findFirst({
    where:{
      id:fileId,
      userId
    }
  })

  if(!file){
    return apiResponse(false, "File not found", null, 404, res);
  }

  const updatedFile = await prisma.file.update({
    where:{
      id:fileId
    },
    data:{
      name:newName
    }
  })

  return apiResponse(true, "File name updated successfully", updatedFile, 200, res);
})


export const deleteFile= catchAsyncError(async(req,res,next)=>{

  const {fileId} = req.query;
  const userId = req.user;
  if (!fileId) {
    return apiResponse(false, "File ID is required", null, 400, res);
  }

  const file = await prisma.file.findFirst({
    where:{
      id:fileId,
      userId
    }
  })

  if(!file){
    return apiResponse(false, "File not found", null, 404, res);
  }

  await prisma.file.delete({
    where:{
      id:fileId
    }
  })

  return apiResponse(true, "File deleted successfully", null, 200, res);
})