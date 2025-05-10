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

type FORMADocType = {
  companyName: string;
  companyOldName: string;
  shareholderNameDeath: string;
  Folio: string;
  details: {
    name: string;
    address: string;
    pin: string;
    pan: string;
    namePan: string;
    deceasedRelationship: string;
  }[];
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

export const generateFormADoc: (
  payload: FORMADocType,
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
                              text: "FORM-A",
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
                  text: "AFFIDAVIT",
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
                  text: "[For issuance of Duplicate Securities]",
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
              columnWidths: [11000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Note: This affidavit is to be executed in the presence of a Public Notary",
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
                  text: "(Presently for the State of Maharashtra Rs.100/-",
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
                  text: `I/We, ${payload.details
                    .map(
                      (item) =>
                        `${item.name} ${item.deceasedRelationship} of ${payload.shareholderNameDeath} residing at ${item.address}, ${item.pin} having Permanent Account No (s) ${item.pan}`
                    )
                    .join(
                      " ;"
                    )}  do hereby solemnly affirm and state on oath as follows.`,
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
                  text: `1. That I/We, ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} hold the following (number of) securities under below mentioned folio(s),pertain to  understated company  in my/ our name as single holder / joint holder:`,
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
              columnWidths: [2000, 2000, 2000, 2000, 1500, 1500],
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
                              text: "Securities held",
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
                              text: "Security Certificate No.",
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
                            size: 2000, // 1/2 of the table
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
                            size: 2000, // 1/2 of the table
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
                            size: 2000, // 1/2 of the table
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
                  text: `2. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} further swear / solemnly declare that I/ we am/are applying for issue of duplicate certificate(s) to me/us on the ground that the original security(ies) certificate(s) has/have been misplaced / not found by me/us, despite a diligent search made by me/us in this behalf.`,
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
                  text: `"3. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} further swear /solemnly declare that the said securities are not sold or pledged or deposited by way of security to any person/company.`,
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
                  text: `4. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} here by further swear / solemnly declare that if, after the duplicate share certificate(s) is / are issued to us as aforesaid, the original security(ies) certificate(s) is / are at any time subsequently, found, recovered or traced by us or by anyone on our behalf, then, we unconditionally undertake not to deal with the said original share certificate(s) in any manner whatsoever (whether by physical transfer or dematerialization or as security or pledge) and further unconditionally undertake to promptly surrender the original share certificate(s) to the RTA / Company, for cancellation.`,
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
                  text: `5. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} am/are making the above solemn declaration on oath with full knowledge of the fact that in the event the original security(ies) certificate(s) issued is /are found, recovered and traced by me/us and instead of surrendering the same is / are dealt with by me/us as aforesaid, the Company will be at liberty to adopt civil and / or criminal proceedings against me/us for my/our failure to promptly surrender the original security(ies) certificate(s), for cancellation and for breach of my/our solemn declaration and undertaking not to deal with the original security(ies) certificate(s) in any manner whatsoever as aforesaid at my/our entire risk as to cost and consequences. `,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Table({
              width: {
                size: 8000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [3000, 5000],
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
                              text: "Signature of all deponents:",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
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
                              text: "_________________________________",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
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
                              text: "_________________________________",
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
                              text: "_________________________________",
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
                    value: 1000,
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
                  text: "VERIFICATION",
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
                  text: "We hereby solemnly affirm and state that what is stated herein above is true to our knowledge and nothing has been concealed therein and that we are competent to contract and entitled to rights and benefits of the above mentioned securities.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Table({
              width: {
                size: 6000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [3000, 5000],
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
                ...payload.details.map(
                  (item, index) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: index===0 ? "Name/s of the Deponent(s) " : "",
                                  size: 25,
                                }),
                              ],
                              alignment: AlignmentType.RIGHT,
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
                                  text: `${(index + 1) + ". " + item.namePan}`,
                                  size: 25,
                                  underline: {
                                    color: "#222222",
                                  },
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
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
                              text: "Solemnly affirmed at",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
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
                              text: " _________________________________",
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
                    value: 1000,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph(""),

            new Table({
              width: {
                size: 6000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [4000, 4000],
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
                              text: "Signature of the Deponent(s): ",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
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
                              text: "1. ____________________________",
                              size: 25,
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
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
                              text: "2. ____________________________",
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
                              text: "3. ____________________________",
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
                    value: 1000,
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
                  text: "Place: _________________________",
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
                  text: "Date: _________________________",
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
                  text: "Signature and Official Seal of Notary & Regn. No.",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc)
      .then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        // fs.writeFileSync("./static/word_output/FORM_A_Generated.docx", buffer);
        console.log("✅ FORM_A_Generated.docx has been created.");
        resolve("✅ FORM_A_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
