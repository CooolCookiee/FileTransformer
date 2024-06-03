import React, { useRef } from 'react';

function FileInput({ label, onFileChange, file, setFile, setInputText, onFileRemove }) {
    const inputRef = useRef(null);

    const handleClick = () => {
      if (file) {
        setFile(null);
        onFileChange(null); // Limpiar el inputText al quitar el archivo
        inputRef.current.value = null;
      } else {
        inputRef.current.click();
      }
    };
  
    const handleChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      onFileChange(selectedFile); // Pasar el archivo seleccionado al componente padre
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
      {file && <p>Archivo seleccionado: {file.name}</p>}
      <button onClick={handleClick} className={`custom-file-button ${file ? 'remove-button' : ''}`}>
        {file ? 'Quitar archivo' : 'Seleccionar archivo'}
      </button>
    </div>
  );
}

export default FileInput;
