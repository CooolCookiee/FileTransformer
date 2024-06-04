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
    const fileExtension = inputFilePath.name.split('.').pop().toLowerCase();
    const downloadType = fileExtension === 'txt' ? 'application/json' : 'text/plain';
    const downloadExtension = fileExtension === 'txt' ? 'json' : 'txt';
  
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: downloadType });
    element.href = URL.createObjectURL(file);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const filename = `converted_${formattedDate}.${downloadExtension}`;
    element.download = filename;
    document.body.appendChild(element);
    element.click();

    setInputFilePath(null);
    setDelimiter(',');
    setEncryptionKey('');
    setInputText('');
    setOutputText('');
    setShowSaveButton(false); 
  };

  const handleDelete = () => {
    setInputFilePath(null);
    setDelimiter(',');
    setEncryptionKey('');
    setInputText('');
    setOutputText('');
    setShowSaveButton(false);
  };

  const handleFileRemove = () => {
    setOutputText('');
    setShowSaveButton(false); // Ocultar el botón Guardar al quitar un archivo
  };

  useEffect(() => {
    if (inputFilePath && outputText) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [inputFilePath, outputText]);

  const handleConvert = () => {
    // Validar si los campos están llenos
    if (!inputFilePath || !delimiter || !encryptionKey) {
      alert('Por favor, completa todos los campos antes de convertir.');
      return; // Detener la conversión si faltan campos
    }
    setIsLoading(true);
    setProgress(0);
  
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          const fileExtension = inputFilePath.name.split('.').pop().toLowerCase();
          const simulatedOutput = `Conversión exitosa:\n\nEntrada:\n${inputText}\n\nSalida:\nJSON simulado (extensión: .${fileExtension === 'txt' ? 'json' : 'txt'})`;
          setOutputText(simulatedOutput);
          setShowSaveButton(true);
          setIsLoading(false);
          return 100;
        }
        document.documentElement.style.setProperty('--progress', `${prevProgress}%`);
        return prevProgress + 10;
      });
    }, 200);
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
