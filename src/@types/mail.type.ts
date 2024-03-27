export declare type FastifyMailOptionsType = {
  defaults: { from: string };
  transport: {
    host: string;
    port: number;
    secure: boolean; // use TLS
    tls?: {
      rejectUnauthorized: boolean;
    };
    auth: {
      user: string;
      pass: string;
    };
  };
};

export declare type FastifyMailType = {
  sendMail(
    email: {
      to: string;
      subject: string;
      text: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (errors: any, info: any) => void,
  ): void;
};
