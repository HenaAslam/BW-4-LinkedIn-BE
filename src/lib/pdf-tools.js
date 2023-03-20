import PdfPrinter from "pdfmake";
import UsersModel from "../api/users/model.js"

export const getPDFReadableStream = (user) => {
    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    }
    const printer = new PdfPrinter(fonts)

    const docDefinition = {

        content: [user.name, user.surname, user.email, user.title, user.bio, user.area, user.image
            //, user.experience 
        ],
        defaultStyle: {
            font: "Helvetica",
        }
    }

    // console.log("USER:", user)

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()

    return pdfReadableStream
}