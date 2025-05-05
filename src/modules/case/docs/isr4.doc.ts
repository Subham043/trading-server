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
  CheckBox,
} from "docx";
import fs from "fs";

export const generateISR4Doc: () => void = () => {
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
                text: "Form ISR – 4",
                bold: true,
                size: 50,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "(see circular No. SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2022/8 dated January 25, 2022 on Issuance of  Securities in dematerialized form in case of Investor Service Requests)",
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
                text: "Request for issue of Duplicate Certificate and other Service Requests (for Securities - Shares / Debentures / Bonds, etc., held in physical form) ",
                italics: true,
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
                text: "Date: ",
                bold: true,
                size: 25,
                font: "Calibri",
              }),
              new TextRun({
                text: "__/__/____",
                size: 25,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "A. Mandatory Documents / details required for processing all service request: I / We are submitting the following documents / details and undertake to request the  Depository Participant to dematerialize my / our securities within 120 days from the date  of issuance of Letter of Confirmation, received from the RTA/Issuer Company (tick ✔as  relevant, refer to the instructions):",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "Demat Account No. (If available): ",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "Provide Client Master List (CML) of your Demat Account from the Depository  Participant* ",
                size: 20,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: " Provide the following details, if they are not already available with the RTA (see SEBI  circular dated November 03, 2021 in this regard) ",
                size: 20,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
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
                            text: "PAN : ",
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
                            text: "Specimen Signature",
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
                            text: "Nomination / Declaration to Opt-out",
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
                  value: 500,
                  rule: HeightRule.ATLEAST,
                },
                cantSplit: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "* (Your address, e-mail address, mobile number and bank details shall be updated in your folio from the information available in your CML). You can authorize the RTA to update the above details for all your folios. In this regard, please refer to and use Form ISR-1 in SEBI circular dated November 03, 2021.",
                size: 20,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "B.  I / We request you for the following (tick ✔ relevant box) ",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Table({
            width: {
              size: 10000, // total width of the table in DXA (~6.25 inches)
              type: WidthType.DXA,
            },
            columnWidths: [5000, 5000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Issue of Duplicate certificate ",
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
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Claim from Unclaimed Suspense  Account",
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
                ],
                height: {
                  value: 800,
                  rule: HeightRule.EXACT,
                },
                cantSplit: true,
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Replacement / Renewal / Exchange of securities certificate",
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
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Endorsement",
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
                ],
                height: {
                  value: 800,
                  rule: HeightRule.EXACT,
                },
                cantSplit: true,
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Sub-division / Splitting of securities  certificate",
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
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: "  Consolidation of Folios",
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
                ],
                height: {
                  value: 800,
                  rule: HeightRule.EXACT,
                },
                cantSplit: true,
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Consolidation of Securities certificate ",
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
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Transmission",
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
                ],
                height: {
                  value: 800,
                  rule: HeightRule.EXACT,
                },
                cantSplit: true,
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new CheckBox({
                            checked: false,
                          }),
                          new TextRun({
                            text: " Transposition (Mention the new order of holders here)",
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
                    columnSpan: 2
                  }),
                ],
                height: {
                  value: 800,
                  rule: HeightRule.EXACT,
                },
                cantSplit: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "C. I / We are enclosing certificate(s) as detailed below**:",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
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
                            text: "Name of the Issuer Company",
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
                            text: "Folio Number ",
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
                            text: "Name(s) of the security  holder(s) as per the  certificate(s)",
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
                            text: "Certificate numbers",
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
                            text: "Distinctive numbers",
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
                            text: "Number & Face value of  securities",
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
                  value: 500,
                  rule: HeightRule.ATLEAST,
                },
                cantSplit: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "** Wherever applicable / whichever details are available",
                size: 20,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "D. Document / details required for specific service request: ",
                size: 25,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "I. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Duplicate securities certificate  ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "II. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Claim from Unclaimed Suspense Account ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "III. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Replacement / Renewal / Exchange of securities certificate (that is defaced, mutilated, torn, decrepit, worn out or where the page on the reverse is fully utilized) ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "IV. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Endorsement ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "V. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Sub-division / Splitting of securities certificate ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "VI. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Consolidation of securities certificate/Folios ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "VII. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Transmission ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "VIII. ",
                size: 25,
              }),
              new CheckBox({
                checked: false,
              }),
              new TextRun({
                text: " Transposition ",
                size: 25,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "Provide / attach original securities certificate(s) for request for item numbers III to VIII  above.",
                size: 20,
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "Declaration: All the above facts stated are true and correct to best of my / our knowledge  and belief.",
                size: 20,
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph(" "),

          new Table({
            width: {
              size: 11000, // total width of the table in DXA (~6.25 inches)
              type: WidthType.DXA,
            },
            columnWidths: [2000, 3000, 3000, 3000],
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
                            text: "Security Holder 1 / Claimant ",
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
                            text: "Security Holder 2",
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
                            text: "Security Holder 3",
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
                            text: "Signature ",
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
                            text: "Name ",
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
                            text: "Full address ",
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
                            text: "PIN  ",
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

          new Paragraph(" "),
          new Paragraph({
            children: [
              new TextRun({
                text: "After processing the service request, the RTA shall issue a ‘Letter of Confirmation’ to the  securities holder/claimant, which is valid only for 120 days. Using this ‘Letter of  Confirmation’, the securities holder/claimant shall request the DP to dematerialize the  securities, failing which the securities shall be credited to the Suspense Escrow Demat  Account of the Company. ",
                size: 20,
                font: "Calibri",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("./static/word_output/ISR4_Generated.docx", buffer);
    console.log("✅ ISR4_Generated.docx has been created.");
  });
};
