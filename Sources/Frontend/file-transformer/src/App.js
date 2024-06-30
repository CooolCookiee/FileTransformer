import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import FileInput from './components/FileInput';
import FileDisplay from './components/FileDisplay';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputFilePath, setInputFilePath] = useState(null);
  const [delimiter, setDelimiter] = useState(',');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [filename, setFilename] = useState('');

  const handleInputChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target.result); // Actualiza el estado inputText
      };
      reader.readAsText(file);
    } else {
      setInputText(''); // Limpia el inputText si no hay archivo seleccionado
    }
  };

  const handleSave = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    window.location.reload();
};

  const handleDelete = () => {
    window.location.reload();
  };

  const handleFileRemove = () => {
    setOutputText('');
    setShowSaveButton(false); // Ocultar el botón Guardar al quitar un archivo
  };

  useEffect(() => {
    if (inputFilePath && outputText) {
      setShowSaveButton(true);
      const now = new Date();
      const newFormattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const fileExtension = inputFilePath.name.split('.').pop().toLowerCase();
      const newFilename = `converted_${newFormattedDate}.${fileExtension === 'txt' ? 'json' : 'txt'}`;
      setFormattedDate(newFormattedDate);
      setFilename(newFilename);
    } else {
      setShowSaveButton(false);
    }
  }, [inputFilePath, outputText]);

  const handleConvert = async () => {
    // Validar si los campos están llenos
    if (!inputFilePath || !delimiter || !encryptionKey) {
      alert('Por favor, completa todos los campos antes de convertir.');
      return;
    }

    setIsLoading(true);

    const apiUrl = 'http://localhost:4000/ari';
    const endpoint = inputFilePath.name.endsWith('.txt') ? 'txtToJson' : 'jsonToTxt';

    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: encryptionKey,
          txtcontent: endpoint === 'txtToJson' ? inputText : undefined,
          parsedData: endpoint === 'jsonToTxt' ? JSON.parse(inputText) : undefined,
          delimiter,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (endpoint === 'txtToJson') { // Si se convierte de txt a json
          setOutputText(JSON.stringify(data.parsedData, null, 2));  // Formatear el JSON
        } else if (endpoint === 'jsonToTxt') {  // Si se convierte de json a txt
          setOutputText(data.output);  // Mostrar la salida
        }

        setShowSaveButton(true);
      } else {
        const errorData = await response.json();
        setOutputText(`Error en la conversión: ${errorData.msg}`);
      }
    } catch (error) {
      setOutputText('Error en la conexión con el servidor');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <div className='container-left'>
          <FileInput
            label="Archivo de entrada"
            onFileChange={handleInputChange}
            file={inputFilePath}
            setFile={setInputFilePath}
            onFileRemove={handleFileRemove}
            acceptedExtensions={['txt','json']}
          />
          <label>Contenido de la fuente</label>
          <FileDisplay text={inputText} />
        </div>
        <div className='container-right'>
          <div className="settings">
            <label>Delimitador</label>

            <input
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
            />

            <label>Clave de cifrado</label>
            <input
              type="text"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
            />
          </div>

          {!outputText && ( // Mostrar el botón Convertir solo si outputText está vacío
            isLoading ? ( 
              <p>Convirtiendo... {progress}%</p>
            ) : (
              <button onClick={handleConvert} className={`convert-button ${isLoading ? 'loading' : ''}`}>
                Convertir
              </button>
            )
          )}
          {outputText && <FileDisplay text={outputText} />}

          {showSaveButton && (
            <div className="button-group"> {/* Contenedor para agrupar los botones */}
              <button onClick={handleDelete} className="delete-button">Eliminar</button>
              <button onClick={handleSave} className="save-button">Guardar</button>
            </div>
          )}
        </div>
        </div>
    </div>
  );
}

export default App;
