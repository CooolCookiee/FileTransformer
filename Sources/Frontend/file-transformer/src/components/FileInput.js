import React, { useRef } from 'react';

function FileInput({ label, onFileChange, file, setFile, onFileRemove, acceptedExtensions }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (file) {
      window.location.reload();
    } else {
      inputRef.current.click();
    }
  };

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (acceptedExtensions.includes(fileExtension)) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    } else {
      alert(`Tipo de archivo no válido. Por favor, selecciona un archivo ${acceptedExtensions.join(' o ')}.`);
      event.target.value = null; // Limpiar el input
    }
  };
  
  return (
    <div className="file-input">
      <label>{label}</label>
      <input
        type="file"
        onChange={handleChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      {file && <p>Archivo seleccionado {file.name}</p>}
      <button onClick={handleClick} className={`custom-file-button ${file ? 'remove-button' : ''}`}>
        {file ? 'Quitar archivo' : 'Seleccionar archivo'}
      </button>
    </div>
  );
}

export default FileInput;
