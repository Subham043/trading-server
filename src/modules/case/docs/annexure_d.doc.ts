import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  VerticalAlign,
  WidthType,
  HeightRule,
  BorderStyle,
} from "docx";
import fs from "fs";

type ANNEXUREDDocType = {
  shareholderNameDeath: string;
  dod: string;
  isInTestate: boolean;
  companyName: string;
  companyRTA: string;
  clamaints_pan_name: string;
  certificate: {
    totalNoOfShares: string;
    certificateNumber: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
    distinctiveNos: string;
    index: number;
  }[];
  legalHeirDetails: {
    namePan: string;
    addressAadhar: string;
    pincodeBank: string;
    phone: string;
    age: string;
    deceasedRelationship: string;
  }[];
};

export const generateAnnexureDDoc: (
  payload: ANNEXUREDDocType,
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
            new Table({
              width: {
                size: 2000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [2000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Annexure D",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 2000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
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
                  text: "Individual Affidavits to be given by ALL the Legal Heirs OR Legal Heirs named in Will",
                  bold: true,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "(For Transmission of securities on death of Sole Holder where NO NOMINATION has been registered)",
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
                  text: "Each Deponent (legal heir) shall sign separate Affidavits. ",
                  size: 25,
                  font: "Calibri",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
  
            new Paragraph(""),
            new Paragraph({
              children: [
                new TextRun({
                  text: "I, {namePan}, {deceasedRelationship} of {shareholderNameDeath} residing in {addressAadhar}, {pincodeBank} do hereby solemnly affirm and state on oath as follows.",
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
                  text: "That {shareholderNameDeath} held the following securities in his name as single holder:",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(""),
  
            new Table({
              width: {
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [5000, 3000, 3000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Company Name",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Folio No.",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "No. of securities held",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
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
                  text: "That the aforesaid deceased holder died intestate leaving behind him/her, the following persons as the only surviving heirs according to the Law of Intestate Succession by which he/she was governed at the time of his/her death and without registering any nominee",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
  
            new Paragraph(""),
  
            new Table({
              width: {
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [3000, 3000, 2000, 3000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Name of the Legal Heir(s) ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Address and contact details",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Age",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 2000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Relation with  the Deceased ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 2000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
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
                  text: "Signature of the Deponent: ",
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
                  text: "VERIFICATION",
                  size: 35,
                  font: "Calibri",
                  bold: true,
                  underline: {
                    color: "#222222",
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
  
            new Paragraph({
              children: [
                new TextRun({
                  text: "I hereby solemnly affirm and state that what is stated herein above is true and correct and nothing has been concealed therein and that we I am competent to contract and entitled to rights and benefits of the abovementioned securities of the deceased.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
  
            new Paragraph(""),
  
            new Table({
              width: {
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [5500, 5500],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
                left: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
                right: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
                insideHorizontal: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
                insideVertical: {
                  style: BorderStyle.SINGLE,
                  color: "#ffffff",
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Solemnly affirmed at :",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature of the Deponent",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 2000,
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
                  text: "Place:",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
  
            new Paragraph({
              children: [
                new TextRun({
                  text: "Date:",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/ANNEXURE_D_Generated.docx", buffer);
        console.log("✅ ANNEXURE_D_Generated.docx has been created.");
        resolve("✅ ANNEXURE_D_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
