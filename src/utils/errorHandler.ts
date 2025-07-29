import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export const handleUploadError = (error: AxiosError | Error) => {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    
    if (axiosError.code === 'ECONNABORTED') {
      toast.error('上传超时，请检查网络后重试');
    } else if (axiosError.response?.status === 413) {
      toast.error('文件大小超过服务器限制');
    } else {
      toast.error('上传失败: ' + axiosError.message);
    }
  } else {
    toast.error('上传失败: ' + error.message);
  }
};

export const retryUpload = async (
  file: File,
  uploadFn: (file: File) => Promise<any>,
  maxRetries = 3
) => {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await uploadFn(file);
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
};