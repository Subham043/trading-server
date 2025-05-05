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

type ANNEXUREFDocType = {
  shareholderNameDeath: string;
  dod: string;
  companyName: string;
  companyOldName: string;
  clamaints_pan_name: string;
  certificate: {
    totalNoOfShares: string;
    certificateNumber: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
    distinctiveNos: string;
    index: number;
  }[];
  clamaints: {
    namePan: string;
    addressAadhar: string;
    pincodeBank: string;
    phone: string;
    age: string;
    deceasedRelationship: string;
  }[];
  non_clamaints: {
    namePan: string;
    addressAadhar: string;
    pincodeBank: string;
    phone: string;
    age: string;
    deceasedRelationship: string;
  }[];
};

export const generateAnnexureFDoc: (
  payload: ANNEXUREFDocType,
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
                              text: "Annexure F",
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
                  text: "(To be executed on a Non-Judicial Stamp Paper of appropriate value and to be Notarized)",
                  bold: true,
                  size: 25,
                  font: "Calibri",
                  color: "#00a2e4",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Presently for the State of Maharashtra Rs.100/-",
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
                  text: "No-Objection Certificate from the Legal Heir(s)",
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

            new Paragraph({
              children: [
                new TextRun({
                  text: "Format of NOC from other Legal Heir(s) for Transmission of Securities in favour of the Claimant(s) wherein the Sole Holder is deceased and",
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
                  text: "NO NOMINATION has been registered",
                  size: 25,
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
                  text: "DECLARATION",
                  size: 25,
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
                  text: `I/We, ${payload.clamaints_pan_name} the legal heir(s) of late Mr. / Ms ${payload.shareholderNameDeath} declare as follows – `,
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
                  text: "(i) That the above named deceased holder was holding the following securities in his / her name as single holder: ",
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
                            size: 5000, // 1/2 of the table
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
                            size: 3000, // 1/2 of the table
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
                    })
                ),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({
                  text: `(ii) That the deceased had died intestate on  ${payload.dod} .and without registering any nominee. `,
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
                  text: "(iii) That the following Claimant(s) has/have applied for the transmission of the aforesaid securities:",
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
                              text: "Name of the Claimant(s) ",
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
                ...payload.clamaints.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.namePan,
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
                                  text: item.addressAadhar,
                                  size: 25,
                                }),
                              ],
                            }),
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.pincodeBank,
                                  size: 25,
                                }),
                              ],
                            }),
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.phone,
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
                                  text: item.age,
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
                                  text: item.deceasedRelationship,
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
                    })
                ),
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
                  text: "(iv) That I / We are the legal heir(s) of the deceased holder, apart from the Claimant(s)who has/ have applied for transmission of the aforesaid securities and our details are as follows: ",
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
                ...payload.non_clamaints.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.namePan,
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
                                  text: item.addressAadhar,
                                  size: 25,
                                }),
                              ],
                            }),
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.pincodeBank,
                                  size: 25,
                                }),
                              ],
                            }),
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.phone,
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
                                  text: item.age,
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
                                  text: item.deceasedRelationship,
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
                    })
                ),
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
                  text: "(v) I / we hereby declare that, I / we do not desire to make any claim in respect of the title to the aforesaid securities held by the deceased and I / we hereby willfully relinquish & renounce all my /our rights in respect of the aforesaid securities and shall have no legal claim upon said securities in future. ",
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
                  text: `"(vi) Accordingly, I / we declare that I / we have NO OBJECTION WHATSOEVER in ${payload.companyName} transmitting the aforesaid securities in favour of the Claimant(s) Mr./Ms. ${payload.clamaints_pan_name}.`,
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
                  text: "(vii) I / we hereby state that whatever is stated herein above are true to the best of my/our knowledge and nothing has been concealed therein.",
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
                  text: "Name(s) and Signature(s) of Legal Heir(s) who are Non-Claimant(s)",
                  size: 25,
                  font: "Calibri",
                  bold: true,
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
                ...payload.non_clamaints.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "Name of the Non-Claimant: ",
                                  size: 25,
                                }),
                                new TextRun({
                                  text: item.namePan,
                                  size: 25,
                                  underline: {
                                    color: '#222222'
                                  },
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
                                  text: "Sign",
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
                        value: 800,
                        rule: HeightRule.ATLEAST,
                      },
                      cantSplit: true,
                    })
                ),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Name of the Non-Claimant:",
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
                              text: "Sign",
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
                    value: 800,
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "VERIFICATION",
                              size: 25,
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
                              text: "We hereby solemnly affirm and state that what is stated herein above is true to our knowledge and nothing has been concealed therein and that we are competent to contract and entitled to rights and benefits of the above mentioned securities. ",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Solemnly affirmed at : ",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Deponent(s) : `,
                              size: 25,
                              bold: true,
                            }),
                            new TextRun({
                              text: ` ${payload.clamaints_pan_name}`,
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
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
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/ANNEXURE_F_Generated.docx", buffer);
        console.log("✅ ANNEXURE_F_Generated.docx has been created.");
        resolve("✅ ANNEXURE_F_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
