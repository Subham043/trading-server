import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import fs from "fs";

export const generateAffidavitDoc: () => void = () => {
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
                text: "I, {shareholderName} , D/W/S/o {husbandName} aged about {age} years, residing {addressBank} do hereby solemnly affirm and declare as follows:",
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
                text: "Name (as per Aadhar Card) :",
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
                text: "Aadhar:",
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
                text: "Name (as per PAN Card): ",
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
                text: "PAN:",
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
                text: "Name (As per Share Certificate): ",
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
                text: "1. That I say that I am known as {nameAadhar}, {namePan} and {shareholderNameCertificate}",
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

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("./static/word_output/AFFIDAVIT_Generated.docx", buffer);
    console.log("✅ AFFIDAVIT_Generated.docx has been created.");
  });
};
