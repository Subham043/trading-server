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

export const generateSuretyDoc: () => void = () => {
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
                text: "Form to be signed by the Surety",
                bold: true,
                size: 35,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "(Private and Confidential)",
                size: 20,
                font: "Calibri",
                italics: true,
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
            columnWidths: [1000, 4500, 5500],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "1",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Name of the Company to which the Surety stands",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                ],
                height: {
                  value: 2000,
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
                            text: "2",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Full Name and Address of the Surety",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                ],
                height: {
                  value: 2000,
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
                            text: "3",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
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
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                ],
                height: {
                  value: 2000,
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
                            text: "4",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "If employed, state:",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "a. Name  and  address  of  the Employer.",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "b. Total salary for the year.*",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                ],
                height: {
                  value: 2000,
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
                            text: "5",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "If self-occupied/business, state:",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "a. Name and address of the place where the business is carried on.",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "b. Nature of the business.",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "c. Annual Income/Turnover*",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "d. Annual profit*",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                ],
                height: {
                  value: 2000,
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
                            text: "6",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 1000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Details of immoveable properties@ owned within the municipal limits:",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "a. Situation",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "b. Value",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "c. Annual rent received",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "(Please specify whether the immovable property consists of house or mere land)",
                            size: 25,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4500, // 1/2 of the table
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
                            text: "Date : ",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Place : ",
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
                            text: "Name, Address and Signature of the Surety",
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
                  value: 2000,
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
                text: "* Please attach copy of salary slip/ Income Tax return.",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "@ Please note that Surety should own property absolutely in his/her own name and not as a member of a joint and undivided Hindu family, or own business absolutely in his own name and not as a partner of the firm.",
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
    fs.writeFileSync("./static/word_output/SURETY_Generated.docx", buffer);
    console.log("✅ SURETY_Generated.docx has been created.");
  });
};
