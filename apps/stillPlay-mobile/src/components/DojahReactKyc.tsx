"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";

import {
  dojahDebugLog,
  getDojahClientConfig,
  getDojahConnectEnvProp,
} from "@/lib/dojahConfig";

const DojahWidget = dynamic(() => import("dojah-kyc-sdk-react"), {
  ssr: false,
});

export type DojahReactKycProps = {
  referenceId: string;
  metadata: Record<string, unknown>;
  userData?: Record<string, string | undefined>;
  govData?: Record<string, string>;
  onSuccess: (data: unknown) => void;
  onError: (message?: string) => void;
  onClose: () => void;
};

/**
 * Dojah KYC via the official React SDK (`dojah-kyc-sdk-react`).
 * Mount only when starting a session — the widget opens on mount.
 * @see https://docs.dojah.io/sdks/react-library
 */
export default function DojahReactKyc({
  referenceId,
  metadata,
  userData = {},
  govData = {},
  onSuccess,
  onError,
  onClose,
}: DojahReactKycProps) {
  const { appID, publicKey, widgetId } = useMemo(() => getDojahClientConfig(), []);
  const env = getDojahConnectEnvProp();

  const response = useCallback(
    (type: string, data?: unknown) => {
      dojahDebugLog("React SDK response:", type, data);
      if (type === "success") {
        console.log("Dojah KYC success:", data);
        onSuccess(data);
        return;
      }
      if (type === "error") {
        const message =
          data instanceof Error
            ? data.message
            : typeof data === "string"
              ? data
              : "Verification error.";
        onError(message);
        return;
      }
      if (type === "close") {
        onClose();
      }
    },
    [onClose, onError, onSuccess]
  );

  const config = useMemo(() => ({ widget_id: widgetId }), [widgetId]);

  return (
    <DojahWidget
      appID={appID}
      publicKey={publicKey}
      type="custom"
      config={config}
      userData={userData}
      govData={govData}
      metadata={metadata}
      referenceId={referenceId}
      response={response}
      {...(env ? { env } : {})}
    />
  );
}
