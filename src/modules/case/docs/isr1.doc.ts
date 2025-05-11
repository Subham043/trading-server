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
                  text: "REQUEST FOR REGISTERING PAN, KYC DETAILS OR CHANGES / UPDATION THEREOF [For Securities (Shares / Debentures / Bonds, etc.) of listed companies held in physical form]",
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
              alignment: AlignmentType.LEFT,
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
                      children: [
                        ...payload.pans.flatMap((item) => {
                          return [
                            new Table({
                              columnWidths: [
                                ...Array(item.split("").length).fill(500),
                              ],
                              rows: [
                                new TableRow({
                                  children: [
                                    ...item.split("").map(
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
                        ...payload.aadhars.flatMap((item) => {
                          return [
                            new Table({
                              columnWidths: [
                                ...Array(item.split("").length).fill(500),
                              ],
                              rows: [
                                new TableRow({
                                  children: [
                                    ...item.split("").map(
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
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.DPID ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.DPID ?? "").split("").map(
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
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.dematAccountNo ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.dematAccountNo ?? "").split("").map(
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
                            new TextRun({
                              text: "1. Client Master List (CML) of your Demat Account, provided by the Depository Participant",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "2. Unique Identification Number (UID) (Aadhaar)",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "3. Valid Passport / Ration Card / Registered Lease or Sale Agreement of Residence / Driving License / Flat Maintenance bill.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "4. Utility bills like Telephone Bill (only land line) , Electricity bill or Gas bill - Not more than 3 months old.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "5. Identity card / document with address, issued by any of the following:  ",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Central/State Government and its Departments, Statutory / Regulatory Authorities, Public Sector Undertakings, Scheduled Commercial Banks, Public  Financial Institutions duly attested by the employer with date and  organisation stamp ",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "6. For FII / sub account, Power of Attorney given by FII / sub-account to the  Custodians (which are duly notarized and / or apostilled or consularised) that gives the registered address should be taken.",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "7. Proof of address in the name of the spouse accompanied with self attested copy of Identity Proof of the spouse. ",
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
                            new TextRun({
                              text: "original cancelled cheque with name of security holder printed on it or Bank Passbook or Bank Statement attested by the Bank #",
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
                        new Table({
                          columnWidths: [
                            ...Array(
                              (payload.phone ?? "").split("").length
                            ).fill(500),
                          ],
                          rows: [
                            new TableRow({
                              children: [
                                ...(payload.phone ?? "").split("").map(
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
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "7",
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
                              text: "Specimen Signature",
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
                              text: "Provide the banker’s attestation of the signature of the holder(s) as per Form ISR  -  2  in SEBI circular SEBI/HO/MIRSD_RTAMB/P/CIR/2021/655 dated November 03, 2021) and Original cancelled cheque",
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
                              text: "8",
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
                              text: "Nomination**",
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
                              text: "1. Providing Nomination: Please submit the duly filled up Nomination Form (SH-13) or ‘Declaration to Opt out of Nomination’ as per Form  ISR  -  3, in SEBI circular SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655  dated November 03, 2021",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "2. Change in Existing Nomination: Please use Form SH-14 in SEBI circular  SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655  dated November 03,2021",
                              size: 25,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "3. Cancellation of Existing Nomination: Please use Form SH-14 and Form ISR - 3",
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
                  text: "**Nomination (Form SH-13 or SH-14) / ‘Declaration to Opt-Out of Nomination’ ",
                  size: 25,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "(Form ISR – 3), has to be furnished by the holder(s) separately for each listed company.",
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
                  text: "Authorization: I / We authorise you (RTA) to update the above PAN and KYC details in my / our folio (s) ,  in which I / We are the holder(s) (strike off what is not applicable)",
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
                  text: "Declaration: All the above facts stated are true and correct. ",
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
          ],
        },
      ],
    });
  
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      // fs.writeFileSync("./static/word_output/ISR1_Generated.docx", buffer);
      console.log("✅ ISR1_Generated.docx has been created.");
      resolve("✅ ISR1_Generated.docx has been created.");
    }).catch((reason)=>reject(reason));
  })
};
