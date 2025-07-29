const ALLOWED_TYPES = ['application/epub+zip', 'application/pdf', 'application/x-mobipocket-ebook'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const validateFile = (file: File): boolean => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return false;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return false;
  }
  
  return true;
};

export const getFileTypeError = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '仅支持EPUB/PDF/MOBI格式';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return '文件大小不能超过100MB';
  }
  
  return null;
};