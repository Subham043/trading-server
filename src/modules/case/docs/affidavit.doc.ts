import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import fs from "fs";

type AFFIDAVITDocType = {
  shareholderNameCertificate: string;
  deceasedRelationship: string;
  nameAadhar: string;
  namePan: string;
  pan: string;
  aadhar: string;
  husbandName: string;
  addressBank: string;
  age: string;
};

export const generateAffidavitDoc: (
  payload: AFFIDAVITDocType,
  outputPath: string
) => Promise<string> = (payload, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                // top: 1440, // 1 inch
                // bottom: 1440, // 1 inch
                right: 500, // 1 inch
                left: 500, // 1 inch
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "A F F I D A V I T",
                  bold: true,
                  size: 30,
                  font: "Calibri",
                  underline: {
                    color: "#222222",
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(""),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `I, ${payload.shareholderNameCertificate} , ${payload.deceasedRelationship} ${payload.husbandName} aged about ${payload.age} years, residing ${payload.addressBank} do hereby solemnly affirm and declare as follows:`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Name (as per Aadhar Card) : ${payload.nameAadhar}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Aadhar : ${payload.aadhar}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Name (as per PAN Card) : ${payload.namePan}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `PAN : ${payload.pan}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Name (As per Share Certificate) : ${payload.shareholderNameCertificate}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: `1. That I say that I am known as ${payload.nameAadhar}, ${payload.namePan} and ${payload.shareholderNameCertificate}`,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "2. That I say that declare that the above said names are the same and identical person.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "3. That I am an Indian citizen.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "4. That all the above statements are true to best of my knowledge and behalf.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),
            new Paragraph(""),
            new Paragraph(""),
            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Signature of the deponent",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/AFFIDAVIT_Generated.docx", buffer);
        console.log("✅ AFFIDAVIT_Generated.docx has been created.");
        resolve("✅ AFFIDAVIT_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
