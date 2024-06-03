import React, { useState, useRef } from 'react';

const OutputFolder = ({label, onFolderChange, folder, setFolder}) => {
    const inputRef = useRef(null);
    const [selectedFolder, setSelectedFolder] = useState('');

    const handleClick = () => {
      if (folder) {
        setFolder(null);
        onFolderChange(null); // Limpiar el inputText al quitar el archivo
        inputRef.current.value = null;
      } else {
        inputRef.current.click();
      }
    };

    const handleFolderSelection = (event) => {
        const folderPath = event.target.files[0].path;
        setSelectedFolder(folderPath);
    };

    return (
        <div className='file-input'>
            <label>{label}</label>
            <input
                type="file"
                id="folderInput"
                ref={inputRef}
                webkitdirectory="directory multiple"
                onChange={handleFolderSelection}
                style={{ display: 'none' }}
            />
            {folder && <p>Carpeta seleccionada {folder.name}</p>}
            <button onClick={handleClick} className={`custom-file-button ${folder ? 'remove-button' : ''}`}>
              {folder ? 'Quitar archivo' : 'Seleccionar carpeta'}
            </button>
        </div>
    );
};

export default OutputFolder;