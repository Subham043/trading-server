import { Decimal } from "@prisma/client/runtime/library";
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

type ISR1DocType = {
  companyName: string;
  companyOldName: string;
  Folio: string;
  combinedTotalNoOfShares: number;
  combinedTotalNoOfSharesWords: string | undefined;
  combinedTotalFaceValue: number | Decimal;
  certificate: {
    distinctiveNos: string;
    index: number;
    totalNoOfShares: string;
    certificateNumber: string;
    totalFaceValue: string;
    Folio: string;
    equityType: "Equity" | "Bonus" | "Rights" | "Splits" | "ShareBought";
  }[];
  // shareholderCertificateName: string[];
  shareholderCertificateName1: string;
  shareholderCertificateName2: string;
  shareholderCertificateName3: string;
  DPID: string | null;
  dematAccountNo: string | null;
  bankAccountNo: string | null;
  bankName: string | null;
  branchName: string | null;
  bankIFS: string | null;
  email: string | null;
  phone: string | null;
  declaration: {
    name: string | null;
    address: string;
    pin: string | null;
  }[];
  pans: string[];
  aadhars: string[];
};

export const generateISR1Doc: (payload: ISR1DocType, outputPath: string) => Promise<string> = (
  payload,
  outputPath
) => {
  return new Promise((resolve, reject) => {
    const declarationFields = [
      { label: "Name", key: "name" },
      { label: "Full address", key: "address" },
      { label: "PIN", key: "pin" },
    ];
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
                  text: "Form ISR – 1",
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
                  text: "REQUEST FOR REGISTERING PAN, KYC DETAILS OR CHANGES / UPDATION THEREOF",
                  bold: true,
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "[For Securities (Shares / Debentures / Bonds, etc.) of listed companies held in physical form]",
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
                  text: "A. I / We request you to Register / Change / Update the following (Tick ✔ relevant box)",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(" "),
            new Table({
              width: {
                size: 7000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [4000, 4000],
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
                              text: " PAN",
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
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Postal Address",
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
                              text: " Bank details",
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
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " E-mail address",
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
                              text: " Signature",
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
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Mobile number",
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
                              text: " Demat Account details",
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
                      children: [new Paragraph("")],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 4000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                  ],
                  height: {
                    value: 500,
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
                  text: "B. Security Details:",
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
              columnWidths: [4000, 4000, 3000],
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
                        size: 4000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text:
                                payload.companyName +
                                (payload.companyOldName.length > 0
                                  ? " [" + payload.companyOldName + "]"
                                  : ""),
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
                              text: "Folio No: ",
                              size: 25,
                            }),
                            new TextRun({
                              text: payload.Folio,
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
                              text: "Name(s) of the Security holder(s) as per the Certificate(s)",
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
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "1. ",
                              size: 25,
                            }),
                            new TextRun({
                              text: payload.shareholderCertificateName1,
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "2. ",
                              size: 25,
                            }),
                            new TextRun({
                              text: payload.shareholderCertificateName2,
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "3. ",
                              size: 25,
                            }),
                            new TextRun({
                              text: payload.shareholderCertificateName3,
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 7000, // 1/2 of the table
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
                              text: "Number & Face value of securities",
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
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: payload.combinedTotalNoOfShares.toString(),
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text:
                                "Rs. " +
                                payload.combinedTotalFaceValue.toString(),
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph(""),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 7000, // 1/2 of the table
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
                              text: "Distinctive number of securities",
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
                      children: payload.certificate.flatMap((item) => {
                        return [
                          new Paragraph(""),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.distinctiveNos,
                                size: 25,
                              }),
                            ],
                          }),
                          new Paragraph(""),
                        ];
                      }),
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 7000, // 1/2 of the table
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
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "C. I / We are submitting documents as per Table below (tick ✔as relevant, refer to the  instructions):",
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
              columnWidths: [500, 500, 2000, 8000],
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "✔",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Document / Information / Details",
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
                              text: "Instruction / Remark",
                              size: 25,
                              bold: true,
                            }),
                          ],
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
                              text: "1",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "PAN of (all) the (joint) holder(s)",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 10500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                      columnSpan: 3,
                    }),
                  ],
                  height: {
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),

                //problem starts here

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
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "PAN Whether it is Valid (linked to Aadhaar):",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Yes ",
                              size: 25,
                            }),
                            new CheckBox({
                              checked: false,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "No ",
                              size: 25,
                            }),
                            new CheckBox({
                              checked: false,
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
                      children: ([...payload.pans, ...payload.aadhars].filter((item) => !!item).length > 0) ? [
                        ...payload.pans.filter((item) => !!item).flatMap((item) => {
                          return [
                            new Table({
                              columnWidths: [
                                ...Array((item == '' ? " " : item).split("").length).fill(500),
                              ],
                              rows: [
                                new TableRow({
                                  children: [
                                    ...(item == '' ? " " : item).split("").map(
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
                          ];
                        }),
                        ...payload.aadhars.filter((item) => !!item).flatMap((item) => {
                          return [
                            new Table({
                              columnWidths: [
                                ...Array((item == '' ? " " : item).split("").length).fill(500),
                              ],
                              rows: [
                                new TableRow({
                                  children: [
                                    ...(item == '' ? " " : item).split("").map(
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
                          ];
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "PAN shall be valid only if it is linked to Aadhaar by March 31, 2023* For Exemptions / Clarifications on PAN, please refer to Objection Memo in Page  6 & 7",
                              size: 25,
                            }),
                          ],
                        }),
                      ] : [
                        new Paragraph("")
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 8000, // 1/2 of the table
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

                // problem ends here

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
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Demat Account Number",
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
                        new Paragraph(""),
                        payload.DPID ? new Table({
                          columnWidths: [
                            ...Array(
                              (payload.DPID ? payload.DPID : " ").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.DPID ? payload.DPID : " ").split("").map(
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
                        }) : new Paragraph(""),
                        new Paragraph(""),
                        payload.dematAccountNo ? new Table({
                          columnWidths: [
                            ...Array(
                              (payload.dematAccountNo ? payload.dematAccountNo : " ").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.dematAccountNo ? payload.dematAccountNo : " ").split("").map(
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
                        }) : new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Also provide Client Master List (CML) of your Demat Account, provided by the Depository Participant.",
                              size: 25,
                            }),
                          ],
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
                              text: "3",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Proof of Address of the first holder",
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
                              text: "Provide any one of the documents, only if there is change in the address;",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Client Master List (CML) of your Demat Account, provided by the Depository Participant",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Unique Identification Number (UID) (Aadhaar)",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Valid Passport/ Registered Lease or Sale Agreement of Residence / Driving License",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Flat Maintenance bill accompanied with additional self-attested copy of Identity Proof of the holder/claimant",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Utility bills like Telephone Bill (only land line)/ Electricity bill / Gas bill - Not more than 3 months old.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Identity card / document with address, issued by any of the following: Central/State Government and its Departments, Statutory / Regulatory Authorities, Public Sector Undertakings, Scheduled Commercial Banks, Public Financial Institutions duly attested by the employer with date and organisation stamp",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " For FII / sub account, Power of Attorney given by FII / sub-account to the Custodians (which are duly notarized and / or apostilled or consularised) that gives the registered address should be taken.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Proof of address in the name of the spouse accompanied with selfattested copy of Identity Proof of the spouse.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Client Master List (CML) of the Demat Account of the holder / claimant, provided by the Depository Participant.",
                              size: 25,
                            }),
                          ],
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
                              text: "4",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Bank details (to be updated for first holder in case of joint  holding)",
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
                              text: "ACCOUNT NUMBER:  ",
                              size: 25,
                              underline: {
                                color: "#222222",
                              },
                            }),
                            new TextRun({
                              text: payload.bankAccountNo ?? "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "BANK NAME:  ",
                              size: 25,
                              underline: {
                                color: "#222222",
                              },
                            }),
                            new TextRun({
                              text: payload.bankName ?? "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "BRANCH NAME:  ",
                              size: 25,
                              underline: {
                                color: "#222222",
                              },
                            }),
                            new TextRun({
                              text: payload.branchName ?? "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "IFS CODE:  ",
                              size: 25,
                              underline: {
                                color: "#222222",
                              },
                            }),
                            new TextRun({
                              text: payload.bankIFS ?? "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Original cancelled cheque bearing the name of the security holder; OR",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new CheckBox({
                              checked: false,
                            }),
                            new TextRun({
                              text: " Bank passbook/statement attested by the Bank;",
                              size: 25,
                            }),
                          ],
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
                              text: "5",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "E-mail  address ",
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
                              text: payload.email ?? "",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Alternatively the E-mail Address available in the CML will be updated in the folio",
                              size: 25,
                            }),
                          ],
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
                              text: "6",
                              size: 25,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
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
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Mobile",
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
                                ...(payload.phone ?? " ").split("").map(
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
                        }) : new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Alternatively the mobile number available in the CML will be updated in the folio",
                              size: 25,
                            }),
                          ],
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
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),

                // new TableRow({
                //   children: [
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "7",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 500, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 500, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "Specimen Signature",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 2000, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "Provide the banker’s attestation of the signature of the holder(s) as per Form ISR  -  2  in SEBI circular SEBI/HO/MIRSD_RTAMB/P/CIR/2021/655 dated November 03, 2021) and Original cancelled cheque",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 8000, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //   ],
                //   height: {
                //     value: 500,
                //     rule: HeightRule.ATLEAST,
                //   },
                //   cantSplit: true,
                // }),
                // new TableRow({
                //   children: [
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "8",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 500, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 500, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "Nomination**",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 2000, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //     new TableCell({
                //       children: [
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "1. Providing Nomination: Please submit the duly filled up Nomination Form (SH-13) or ‘Declaration to Opt out of Nomination’ as per Form  ISR  -  3, in SEBI circular SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655  dated November 03, 2021",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "2. Change in Existing Nomination: Please use Form SH-14 in SEBI circular  SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655  dated November 03,2021",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //         new Paragraph({
                //           children: [
                //             new TextRun({
                //               text: "3. Cancellation of Existing Nomination: Please use Form SH-14 and Form ISR - 3",
                //               size: 25,
                //             }),
                //           ],
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.CENTER,
                //       width: {
                //         size: 8000, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //   ],
                //   height: {
                //     value: 500,
                //     rule: HeightRule.ATLEAST,
                //   },
                //   cantSplit: true,
                // }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "* or any date as may be specified by the CBDT (DP: Depository Participant) ",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "# In case it is not provided, the details available in the CML will be updated in the folio",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(""),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Authorization: I/ We authorise you (RTA) to update the above PAN and KYC details in following additional folio(s) held in my / our name (use Separate Annexure if extra space is required):",
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
              columnWidths: [500, 2500, 2000, 2000, 2000, 2000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "S. No.",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 500, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Name of the Issuer Company",
                              size: 25,
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 2500, // 1/2 of the table
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
                        size: 2000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Quantity of securities",
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
                              text: "Face value of securities",
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
                              text: "Distinctive number of securities (Optional)",
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
                ...payload.certificate.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: item.index.toString(),
                                  size: 25,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                          width: {
                            size: 500, // 1/2 of the table
                            type: WidthType.DXA,
                          },
                        }),
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
                            size: 2500, // 1/2 of the table
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
                                  text: item.totalFaceValue,
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
                                  text: item.distinctiveNos,
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
                    })
                ),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "in which I / We are the holder(s) (strike off what is not applicable).",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(" "),
            new Paragraph(" "),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Declaration: ",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: "All the above facts stated are true and correct. ",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
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
                              text: "Holder 1",
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
                              text: "Holder 2",
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
                              text: "Holder 3",
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
                ...declarationFields.map(
                  ({ label, key }) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: label + " ",
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
                        ...payload.declaration.map(
                          (item) =>
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: item[key],
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
                            })
                        ),
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
            new Paragraph(" "),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Mode of submission of documents to the RTA",
                  size: 25,
                  font: "Calibri",
                  bold: true
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Please use any one of the following mode:",
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
                  text: "1. Through ‘In Person Verification’ (IPV):",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: "The authorized person of the RTA shall verify the original documents furnished by the investor and retain copy (ies) with IPV stamping with date and initials.",
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
                  text: "2. Through Post:",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: "Hard copies of the documents which are self-attested.",
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
                  text: "3. Through electronic mode with e-sign:",
                  size: 25,
                  font: "Calibri",
                  bold: true,
                }),
                new TextRun({
                  text: "The holder(s)/ claimant(s) may furnish the documents to RTAs electronically including by way of email or through service portal of the RTA provided the documents furnished shall have e-sign* of the holder(s)/ claimant(s).",
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
                  text: "*E-Sign is an integrated service which facilitates issuing a Digital Signature Certificate and performing signing of requested data by e-Sign user. The holder/claimant may approach any of the empanelled e-Sign Service Providers, details of which are available on the website of",
                  size: 25,
                  font: "Calibri",
                }),
                new TextRun({
                  text: "Controller of Certifying Authorities (CCA), Ministry of Communications and Information Technology (https://cca.gov.in/)",
                  size: 25,
                  font: "Calibri",
                  color: "#0000FF",
                  underline: {
                    color: "#0000FF",
                  }
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph(" "),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Note",
                  size: 25,
                  font: "Calibri",
                  bold: true
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Table({
              width: {
                size: 11000, // total width of the table in DXA (~6.25 inches)
                type: WidthType.DXA,
              },
              columnWidths: [3000, 8000],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Holders of physical securities in listed company are mandatorily required to furnish PAN, KYC details (Contact details, Bank Account Details, Signature) and Nomination (for all the eligible folios) to enable RTA to process any service request or complaints received from the security holder(s)/ Claimants.",
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
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Upon receipt or up-dation of bank details, the RTA shall, suo-moto, generate request to the company’s bankers to pay electronically all the moneys of / payments to the holder that were previous unclaimed / unsuccessful",
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
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "RTA shall update the folio with PAN, KYC details and Nominee, within timelines as mentioned in the circular no. SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/670 dated November 26, 2021. However, cancellation of nomination, shall take effect from the date on which this intimation is received by the company / RTA.",
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
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "RTA shall not insist on Affidavits or Attestation / Notarization or indemnity for registering / up-dating / changing PAN, KYC details and Nomination.",
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
                        size: 3000, // 1/2 of the table
                        type: WidthType.DXA,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Option A",
                              size: 25,
                              bold: true
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "i. Security holder shall provide the following documents:",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "(a) Original cancelled cheque with name of the security holder printed on it; or",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "(b) Self-attested copy of Bank Passbook/ Bank Statement;",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "and",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "ii. Banker’s attestation of the signature of the same bank account as mentioned in (i) above as per ",
                              size: 25,
                            }),
                            new TextRun({
                              text: "Form ISR - 2.",
                              size: 25,
                              bold: true
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "OR",
                              size: 25,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Option B",
                              size: 25,
                              bold: true
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "The investor may get his or her signature changed or updated by visiting the Office of the RTA in person. In such a case, the investor shall sign before the authorized personnel of the RTA, along with PAN card and any one additional document mentioned at Serial Nos. 1-4 of Annexure – E of SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 dated March 16, 2023, in original for verification by the RTA, and submit selfattested copies of the same.",
                              size: 25,
                            }),
                          ],
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
                              text: "Nomination**",
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
                              text: "Providing Nomination: Please submit the duly filled up Nomination Form (SH-13) or ‘Declaration to Opt out of Nomination’ as per Form ISR–3, in SEBI Circular No. SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 dated March 16, 2023",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Variation in Existing Nomination: Please use Form SH-14",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Cancellation of Existing Nomination and opting out: use Form SH14 & Form ISR – 3",
                              size: 25,
                            }),
                          ],
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
                    value: 500,
                    rule: HeightRule.ATLEAST,
                  },
                  cantSplit: true,
                }),
                // new TableRow({
                //   children: [
                //     new TableCell({
                //       children: [
                //         new Table({
                //           width: {
                //             size: 11000, // total width of the table in DXA (~6.25 inches)
                //             type: WidthType.DXA,
                //           },
                //           columnWidths: [3000, 8000],
                //           rows: [
                //             new TableRow({
                //               children: [
                //                 new TableCell({
                //                   children: [
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Specimen Signature",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                   ],
                //                   verticalAlign: VerticalAlign.CENTER,
                //                   width: {
                //                     size: 3000, // 1/2 of the table
                //                     type: WidthType.DXA,
                //                   },
                //                 }),
                //                 new TableCell({
                //                   children: [
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Option A",
                //                           size: 25,
                //                           bold: true
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "i. Security holder shall provide the following documents:",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "(a) Original cancelled cheque with name of the security holder printed on it; or",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "(b) Self-attested copy of Bank Passbook/ Bank Statement;",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "and",
                //                           size: 25,
                //                           bold: true,
                //                         }),
                //                       ],
                //                       alignment: AlignmentType.CENTER,
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "ii. Banker’s attestation of the signature of the same bank account as mentioned in (i) above as per ",
                //                           size: 25,
                //                         }),
                //                         new TextRun({
                //                           text: "Form ISR - 2.",
                //                           size: 25,
                //                           bold: true
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "OR",
                //                           size: 25,
                //                           bold: true,
                //                         }),
                //                       ],
                //                       alignment: AlignmentType.CENTER,
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Option B",
                //                           size: 25,
                //                           bold: true
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "The investor may get his or her signature changed or updated by visiting the Office of the RTA in person. In such a case, the investor shall sign before the authorized personnel of the RTA, along with PAN card and any one additional document mentioned at Serial Nos. 1-4 of Annexure – E of SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 dated March 16, 2023, in original for verification by the RTA, and submit selfattested copies of the same.",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                   ],
                //                   verticalAlign: VerticalAlign.CENTER,
                //                   width: {
                //                     size: 8000, // 1/2 of the table
                //                     type: WidthType.DXA,
                //                   },
                //                 }),
                //               ],
                //               height: {
                //                 value: 500,
                //                 rule: HeightRule.ATLEAST,
                //               },
                //               cantSplit: true,
                //             }),
                //             new TableRow({
                //               children: [
                //                 new TableCell({
                //                   children: [
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Nomination**",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                   ],
                //                   verticalAlign: VerticalAlign.CENTER,
                //                   width: {
                //                     size: 3000, // 1/2 of the table
                //                     type: WidthType.DXA,
                //                   },
                //                 }),
                //                 new TableCell({
                //                   children: [
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Providing Nomination: Please submit the duly filled up Nomination Form (SH-13) or ‘Declaration to Opt out of Nomination’ as per Form ISR–3, in SEBI Circular No. SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 dated March 16, 2023",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Variation in Existing Nomination: Please use Form SH-14",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                     new Paragraph({
                //                       children: [
                //                         new TextRun({
                //                           text: "Cancellation of Existing Nomination and opting out: use Form SH14 & Form ISR – 3",
                //                           size: 25,
                //                         }),
                //                       ],
                //                     }),
                //                   ],
                //                   verticalAlign: VerticalAlign.CENTER,
                //                   width: {
                //                     size: 8000, // 1/2 of the table
                //                     type: WidthType.DXA,
                //                   },
                //                 }),
                //               ],
                //               height: {
                //                 value: 500,
                //                 rule: HeightRule.ATLEAST,
                //               },
                //               cantSplit: true,
                //             }),
                //           ],
                //           alignment: AlignmentType.CENTER,
                //         }),
                //       ],
                //       verticalAlign: VerticalAlign.TOP,
                //       width: {
                //         size: 11000, // 1/2 of the table
                //         type: WidthType.DXA,
                //       },
                //     }),
                //   ],
                //   height: {
                //     value: 500,
                //     rule: HeightRule.ATLEAST,
                //   },
                //   cantSplit: true,
                // }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "** Nomination (Form SH-13 or SH-14) / ‘Declaration to Opt-Out of nomination’ (Form ISR – 3), has to be furnished by the holder(s) separately for each listed company.",
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
      fs.writeFileSync(outputPath, buffer);
      // fs.writeFileSync("./static/word_output/ISR1_Generated.docx", buffer);
      console.log("✅ ISR1_Generated.docx has been created.");
      resolve("✅ ISR1_Generated.docx has been created.");
    }).catch((reason) => reject(reason));
  })
};
