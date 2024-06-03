import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import FileInput from './components/FileInput';
import FileDisplay from './components/FileDisplay';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setInputFilePath(null);
    setOutputFilePath(null);
    setDelimiter(',');
    setEncryptionKey('');
    setInputText('');
    setOutputText('');
    setShowSaveButton(false); // Ocultar el botón Guardar después de guardar
  };

  const handleDelete = () => {
    setInputFilePath(null);
    setOutputFilePath(null);
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

  const [inputFilePath, setInputFilePath] = useState(null);
  const [outputFilePath, setOutputFilePath] = useState(null);
  const [delimiter, setDelimiter] = useState(',');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    if (inputFilePath && outputText) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [inputFilePath, outputText]);

  const handleConvert = () => {
    // Validar si los campos están llenos
    if (!inputFilePath || !outputFilePath || !delimiter || !encryptionKey) {
      alert('Por favor, completa todos los campos antes de convertir.');
      return; // Detener la conversión si faltan campos
    }

    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Simulación de conversión (reemplazar con la lógica real del backend)
          const simulatedOutput = `Conversión exitosa:\n\nEntrada:\n${inputText}\n\nSalida:\nJSON simulado`;
          setOutputText(simulatedOutput);
          setShowSaveButton(true);
          setIsLoading(false);
          return 100;
        }
        document.documentElement.style.setProperty('--progress', `${prevProgress}%`); // Actualizar la variable CSS
        return prevProgress + 10; // Incrementa el progreso en 10 cada intervalo
      });
    }, 200); // Intervalo de 200ms (ajusta según la duración deseada)
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <FileInput
          label="Archivo de entrada:"
          onFileChange={handleInputChange}
          file={inputFilePath}
          setFile={setInputFilePath}
          onFileRemove={handleFileRemove}
        />
        <FileInput
          label="Archivo de salida:"
          onFileChange={() => {}}
          file={outputFilePath}
          setFile={setOutputFilePath}
          onFileRemove={handleFileRemove}
        />

        <div className="settings">
          <label>Delimitador:</label>

          <input
            type="text"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
          />

          <label>Clave de cifrado:</label>
          <input
            type="text"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
          />
        </div>

        <FileDisplay text={inputText} />

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
  );
}

export default App;
