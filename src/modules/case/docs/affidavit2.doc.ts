import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, WidthType, TableRow, TableCell, VerticalAlign, HeightRule } from "docx";
import fs from "fs";

type AFFIDAVIT2DocType = {
  companyName: string;
  namePan: string;
  deceasedRelationship: string;
  shareholderNameDeath: string;
  age: string;
  addressBank: string;
  placeOfDeath: string;
};

export const generateAffidavit2Doc: (
  payload: AFFIDAVIT2DocType,
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
                  text: "DRAFT OF AFFIDAVIT (for difference in name of deceased holder)",
                  bold: true,
                  size: 30,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
  
            new Paragraph(""),
  
            new Table({
              width: {
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Before signing, kindly get the Affidavit franked with an amount of Rs.100/- or affix Special Adhesive Stamps of Rs.100/- or reproduce the text on Non-Judicial Stamp Paper of Rs.100/-. The Non-Judicial Stamp Paper must be purchased in the name of the applicant. The date of execution of Affidavit should be within six months from the date of purchase of Non-Judicial Stamp Paper. The date of execution of Affidavit should be same as date of attestation by the Notary Public / First Class Magistrate. The Affidavit should be signed and affirmed by the applicant in the presence of the above Authorities.",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 11000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 700,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
  
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: `I ${payload.namePan}, ${payload.deceasedRelationship} of ${payload.shareholderNameDeath},	aged	about	 ${payload.age}	years,	and	residing	at ${payload.addressBank} do hereby solemnly affirm and declare as under:`,
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
                  text: `1. I am the ${payload.deceasedRelationship} of ${payload.shareholderNameDeath} and I am fully aware of the facts and circumstances.`,
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
                  text: `2. In the records of ${payload.companyName}, the name of the first/joint holder recorded is ${payload.namePan}. In the death certificate issued by the Corporation of ${payload.placeOfDeath} the name has been recorded as ${payload.namePan}.`,
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
                  text: `3. I state that ${payload.namePan} was also known as ${payload.namePan} and that both names belong to one and the same person.`,
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
                  text: "4. This Affidavit is executed in favour of the Company/its agent on my/our own volition.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
  
            new Paragraph(""),
            new Paragraph(""),
            new Paragraph(""),
  
            new Paragraph({
              children: [
                new TextRun({
                  text: "Verification",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
  
            new Paragraph(""),
  
            new Paragraph({
              children: [
                new TextRun({
                  text: "I solemnly affirm that the statements contained in the above paragraphs are true to the best of my knowledge, information and belief and that nothing material has been concealed from being disclosed.",
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
                  text: "Solemnly declared and affirmed on Identification at _________________________ on this ____________________________ Day of ____________________________________",
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
                  text: "Signature of the surviving holder	Executed before me _________________________ as per specimen signature	Signature of Notary Public/First Class Magistrate registered with the Company",
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
                  text: "(with name and full address of the Notary Public/ First Class Magistrate under their official seal , registration no and Notarial/Court fee stamps as applicable)",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/AFFIDAVIT2_Generated.docx", buffer);
        console.log("✅ AFFIDAVIT2_Generated.docx has been created.");
        resolve("✅ AFFIDAVIT2_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
