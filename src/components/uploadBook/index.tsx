import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadBook } from '../../store/actions/uploadActions';
import './style.css';

const UploadBook = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      dispatch(uploadBook(file, setProgress));
    }
  };

  return (
    <div className="upload-container">
      <input type="file" accept=".epub,.pdf,.mobi" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        上传电子书
      </button>
      {progress > 0 && <progress value={progress} max="100" />}
    </div>
  );
};

export default UploadBook;