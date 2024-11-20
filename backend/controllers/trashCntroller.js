import catchAsyncError from "../middleware/catchAsyncErrors.js";
import apiResponse from "../utils/apiResponse.js";
import prisma from "../utils/prisma.js";

export const moveToTrash = catchAsyncError(async (req, res, next) => {
  const { docId } = req.params;
  const userId = req.user;

  // Find the file and ensure it belongs to the current user
  const file = await prisma.file.findFirst({
    where: {
      id: docId,
      userId,
    },
  });

  if (!file) {
    return apiResponse(
      false,
      "File not found or access denied",
      null,
      404,
      res
    );
  }

  console.log("Moving file to trash, fileId:", file.id); // Log the fileId

  const trashedFile = await prisma.trash.create({
    data: {
      fileId: file.id,
    },
    include: {
      file: true,
    },
  });

  // await prisma.file.delete({
  //     where:{
  //         id:file.id
  //     }
  // })

  console.log("File moved to trash:", trashedFile); // Log the result

  return apiResponse(
    true,
    "File moved to trash and deleted successfully",
    trashedFile,
    200,
    res
  );
});

// Retrieve trashed files
export const getTrashedFiles = catchAsyncError(async (req, res, next) => {
  const userId = req.user;

  // Fetch trashed files and include related file details
  const trashedFiles = await prisma.trash.findMany({
    where: {
      file: {
        userId, // Ensure this is used to fetch only the user's files
      },
    },
    include: {
      file: true, // Include related file details
    },
  });

  return apiResponse(
    true,
    "Trashed files retrieved successfully",
    trashedFiles,
    200,
    res
  );
});

export const deleteExpiredTrashedFiles = catchAsyncError(
  async (req, res, next) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find and delete files older than 30 days in trash
    const deletedFiles = await prisma.trash.deleteMany({
      where: {
        deletedAt: {
          lte: thirtyDaysAgo,
        },
      },
    });

    return apiResponse(
      true,
      "Expired trashed files deleted successfully",
      deletedFiles,
      200,
      res
    );
  }
);

export const restoreFromTrash = catchAsyncError(async (req, res, next) => {
  const { trashId } = req.params;
  const userId = req.user;

  const trashedEntry = await prisma.trash.findFirst({
    where: {
      id: trashId,
      file: {
        userId,
      },
    },
    include: {
      file: true,
    },
  });

  if (!trashedEntry || !trashedEntry.file) {
    return apiResponse(
      false,
      "Trashed file not found or access denied",
      null,
      404,
      res
    );
  }

  const restoredFile = await prisma.trash.delete({
    where: {
      id: trashId,
    },
  });

  return apiResponse(
    true,
    "File restored successfully",
    restoredFile,
    200,
    res
  );
});

export const deleteFileFromTrash = catchAsyncError(async (req, res, next) => {
  const { trashId } = req.params;
  const userId = req.user;

  const trashedEntry = await prisma.trash.findFirst({
    where: {
      id: trashId,
      file: {
        userId,
      },
    },
    include: {
      file: true,
    },
  });

  if (!trashedEntry || !trashedEntry.file) {
    return apiResponse(
      false,
      "Trashed file not found or access denied",
      null,
      404,
      res
    );
  }

  await prisma.trash.delete({
    where: {
      id: trashId,
    },
  });

  await prisma.file.delete({
    where: {
      id: trashedEntry.fileId,
    },
  });

  return apiResponse(true, "Deleted successfully", null, 200, res);
});
