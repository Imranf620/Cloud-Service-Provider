import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export const getPresignedUrl = async (req, res) => {
  const userId = req.user;
  console.log(`getPresignedUrl for user: ${userId}`);
  
  try {
    const { fileName, fileType ,profile} = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: 'File name and type are required.' });
    }

    const listParams = {
      Bucket: process.env.BUCKET_NAME || 'cloudstorageimranf620.dev',
      Prefix: `uploads/user-upload/${userId}-`,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const data = await s3Client.send(listCommand);
    console.log("Existing files:", data);

    if (data.Contents && data.Contents.length > 0 && profile) {
      const existingFile = data.Contents[0];  

      console.log("Existing file:", existingFile);

      if (existingFile) {
        console.log(`Deleting existing file: ${existingFile.Key}`);
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME || 'cloudstorageimranf620.dev',
          Key: existingFile.Key,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);
        console.log('Existing file deleted.');
      }
    }

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME || 'cloudstorageimranf620.dev',
      Key: `uploads/user-upload/${userId}-${fileName}`,
      ContentType: fileType,
    };

    const putCommand = new PutObjectCommand(uploadParams);
    const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 });

    // Generate a download URL for the file
    const downloadParams = {
      Bucket: process.env.BUCKET_NAME || 'cloudstorageimranf620.dev',
      Key: `uploads/user-upload/${userId}-${fileName}`,
      ACL: 'public-read',
    };

    const getCommand = new GetObjectCommand(downloadParams);
    const downloadUrl = await getSignedUrl(s3Client, getCommand);

    res.status(200).json({ url:uploadUrl, downloadUrl });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ message: 'Error generating pre-signed URL' });
  }
};


