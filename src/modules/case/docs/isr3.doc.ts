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

type ISR3DocType = {
  companyName: string;
  companyOldName: string;
  companyRegisteredOffice: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  shareholderCertificateNames: string;
  certificate: {
    totalNoOfShares: string;
    certificateNumber: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
    distinctiveNos: string;
    index: number;
  }[];
  declaration: {
    name: string | null;
    address: string;
    pin: string | null;
  }[];
};

export const generateISR3Doc: (
  payload: ISR3DocType,
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
                  text: "Form ISR – 3",
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
                  text: "Declaration Form for Opting-out of Nomination by holders of physical securities in Listed Companies",
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
                  text: "(see SEBI circular No. SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655 dated November 03, 2021 on Common and Simplified Norms for processing investor’s service request by RTAs and norms for furnishing PAN, KYC details and Nomination)",
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
                  text: "[Under Section 72 r/w Section 24 (1) (a) of Companies Act, 2013 r/w Section 11(1) and 11B of SEBI Act, 1992 and Clause C in Schedule VII and Regulation 101 of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015)]",
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
                  text: `Name of the Company: ${payload.companyName} ${
                    payload.companyOldName.length > 0
                      ? "[" + payload.companyOldName + "]"
                      : ""
                  }`,
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
                  text: `Registered Address of the Company: ${payload.companyRegisteredOffice}, ${payload.companyCity}, ${payload.companyState}, ${payload.companyPincode}`,
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
                  text: `I/ we ${payload.shareholderCertificateNames} the holder(s) of the securities particulars of which are given here under in whom shall vest, all the rights in respect of such securities in the event of my /our death.`,
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
                  text: "PARTICULARS OF THE SECURITIES (in respect of which nomination is being opted out)",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),

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
                ...payload.certificate.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.equityType,
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
                                  text: item.Folio,
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
                                  text: item.certificateNumber,
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
                                  text: item.distinctiveNos,
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
                  text: "I/ we understand the issues involved in non-appointment of nominee(s) and further are aware that in case of my / our death, my / our legal heir(s) / representative(s) are required to furnish the requisite documents / details, including, Will or documents issued by the Court like Decree or Succession Certificate or Letter of Administration / Probate of Will or any other document as may be prescribed by the competent authority, for claiming my / our aforesaid securities.",
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
                              text: "Name(s) and Address of Security holders(s) ",
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
                              text: "Signature(s) Sole",
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
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        ...payload.declaration.map(
                          (item) =>
                            new Table({
                              width: {
                                size: 5500, // total width of the table in DXA (~6.25 inches)
                                type: WidthType.DXA,
                              },
                              columnWidths: [5500],
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
                                              text: item.name ? item.name : "",
                                              size: 25,
                                            }),
                                          ],
                                        }),
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: item.address ? item.address : "",
                                              size: 25,
                                            }),
                                          ],
                                        }),
                                        new Paragraph({
                                          children: [
                                            new TextRun({
                                              text: item.pin ? item.pin : "",
                                              size: 25,
                                            }),
                                          ],
                                        }),
                                        new Paragraph("")
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
                            }),
                        ),
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
                              text: "Name and Address of Witness",
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
                              text: "Signature",
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
                    value: 1000,
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
        // fs.writeFileSync("./static/word_output/ISR3_Generated.docx", buffer);
        console.log("✅ ISR3_Generated.docx has been created.");
        resolve("✅ ISR3_Generated.docx has been created.");
      })
      .catch((reason) => reject(reason));
  });
};
