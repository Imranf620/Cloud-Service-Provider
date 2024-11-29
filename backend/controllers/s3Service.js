import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.BUCKET_NAME;

export const generatePresignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${fileName}`,
    ContentType: fileType,
    Expires: 3600, 
  };

  const command = new PutObjectCommand(params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};