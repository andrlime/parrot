
export interface IUploadedFile {
    fileName: string;
    fileContent: string;
    content?: string;
    awsS3Key?: string;
    audioS3Key?: string;
}