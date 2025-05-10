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

type FORMBDocType = {
  companyName: string;
  companyOldName: string;
  shareholderNameDeath: string;
  Folio: string;
  addressAadhar: string;
  pincodeBank: string;
  email: string;
  phone: string;
  details: {
    name: string;
    address: string;
    pin: string;
    pan: string;
    namePan: string;
    deceasedRelationship: string;
  }[];
  certificate: {
    totalFaceValue: string;
    totalNoOfShares: string;
    certificateNumber: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
    distinctiveNos: string;
    distinctiveNosFrom: string;
    distinctiveNosTo: string;
    certificateYear: string;
    index: number;
  }[];
};

export const generateFormBDoc: (
  payload: FORMBDocType,
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
                              text: "FORM-B",
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

            new Paragraph({
              children: [
                new TextRun({
                  text: "INDEMNITY",
                  bold: true,
                  size: 25,
                  font: "Calibri",
                  underline: {
                    color: "#222222",
                  },
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
                              text: "Note: This indemnity is to be executed in the presence of a Public Notary / Gazetted Officer",
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
                  text: "(To be executed on a Non-Judicial Stamp Paper of appropriate value and to be Notarized)",
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
                  text: "(Presently for the State of Maharashtra Rs.500/-",
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
                  text: `"I/We, ${payload.details
                    .map(
                      (item) =>
                        `${item.name} ${item.deceasedRelationship} of ${payload.shareholderNameDeath} residing at ${item.address}, ${item.pin} having Permanent Account No (s) ${item.pan}`
                    )
                    .join(
                      " ;"
                    )} do hereby solemnly affirm and state on oath as follows.`,
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
                  text: "1. That I/we, am/are the sole/joint holder/s of the Securities in following folios.   I/We request you to issue duplicate certificate(s) for securities, as detailed below in my/our name(s):",
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
              columnWidths: [2000, 1500, 1500, 1500, 1500, 1500, 1500],
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
                        size: 2000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Folio No/s",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Securities held",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Face Value",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Security Certificate No.",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Distinctive Nos. ",
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
                      columnSpan: 2,
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
                              text: "From",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "To",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 1500, // 1/2 of the table
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
                ...payload.certificate.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${payload.companyName} ${
                                    payload.companyOldName.length > 0
                                      ? "[" + payload.companyOldName + "]"
                                      : ""
                                  }`,
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
                                  text: item.Folio,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.totalNoOfShares,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.totalFaceValue,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.certificateNumber,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.distinctiveNosFrom,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.distinctiveNosTo,
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 1500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                      ],
                      height: {
                        value: 500,
                        rule: HeightRule.ATLEAST,
                      },
                      cantSplit: true,
                    })
                ),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "**In case of non-availability of Certificate Nos./Distinctive Nos./ Folio nos., security holder shall obtain the same from RTA.",
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
                  text: `2. That the above securities were acquired by me/us for valuable consideration out of my/our own investment/funds against allotment in Public Issue/allotment in Right Issue or acquired from the market/through inheritance in the year(s) ${payload.certificate
                    .map((item) => item.certificateYear)
                    .join(" ;")}.`,
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
                  text: `3. I/We hereby jointly and severely agree and undertake to indemnify and keep indemnified, saved, defended, harmless, the aforesaid ${payload.companyName} and its successors and assigns for all time hereafter against all losses, costs, claims, actions, demands, risks, charges, expenses, damages, etc., whatsoever which you may suffer and/or incur by reason of your, at my/our request, issuing the said Duplicate Securities as herein above mentioned, to the undersigned. `,
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
                        new Table({
                          width: {
                            size: 5500, // total width of the table in DXA (~6.25 inches)
                            type: WidthType.DXA,
                          },
                          borders: {
                            top: {
                              size: 0,
                              style: "none",
                            },
                            left: {
                              size: 0,
                              style: "none",
                            },
                            right: {
                              size: 0,
                              style: "none",
                            },
                            bottom: {
                              size: 0,
                              style: "none",
                            },
                          },
                          columnWidths: [1000, 4500],
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Address:",
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: payload.addressAadhar,
                                          size: 25,
                                          underline: {
                                            color: "#222222"
                                          }
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "___________________________________",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph(""),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 5500, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2,
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
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Tel No:",
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 1000, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2,
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: payload.phone,
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
                                  columnSpan: 2,
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
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Email Id:",
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 1000, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2,
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: payload.email,
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
                                  columnSpan: 2,
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
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Date:",
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 1000, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2,
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
                                    size: 4500, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2,
                                }),
                              ],
                              height: {
                                value: 500,
                                rule: HeightRule.ATLEAST,
                              },
                              cantSplit: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      rowSpan: 2,
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature of All Holder(s) / Applicant(s)",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature-1: ___________________________",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature-2: ___________________________",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature-3: ___________________________",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
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
                              text: "For Office Use Only ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature Checked By: ___________________________",
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
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Signed before me ",
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
                  text: "At: _________________________",
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
                  text: "On: _________________________",
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
                  text: "_________________________________________",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Signature of Notary / JMFC Official stamp & seal of the Notary Magistrate/ Notary & Regn. No.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),

            new Paragraph(""),
            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Address of First holder / Applicant:",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: payload.addressAadhar,
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
                  text: `Pin code: ${payload.pincodeBank}`,
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
        // fs.writeFileSync("./static/word_output/FORM_B_Generated.docx", buffer);
        console.log("✅ FORM_B_Generated.docx has been created.");
        resolve("✅ FORM_B_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
