import { ReactNode } from "react";

export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app-root" suppressHydrationWarning>
      {children}
    </div>
  );
}
