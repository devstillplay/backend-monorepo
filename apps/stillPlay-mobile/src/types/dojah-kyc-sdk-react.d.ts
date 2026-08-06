declare module "dojah-kyc-sdk-react" {
  import type { Component } from "react";

  type DojahKycProps = {
    appID: string;
    publicKey: string;
    type: string;
    response: (type: string, data?: unknown) => void;
    config?: { widget_id?: string; webhook?: boolean; [key: string]: unknown };
    userData?: Record<string, string | undefined>;
    govData?: Record<string, string>;
    metadata?: Record<string, unknown>;
    referenceId?: string;
    env?: "development";
  };

  export default class Dojah extends Component<DojahKycProps> {}
}
