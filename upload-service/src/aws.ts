import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "mohit-vercel-aws",
        Key: fileName,
    }).promise();
    console.log(response);
}