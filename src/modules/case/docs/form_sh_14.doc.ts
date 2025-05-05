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

export const generateFormSH14Doc: () => void = () => {
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
                text: "CANCELLATION OR VARIATION OF NOMINATION",
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
                text: "[Pursuant to sub-section (3) of Section 72 of the Companies Act, 2013 and Rule 19(9) of the Companies (Share Capital and Debentures) Rules, 2014]",
                size: 25,
                font: "Calibri",
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph(""),
          new Paragraph(""),
          new Paragraph({
            children: [
              new TextRun({
                text: "{companyName} {#hasCompanyOldName}[{companyOldName}]{/hasCompanyOldName} {companyCity}, {companyState}, {companyPincode}",
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
                text: "I/We hereby cancel the nomination(s) made by me/us in favour of …………{fullName}, {address}………………………………………………………………………………..…………….. in respect of the below mentioned securities.",
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
                text: "OR",
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
                text: " I/We hereby nominate the following person in place of {fullName} as nominee in respect of the below mentioned securities in whom shall vest all rights in respect of such securities in the event of my/our death.",
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
                text: "(1) PARTICULARS OF THE SECURITIES (in respect of which nomination is being cancelled/varied) -",
                size: 25,
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
            columnWidths: [2200, 2200, 2200, 2200, 2200],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Nature of Securities",
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
                            text: "No. of Securities",
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
                text: "(2) (a) PARTICULARS OF THE NEW NOMINEE(S) -",
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
                            text: "(i) Name :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(ii) Date of Birth :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(iii) Father’s/Mother’s/Spouse’s name :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(iv) Occupation :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(v) Nationality :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(vi) Address :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(vii) E-mail id :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(viii) PAN No. :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(ix) Relationship with the security holder :",
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
                            text: "________________________________________",
                            size: 25,
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
                text: "(b) IN CASE NEW NOMINEE IS A MINOR -",
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
                            text: "(i) Date of attaining majority :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(ii) Name of Guardian :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(iii) Address of Guardian :",
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
                            text: "________________________________________",
                            size: 25,
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
                text: "(3) PARTICULARS OF NOMINEE IN CASE MINOR NOMINEE DIES BEFORE ATTAINING AGE OF MATURITY –",
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
                            text: "(i) Name :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(ii) Date of Birth :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(iii) Father’s/Mother’s/Spouse’s name :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(iv) Occupation :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(v) Nationality :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(vi) Address :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(vii) E-mail id :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(viii) PAN No. :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(ix) Relationship with the security holder :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(x) Relationship with the minor nominee :",
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
                            text: "________________________________________",
                            size: 25,
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
                  value: 700,
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
                            text: "(4) SPECIMEN SIGNATURE OF THE NOMINEE / GUARDIAN* - ",
                            size: 25,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "* In case the Nominee is a minor",
                            size: 20,
                            italics: true,
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
                      new Table({
                        width: {
                          size: 5500, // total width of the table in DXA (~6.25 inches)
                          type: WidthType.DXA,
                        },
                        columnWidths: [5500],
                        rows: [
                          new TableRow({
                            children: [
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
                              value: 1000,
                              rule: HeightRule.ATLEAST,
                            },
                            cantSplit: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
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
                  value: 1000,
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
            columnWidths: [3000, 4000, 4000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Name of the Security Holder(s)",
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
                            text: "Signature",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Witness with name and address",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
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
                            text: "",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Name: ",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                ],
                height: {
                  value: 1000,
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
                            text: "",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Address: ",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    rowSpan: 2,
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                ],
                height: {
                  value: 1000,
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
                            text: "",
                            size: 25,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 4000, // 1/2 of the table
                      type: WidthType.DXA,
                    },
                  }),
                ],
                height: {
                  value: 1000,
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
                text: "Date :",
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
    fs.writeFileSync("./static/word_output/FORM_SH_14_Generated.docx", buffer);
    console.log("✅ FORM_SH_14_Generated.docx has been created.");
  });
};
