import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileURL, setSelectedFileURL] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileURL = URL.createObjectURL(file);

      setSelectedFileURL(fileURL);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} accept="image/*" />

      {selectedFileURL ? (
        <img src={selectedFileURL} alt="Imagem do estabelecimento" />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
          <span>
            Arraste e solte um arquivo aqui, ou clique para selecioná-lo
          </span>
        </p>
      )}
    </div>
  );
};

export default Dropzone;
