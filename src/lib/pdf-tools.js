import PdfPrinter from "pdfmake";
import UsersModel from "../api/users/model.js";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (user) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  const imageBase64 = await imageToBase64(user.image);

  const docDefinition = {
    content: [
      { text: user.name },
      { text: user.surname },
      { text: user.email },
      { text: user.title },
      { text: user.bio },
      { text: user.area },

      //, user.experience
      { image: `data:image/jpeg;base64,${imageBase64}`, width: 150 },
    ],
    defaultStyle: {
      font: "Helvetica",
    },
  };

  // console.log("USER:", user)

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
