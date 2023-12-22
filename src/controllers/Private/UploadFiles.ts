import { S3 } from "aws-sdk";
import fs from 'fs';

const AWS_ACCESS_KEY_ID="AKIAW3FJESSL53PE2I75";
const AWS_SECRET_ACCESS_KEY="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";
const BUCKET_NAME="files_finantek";

export const s3 = new S3({
    accessKeyId:AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

export const initBucket = async (s3: S3) => {
    const bucketStatus = await checkBucket(s3, BUCKET_NAME);
}

export const checkBucket = async(s3: S3, bucket: string) => {
    try {
        const res = await s3.headBucket({Bucket: bucket}).promise()
      
            console.log("Bucket already Exist", res.$response.data);
      
            return { success: true, message: "Bucket already Exist",data: {}};
      
        } catch (error) {
      
            console.log("Error bucket don't exsit", error);
      
            return { success: false, message: "Error bucket don't exsit",data: error };
      
        }
}

export const uploadToS3 = async (s3: S3, fileData?: Express.Multer.File) => {
    console.log(fileData);
    try {

    const fileContent = fs.readFileSync(fileData!.path);
  
        const params = {
          Bucket: BUCKET_NAME,
          Key: fileData!.originalname,
          Body: fileContent
        };
  
        try {
          const res = await s3.upload(params).promise();
  
          console.log("File Uploaded with Successfull", res.Location);
  
          return {success: true, message: "File Uploaded with Successfull", data: res.Location, status: 200};
        } catch (error) {
          return {success: false, message: "Unable to Upload the file", data: error, status: 400};
        }
  
    } catch (error) {
        console.log(error);
    return {success:false, message: "Unalbe to access this file", data: {}, status: 500};
    }
    }