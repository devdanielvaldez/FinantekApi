"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = exports.checkBucket = exports.initBucket = exports.s3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const AWS_ACCESS_KEY_ID = "AKIAW3FJESSL53PE2I75";
const AWS_SECRET_ACCESS_KEY = "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";
const BUCKET_NAME = "files_finantek";
exports.s3 = new aws_sdk_1.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const initBucket = (s3) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketStatus = yield (0, exports.checkBucket)(s3, BUCKET_NAME);
});
exports.initBucket = initBucket;
const checkBucket = (s3, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield s3.headBucket({ Bucket: bucket }).promise();
        console.log("Bucket already Exist", res.$response.data);
        return { success: true, message: "Bucket already Exist", data: {} };
    }
    catch (error) {
        console.log("Error bucket don't exsit", error);
        return { success: false, message: "Error bucket don't exsit", data: error };
    }
});
exports.checkBucket = checkBucket;
const uploadToS3 = (s3, fileData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(fileData);
    try {
        const fileContent = fs_1.default.readFileSync(fileData.path);
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileData.originalname,
            Body: fileContent
        };
        try {
            const res = yield s3.upload(params).promise();
            console.log("File Uploaded with Successfull", res.Location);
            return { success: true, message: "File Uploaded with Successfull", data: res.Location, status: 200 };
        }
        catch (error) {
            return { success: false, message: "Unable to Upload the file", data: error, status: 400 };
        }
    }
    catch (error) {
        console.log(error);
        return { success: false, message: "Unalbe to access this file", data: {}, status: 500 };
    }
});
exports.uploadToS3 = uploadToS3;
