const fs = require('fs');
const Excel = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path'); 

// 1. Leer datos desde Excel
async function readExcelData(filePath) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('EJE');

    let categories = {};

    worksheet.eachRow((row, rowNumber) => {
        let category = row.getCell(2).value; 
        let exercise = row.getCell(3).value; 

        if (category) {
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(exercise);
        }
    });

    return categories;
}

// 2. Aleatorizar los ejercicios
function shuffleExercises(exercises) {
    for (let i = exercises.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
    }
    return exercises;
}

// 3. Generar PDF con la rutina aleatorizada
function generatePDF(categories) {
    const doc = new PDFDocument();
    const timestamp = new Date().getTime(); // Genera un timestamp único
    const outputFilePath = path.join(__dirname, `rutina_${timestamp}.pdf`); // Ruta y nombre del archivo PDF de salida
    doc.pipe(fs.createWriteStream(outputFilePath));

    // Aquí puedes personalizar el formato del PDF según tus necesidades
    doc.fontSize(18).text('Rutina de Ejercicios', { align: 'center' });
    doc.moveDown();
    
    Object.keys(categories).forEach(category => {
        doc.fontSize(16).text(category, { underline: true });
        categories[category].forEach((exercise, index) => {
            doc.fontSize(12).text(`${index + 1}. ${exercise}`);
        });
        doc.moveDown();
    });

    doc.end();
    console.log(`Rutina generada y guardada como ${outputFilePath}`);
}

// Uso de las funciones
const excelFilePath = path.join('D:', 'Matias', 'OneDrive', 'GYMSYSTEM', 'RUTINABASE.xlsx'); // Ruta completa al archivo Excel
readExcelData(excelFilePath)
    .then(categories => {
        // 4. Procesar los datos y aleatorizar
        Object.keys(categories).forEach(category => {
            categories[category] = shuffleExercises(categories[category]);
        });

        // 5. Generar PDF y guardar
        generatePDF(categories);
    })
    .catch(err => {
        console.error('Error al leer el archivo Excel:', err);
    });