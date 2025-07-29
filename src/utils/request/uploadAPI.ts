import axios from 'axios';
import { validateFile } from '../validate';

export const uploadBookAPI = (
  file: File,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  if (!validateFile(file)) {
    throw new Error('Invalid file type or size');
  }

  const formData = new FormData();
  formData.append('file', file);

  return axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

// 分片上传实现
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadBookChunked = async (
  file: File,
  onUploadProgress?: (progress: number) => void
) => {
  if (!validateFile(file)) {
    throw new Error('Invalid file type or size');
  }

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedChunks = 0;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file.name);

    await axios.post('/api/upload-chunk', formData);

    uploadedChunks++;
    if (onUploadProgress) {
      onUploadProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }
  }

  return axios.post('/api/merge-chunks', {
    fileName: file.name,
    totalChunks,
  });
};