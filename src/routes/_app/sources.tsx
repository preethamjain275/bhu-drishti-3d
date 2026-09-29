import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sources")({
  validateSearch: (s: Record<string, unknown>): { [key: string]: unknown } => {
    return { ...s };
  },
  beforeLoad: () => {
    throw redirect({
      to: "/data-sources",
    });
  },
});
