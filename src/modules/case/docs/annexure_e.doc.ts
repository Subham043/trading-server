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
} from "docx";
import fs from "fs";

export const generateAnnexureEDoc: () => void = () => {
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
                            text: "Annexure E",
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
            alignment: AlignmentType.RIGHT,
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
                            text: "Note: To be executed in the presence of a Public Notary / Gazetted Officer",
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
                text: "Bond of Indemnity to be furnished jointly by all Legal Heir(s) including the Claimant(s)",
                bold: true,
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "(To be submitted on Non-judicial Stamp Paper of appropriate value)",
                bold: true,
                size: 25,
                font: "Calibri",
                color: "#00a2e4",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "[For Transmission of Securities on death of Sole Securities’ Holder, where no nomination has been registered]",
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
                text: "I/We do hereby solemnly affirm and state on oath as follows:",
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
                text: "That Mr. /Ms. {shareholderNameDeath} was holding the following securities:",
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
            columnWidths: [2200, 2200, 2200, 2200, 2200],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Name	of	the Company",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 2200, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Certificate No.",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 2200, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Distinctive No.",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                      size: 2200, // 1/2 of the table
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
                text: "That the aforesaid deceased holder died intestate on {#isInTestate}{dod}{/isInTestate}, without registering any nominee, leaving behind him/her the following persons as the only surviving legal heirs, according to the laws of intestate succession applicable to him/her by which he/she was governed at the time of his/her death.",
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
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "OR",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph(""),
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "That the aforesaid deceased holder died on {#isTestate}{dod}{/isTestate}, without registering any nominee, leaving behind him/her the following persons as the only surviving legal heirs, according to the laws of testamentary succession.",
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
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "Therefore,	I/We,	the	Legal	Heir(s)/Claimant(s)	and	deponent(s)	herein	has/have, approached {companyName}, {companyRTA} with a request to transmit the aforesaid securities in the name of the undersigned Mr. /Ms. {#clamaints}{namePan}; {/} , on my/our behalf, without insisting on production of a Succession Certificate/ Probate of Will / Letter of Administration or any Court order, for which we execute an indemnity as is herein contained and on relying on the information herein given by us, believing the same to be true.",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph(""),
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "In consideration therefore of my/our request to transfer/transmit the above said securities to the name of the undersigned Mr. /Ms. {#clamaints}{namePan}; {/},",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph(""),
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "I/We hereby jointly and severely agree and undertake to indemnify and keep indemnified, saved, defended, harmless, {companyName}, {companyRTA} and its successors and assigns for all time hereafter against all losses, costs, claims, actions, demands, risks, charges, expenses, damages, etc., whatsoever which they may suffer and/or incur by reason of transferring the said securities as herein above mentioned, at my/our request to the undersigned Mr./Ms.   {#clamaints}{namePan}; {/}, without insisting on production of a Succession Certificate / Probate of Will / Letter of Administration or any Court order.",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph(""),
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "IN WITNESS WHEREOF the said ",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1) Mr. /Ms. ",
                size: 25,
                font: "Calibri",
              }),
              new TextRun({
                text: "(Name and signature of the witness)",
                size: 25,
                font: "Calibri",
                underline: {
                  color: "#222222",
                },
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "2) Mr. /Ms. ",
                size: 25,
                font: "Calibri",
              }),
              new TextRun({
                text: "(Name and signature of the witness)",
                size: 25,
                font: "Calibri",
                underline: {
                  color: "#222222",
                },
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "have hereunto set their respective hands and seals this day of _______________________________.",
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
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Name the Legal Heirs",
                            size: 25,
                            bold: true,
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
                            text: "Signature of the Legal Heirs",
                            size: 25,
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
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
          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "Signed before me",
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

          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "At: ",
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
                text: "On: ",
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
                text: "Signature of Notary Official stamp & seal of the Notary & Regn. No.:",
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

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("./static/word_output/ANNEXURE_E_Generated.docx", buffer);
    console.log("✅ ANNEXURE_E_Generated.docx has been created.");
  });
};
