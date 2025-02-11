import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export type CloduinaryResponse = UploadApiResponse | UploadApiErrorResponse;
