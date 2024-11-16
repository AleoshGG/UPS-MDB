const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Configuración del cliente S3
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Función para subir un archivo a S3
const uploadFile = async (archivoBuffer, filePath) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,  // Ruta y nombre del archivo en el bucket
    Body: archivoBuffer
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Archivo subido exitosamente:", data);
    return data; // Puedes devolver datos útiles sobre la carga
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error; // Lanza el error para manejarlo en otro lugar si es necesario
  }
};

module.exports = uploadFile;
