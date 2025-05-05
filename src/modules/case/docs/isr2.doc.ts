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
  TableLayoutType,
} from "docx";
import fs from "fs";

type ISR2DocType = {
  bankAccountNo: string | null;
  bankName: string | null;
  branchName: string | null;
  bankIFS: string | null;
  bankAddress: string | null;
  bankPhone: string | null;
  bankEmail: string | null;
  nameBank: string | null;
  emailBank: string | null;
  phoneBank: string | null;
  pincodeBank: string | null;
  addressBank: string | null;
  accountOpeningDate: string | null;
};

export const generateISR2Doc: (payload: ISR2DocType, outputPath: string) => Promise<string> = (
  payload,
  outputPath
) => {
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
                  text: "Form ISR – 2",
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
                  text: "(see SEBI Circular No. SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 dated March 16, 2023 on Common and Simplified Norms for processing investor’s service request by RTAs and norms for furnishing PAN, KYC details and Nomination)",
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
                  text: "Confirmation of Signature of securities holder by the Banker",
                  bold: true,
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
              columnWidths: [5500, 5500],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "1. Bank Name and Branch",
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
                              text: payload.bankName ? payload.bankName : "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.branchName
                                ? payload.branchName
                                : "",
                              size: 25,
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "2. Bank contact details",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Postal Address",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Phone number",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "E-mail address",
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
                              text: payload.bankAddress
                                ? payload.bankAddress
                                : "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.bankPhone ? payload.bankPhone : "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.bankEmail ? payload.bankEmail : "",
                              size: 25,
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "3. Bank Account number",
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
                              text: payload.bankAccountNo
                                ? payload.bankAccountNo
                                : "",
                              size: 25,
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "4. Account opening date",
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
                              text: payload.accountOpeningDate
                                ? payload.accountOpeningDate
                                : "",
                              size: 25,
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "5. Account holder(s) name(s)",
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
                              text: payload.nameBank ? payload.nameBank : "",
                              size: 25,
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "6. Latest photograph of the account holder(s)",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Table({
                          layout: TableLayoutType.FIXED,
                          columnWidths: [3000, 3000, 3000],
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [
                                    new Paragraph({
                                      text: "1st Holder",
                                      alignment: AlignmentType.CENTER,
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [
                                    new Paragraph({
                                      text: "2nd Holder",
                                      alignment: AlignmentType.CENTER,
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [
                                    new Paragraph({
                                      text: "3rd Holder",
                                      alignment: AlignmentType.CENTER,
                                    }),
                                  ],
                                }),
                              ],
                              height: {
                                value: 1000,
                                rule: HeightRule.EXACT,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 5500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph("")],
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
                              text: "7. Account holder(s) details as per Bank Records",
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
                              text: "a) Address",
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
                              text: payload.addressBank
                                ? payload.addressBank
                                : "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.pincodeBank
                                ? payload.pincodeBank
                                : "",
                              size: 25,
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
                              text: "b) Phone number",
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
                              text: payload.phoneBank ? payload.phoneBank : "",
                              size: 25,
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
                              text: "c) Email address",
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
                              text: payload.emailBank
                                ? payload.emailBank
                                : "",
                              size: 25,
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
                              text: "d) Signature(s)",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Table({
                          layout: TableLayoutType.FIXED,
                          columnWidths: [3000, 3000, 3000],
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [new Paragraph("1) ")],
                                }),
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [new Paragraph("2) ")],
                                }),
                                new TableCell({
                                  width: {
                                    size: 3000,
                                    type: WidthType.DXA,
                                  },
                                  margins: {
                                    top: 100,
                                    bottom: 100,
                                    left: 100,
                                    right: 100,
                                  },
                                  borders: {
                                    top: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    bottom: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    left: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                    right: {
                                      style: BorderStyle.SINGLE,
                                      size: 1,
                                      color: "000000",
                                    },
                                  },
                                  children: [new Paragraph("3) ")],
                                }),
                              ],
                              height: {
                                value: 1000,
                                rule: HeightRule.EXACT,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          text: "Signature verified as recorded with the Bank",
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Seal of the Bank",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
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
                      children: [new Paragraph("")],
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
                              text: "(Signature)",
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
                              text: "Place: ",
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
                              text: "Name of the Bank Manager",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Employee Code",
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
                              text: "Date:",
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
                              text: "E-mail address",
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
          ],
        },
      ],
    });

    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/ISR2_Generated.docx", buffer);
        console.log("✅ ISR2_Generated.docx has been created.");
        resolve("✅ ISR2_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
