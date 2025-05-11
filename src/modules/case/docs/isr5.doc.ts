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
  CheckBox,
} from "docx";
import fs from "fs";

type ISR5DocType = {
  companyName: string;
  companyOldName: string;
  companyRTA: string;
  companyRTAAddress: string;
  companyRTAPincode: string;
  isMinor: boolean;
  guardianName: string;
  dobMinor: string;
  pan: string;
  shareholderNameDeath: string;
  dod: string;
  Folio: string;
  percentageClaimant: string;
  namePan: string;
  email: string;
  phone: string;
  addressAadhar: string;
  city: string;
  state: string;
  pincodeBank: string;
  bankName: string;
  bankAccountNo: string;
  bankIFS: string;
  bankMICR: string;
  branchName: string;
  countryOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  certificate: {
    totalNoOfShares: string;
    certificateNumber: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
    distinctiveNos: string;
    distinctiveNosFrom: string;
    distinctiveNosTo: string;
    index: number;
  }[];
};

export const generateISR5Doc: (
  payload: ISR5DocType,
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
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
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
              columnWidths: [8000, 1000, 2000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Table({
                          width: {
                            size: 8000, // total width of the table in DXA (~6.25 inches)
                            type: WidthType.DXA,
                          },
                          columnWidths: [8000],
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Request for Transmission of Securities by Nominee or Legal Heir",
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                      alignment: AlignmentType.CENTER,
                                    }),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "(For Transmission of securities on death of the Sole holder)",
                                          size: 25,
                                        }),
                                      ],
                                      alignment: AlignmentType.CENTER,
                                    }),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 8000, // 1/2 of the table
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
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 8000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Table({
                          width: {
                            size: 1000, // total width of the table in DXA (~6.25 inches)
                            type: WidthType.DXA,
                          },
                          columnWidths: [1000],
                          rows: [],
                          alignment: AlignmentType.CENTER,
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
                                          text: "Annexure C – ISR 5",
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
                                value: 700,
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
                        size: 2000, // 1/2 of the table
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
                  text: `To:`,
                  bold: true,
                  size: 25,
                  font: "Calibri",
                  // color: "#00a2e4",
                }),
                new TextRun({
                  text: ` ${payload.companyName} ${
                    payload.companyOldName.length > 0
                      ? "[" + payload.companyOldName + "]"
                      : ""
                  } ${payload.companyRTA} ${payload.companyRTAAddress} ${
                    payload.companyRTAPincode
                  }`,
                  size: 25,
                  font: "Calibri",
                  // color: "#00a2e4",
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
              columnWidths: [9000, 2000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Name of the Claimant(s):",
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.namePan}`,
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 2,
                      width: {
                        size: 11000, // 1/2 of the table
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
                        new Table({
                          width: {
                            size: 11000, // total width of the table in DXA (~6.25 inches)
                            type: WidthType.DXA,
                          },
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
                          columnWidths: [4000, 3000, 4000],
                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "Name of the Guardian",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: payload.isMinor
                                            ? `Mr./Ms.${payload.guardianName}`
                                            : "",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                  ],
                                  verticalAlign: VerticalAlign.TOP,
                                  width: {
                                    size: 4000, // 1/2 of the table
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
                                          text: " in case the claimant is a minor→",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: "",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                  ],
                                  verticalAlign: VerticalAlign.TOP,
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
                                          text: "Date of Birth of the minor* ",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new TextRun({
                                          text: payload.isMinor
                                            ? payload.dobMinor
                                            : "",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                  ],
                                  verticalAlign: VerticalAlign.TOP,
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
                                          text: "Relationship with Minor: ",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new CheckBox({
                                          checked: false,
                                        }),
                                        new TextRun({
                                          text: " Father",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new CheckBox({
                                          checked: false,
                                        }),
                                        new TextRun({
                                          text: " Mother",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    new Paragraph({
                                      children: [
                                        new CheckBox({
                                          checked: false,
                                        }),
                                        new TextRun({
                                          text: " Court Appointed Guardian* ",
                                          size: 25,
                                        }),
                                      ],
                                    }),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  columnSpan: 3,
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
                        }),
                      ],
                      columnSpan: 2,
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 11000, // 1/2 of the table
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
                        new Paragraph(""),
                        new Table({
                          columnWidths: [
                            ...Array((payload.pan ?? "").split("").length).fill(
                              500
                            ),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.pan ?? "").split("").map(
                                  (it) =>
                                    new TableCell({
                                      children: [
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: it,
                                              size: 25,
                                            }),
                                          ],
                                          alignment: AlignmentType.CENTER,
                                        }),
                                      ],
                                      verticalAlign: VerticalAlign.CENTER,
                                    })
                                ),
                              ],
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "[Multiple PAN may be entered]",
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: " PAN Claimant(s)/Guardian): ",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " KYC Acknowledgment attached",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " KYC form attached",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 2,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: "Tax Status:",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Resident Individual",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Resident Minor (through Guardian)",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " NRI",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " PIO",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Others (please specify)",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 2,
                      width: {
                        size: 11000, // 1/2 of the table
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
                  text: "*Please attach relevant proof ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [9000, 2000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "I/We, the claimant(s) named hereinabove, hereby inform you about the demise of the below mentioned Securities Holder(s) and request you to transmit the securities held by the deceased holder(s) in my/our favour in my/our capacity as – ",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Nominee",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Legal Heir",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Successor to the Estate of the deceased",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Administrator of the Estate of the deceased",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 2,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: "Name of the deceased holder(s)",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 9000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Date of demise** ",
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
                              text: payload.shareholderNameDeath,
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 9000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.dod,
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
                  text: "**Please attach notarised certified copy of Death Certificate. ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Securities(s) & Folio(s) in respect of which Transmission of securities is being requested ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [4400, 2200, 2200, 2200],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Name of the Company ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 4400, // 1/2 of the table
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
                              text: "% of Claim",
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
                            size: 4400, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: payload.Folio,
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
                                  text: item.totalNoOfShares,
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
                                  text: payload.percentageClaimant,
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
                    })
                ),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "@As per Nomination OR as per the Will/Probate/Succession Certificate/Letter of Administration/ Legal Heirship Certificate (or its equivalent certificate)/ Court Decree, if applicable.",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Contact details of the Claimant (s) [Provision for multiple entries may be made]",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Mobile No  : ",
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: payload.phone,
                              size: 25,
                            }),
                          ],
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
                              text: "Tel. No.  : ",
                              size: 25,
                              bold: true,
                            }),
                          ],
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
                              text: "Email Address  : ",
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: payload.email,
                              size: 25,
                            }),
                          ],
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
                  text: "(Please note that address will be updated as per address on KYC form / KYC Registration Agency records)",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Address :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.addressAadhar}`,
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Line 1 ",
                              size: 25,
                            }),
                          ],
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
                              text: "Address : ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Line 2 ",
                              size: 25,
                            }),
                          ],
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
                              text: `City  :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.city}`,
                              size: 25,
                            }),
                          ],
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
                              text: `State :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.state}`,
                              size: 25,
                            }),
                          ],
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
                              text: `PIN :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.pincodeBank}`,
                              size: 25,
                            }),
                          ],
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
                  text: "Bank Account Details of the Claimant ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Bank Name :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.bankName}`,
                              size: 25,
                            }),
                          ],
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
                              text: `Account No :`,
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.bankAccountNo ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.bankAccountNo ?? "").split("").map(
                                  (it) =>
                                    new TableCell({
                                      children: [
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: it,
                                              size: 25,
                                            }),
                                          ],
                                          alignment: AlignmentType.CENTER,
                                        }),
                                      ],
                                      verticalAlign: VerticalAlign.CENTER,
                                    })
                                ),
                              ],
                            }),
                          ],
                        }),
                        new Paragraph(""),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: `11-digit IFSC  :`,
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.bankIFS ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.bankIFS ?? "").split("").map(
                                  (it) =>
                                    new TableCell({
                                      children: [
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: it,
                                              size: 25,
                                            }),
                                          ],
                                          alignment: AlignmentType.CENTER,
                                        }),
                                      ],
                                      verticalAlign: VerticalAlign.CENTER,
                                    })
                                ),
                              ],
                            }),
                          ],
                        }),
                        new Paragraph(""),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: "A/c. Type (✓) ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " SB",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Current",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " NRO",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " NRE",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " FCNR",
                              size: 25,
                            }),
                          ],
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
                              text: `9-digit MICR No :`,
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.bankMICR ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.bankMICR ?? "").split("").map(
                                  (it) =>
                                    new TableCell({
                                      children: [
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: it,
                                              size: 25,
                                            }),
                                          ],
                                          alignment: AlignmentType.CENTER,
                                        }),
                                      ],
                                      verticalAlign: VerticalAlign.CENTER,
                                    })
                                ),
                              ],
                            }),
                          ],
                        }),
                        new Paragraph(""),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: `Name of bank branch :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.branchName}`,
                              size: 25,
                            }),
                          ],
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
                              text: `City :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.city}`,
                              size: 25,
                            }),
                          ],
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
                              text: `PIN :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.pincodeBank}`,
                              size: 25,
                            }),
                          ],
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
                  text: "Please attach ✓",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
                new CheckBox({
                  checked: false,
                }),
                new TextRun({
                  text: " Cancelled cheque with claimant’s name printed OR",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
                new CheckBox({
                  checked: false,
                }),
                new TextRun({
                  text: " Claimant’s Bank Statement/Passbook (duly attested by the Bank Manager)",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "I also request you to pay the UNCLAIMED amounts, if any, in respect of the deceased securities holder(s) by direct credit to the bank account mentioned above.  ",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Additional KYC information",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: " (Please tick✓whichever is applicable) ",
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Occupation",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Private Sector Service",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Public Sector Service",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Government Service",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Business",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Professional",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Agriculturist",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Retired",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Home Maker",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Student",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Forex Dealer",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Others (Please specify)",
                              size: 25,
                            }),
                          ],
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
                              text: "The Claimant is",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " a Politically Exposed Person",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Related to a Politically Exposed Person",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Neither (Not applicable)",
                              size: 25,
                            }),
                          ],
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
                              text: "Gross Annual Income (₹)",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Below 1 Lac",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " 1-5 Lacs",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " 5-10 Lacs",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " 10-25 Lacs",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " 25 Lacs-1crore",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " >1 crore",
                              size: 25,
                            }),
                          ],
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
                  text: "FATCA and CRS information ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
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
              columnWidths: [4000, 4000, 3000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Country of Birth :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.countryOfBirth}`,
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 3,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: `Place of Birth :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.placeOfBirth}`,
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 3,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: `Nationality :`,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.nationality}`,
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 3,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: "Are you a tax resident of any country other than India?  Yes  No If Yes, please mention all the countries in which you are resident for tax purposes and the associated Taxpayer Identification Number and its identification type in the column below",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      columnSpan: 3,
                      width: {
                        size: 11000, // 1/2 of the table
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
                              text: "Country",
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
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Tax-Payer Identification Number",
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
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Identification Type",
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
                        size: 4000, // 1/2 of the table
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
                        size: 4000, // 1/2 of the table
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
                        size: 4000, // 1/2 of the table
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
                        size: 4000, // 1/2 of the table
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
                        size: 4000, // 1/2 of the table
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
                        size: 4000, // 1/2 of the table
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
                  text: "Nomination",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: " (Please✓one of the options below) ",
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
              columnWidths: [11000],
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
                              text: " I/We DO NOT wish to make a nomination.",
                              size: 25,
                            }),
                            new TextRun({
                              text: " (Please tick ✓ if you do not wish to nominate anyone)",
                              size: 25,
                              color: "#00a2e4",
                            }),
                          ],
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
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " I/We wish to make a nomination and hereby nominate the person/s more particularly described in the attached Nomination Form to receive the securities held in my/our folio in the event of my / our death. ",
                              size: 25,
                            }),
                          ],
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
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "@ Guardian of a minor is not allowed to make a nomination on behalf of the minor ",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Declaration and Signature of the Claimant(s)",
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: "I/We have attached herewith all the relevant / required documents as indicated in the attached Ready Reckoner as per Annexure A. ",
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
                  text: "I/We confirm that the information provided above is true and correct to the best of my knowledge and belief.  ",
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
                  text: "I, undertake to keep its RTA informed about any changes/modification to the above information in future and also undertake to provide any other additional information as may be required by the RTAs.",
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
                  text: "I hereby authorize and its RTA to provide/ share any of the information provided by me/us including my holdings in the to any governmental or statutory or judicial authorities/agencies as required by law without any obligation of informing me/us of the same. ",
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
                              text: "Place: ",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Date: ",
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
                              text: "Signature of Claimant",
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
        // fs.writeFileSync("./static/word_output/ISR5_Generated.docx", buffer);
        console.log("✅ ISR5_Generated.docx has been created.");
        resolve("✅ ISR5_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
