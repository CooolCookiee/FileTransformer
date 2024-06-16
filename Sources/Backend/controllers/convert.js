const { response } = require("express");
const { generateJWT, decodeJWT } = require("../helpers/jwt");

const txtToJson = async (req, res = response) => {
  const { secret, txtcontent, delimiter = "," } = req.body;

  try {
    // Split text into records based on newline character
    const lines = txtcontent.split("\n");

    const parsedData = await Promise.all(
      lines.map(async (item) => {
        const [
          documento,
          nombres,
          apellidos,
          tarjeta,
          tipo,
          telefono,
          coordinates,
        ] = item.split(new RegExp(`${delimiter}(?![^()]*\\))`)); // Split by delimiter, ignoring those within parentheses

        // Remove outer parentheses and split the records
        const cleanedCoordinates = coordinates
          .replace(/^\(\(/, "")
          .replace(/\)\)$/, "");
        const coordinatePairs = cleanedCoordinates
          .split("))(( ")
          .map((record) => {
            const cleanRecord = record.replace(/[()]/g, ""); // Clean inner parentheses
            return cleanRecord.split(", ").map((coordPair) => {
              const [longitude, latitude] = coordPair
                .trim()
                .split(/\s+/)
                .map(parseFloat);
              return { longitude, latitude };
            });
          })
          .flat(); // Flatten the array to get a single list of coordinate pairs

        const token = await generateJWT(tarjeta, secret);

        return {
          documento,
          nombres,
          apellidos,
          tarjeta: token,
          tipo,
          telefono,
          poligono: coordinatePairs,
        };
      })
    );

    res.status(200).json({
      parsedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong :(",
    });
  }
};

const jsonToTxt = async (req, res = response) => {
  const { secret, parsedData, delimiter = "," } = req.body;

  try {
    const result = await Promise.all(
      parsedData.map(async (item) => {
        // Formatear las coordenadas
        const coordinates = item.poligono
          .map((coord) => `${coord.longitude} ${coord.latitude}`)
          .join(", ");

        const decoded = await decodeJWT(item.tarjeta, secret);

        // Construir la cadena de salida para cada objeto
        return `${item.documento}${delimiter}${item.nombres}${delimiter}${item.apellidos}${delimiter}${decoded.creditcard}${delimiter}${item.tipo}${delimiter}${item.telefono}${delimiter}(( ${coordinates} ))`;
      })
    );

    // Unir todos los resultados en una sola cadena separada por saltos de línea
    const output = result.join("\n");

    res.status(200).json({
      output,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong :(",
    });
  }
};

module.exports = {
  txtToJson,
  jsonToTxt,
};
