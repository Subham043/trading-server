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

type AFFIDAVITDocType = {
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

export const generateAffidavit3Doc: (
  payload: AFFIDAVITDocType,
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

            new Paragraph({
              children: [
                new TextRun({
                  text: "Format for Affidavit-cum-Indemnity",
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
                  text: "AFFIDAVIT-CUM-INDEMNITY",
                  bold: true,
                  size: 27,
                  font: "Calibri",
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
                              text: "Note: In cases where the value of securities exceeds Rs. Ten Thousand, this affidavit-cum-indemnity shall be executed in the presence of a Public Notary. If the value of securities is up to Rs, Ten Thousand, this affidavit-cumindemnity may be submitted on a plain paper",
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
                  text: "[In cases where the value of securities exceeds Rs. Ten Thousand, this affidavit-cumindemnity shall be submitted in non-judicial stamp paper of appropriate value as prescribed by the Stamp Act of the state where the claimant resides. If the value of securities is up to Rs, Ten Thousand, this affidavit-cum-indemnity may be submitted on a plain paper.]",
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
                              text: "Number and face value of securities held",
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
                                  text: `${payload.companyName} ${payload.companyOldName.length > 0
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
                    )} swear / solemnly declare that the above securities were acquired by me/us for valuable consideration out of my/our own investment/funds against allotment in Public Issue/allotment in Right Issue or acquired from the market/through inheritance in the year(s).`,
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
                  text: `3. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )}  further swear / solemnly declare that I/ we am/are applying for issue of duplicate certificate(s) to me/us on the ground that the original security(ies) certificate(s) has/have been misplaced / not found by me/us, despite a diligent search made by me/us in this behalf.`,
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
                  text: `5. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} hereby further swear / solemnly declare that if, after the duplicate share certificate(s) is / are issued to us as aforesaid, the original security(ies) certificate(s) is / are at any time subsequently, found, recovered or traced by us or by anyone on our behalf, then, we unconditionally undertake not to deal with the said original share certificate(s) in any manner whatsoever (whether by physical transfer or dematerialization or as security or pledge) and further unconditionally undertake to promptly surrender the original share certificate(s) to the RTA / Company, for cancellation.`,
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
                  text: `6. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} am/are making the above solemn declaration on oath with full knowledge of the fact that in the event the original security (ies) certificate(s) issued is /are found, recovered and traced by me/us and instead of surrendering the same is / are dealt with by me/us as aforesaid, the Company will be at liberty to adopt civil and / or criminal proceedings against me/us for my/our failure to promptly surrender the original security (ies) certificate(s), for cancellation and for breach of my/our solemn declaration and undertaking not to deal with the original security (ies) certificate(s) in any manner whatsoever as aforesaid at my/our entire risk as to cost and consequences.`,
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
                  text: `7. I/We ${payload.details
                    .map((item) => item.namePan)
                    .join(
                      " ;"
                    )} hereby jointly and severely agree and undertake to indemnify and keep indemnified, saved, defended, harmless, the aforesaid (Name of the Company/RTA) and its successors and assigns for all time hereafter against all losses, costs, claims, actions, demands, risks, charges, expenses, damages, etc., whatsoever which you may suffer and/or incur by reason of your, at my/our request, issuing the said Duplicate Securities as herein above mentioned, to the undersigned.`,
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
                                          text: `Tel No: `,
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                    payload.phone ? new Table({
                                      columnWidths: [
                                        ...Array(
                                          (payload.phone ?? " ").split("").length
                                        ).fill(500),
                                      ],
                                      rows: [
                                        new TableRow({
                                          children: [
                                            ...(payload.phone ?? " ")
                                              .split("")
                                              .map(
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
                                                        alignment:
                                                          AlignmentType.CENTER,
                                                      }),
                                                    ],
                                                    verticalAlign:
                                                      VerticalAlign.CENTER,
                                                  })
                                              ),
                                          ],
                                        }),
                                      ],
                                    }) : new Paragraph(""),
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
                                          text: `Email Id: ${payload.email}`,
                                          size: 25,
                                          bold: true,
                                        }),
                                      ],
                                    }),
                                    new Paragraph(""),
                                  ],
                                  verticalAlign: VerticalAlign.CENTER,
                                  width: {
                                    size: 5500, // 1/2 of the table
                                    type: WidthType.DXA,
                                  },
                                  columnSpan: 2
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
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Signature Checked By: __________________",
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
        // fs.writeFileSync("./static/word_output/FORM_B_Generated.docx", buffer);
        console.log("✅ Affidavit3_Generated.docx has been created.");
        resolve("✅ Affidavit3_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
