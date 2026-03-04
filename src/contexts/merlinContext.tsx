/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { merlinInterpret, merlinSnapshot } from "@/services/merlin.service";

type MerlinScope = "branch" | "entity" | "employee";

export type MerlinResult = {
  headline?: string;
  summary?: string;
  body?: string;
  actions?: string[];
  confidenceNote?: string;
};

type MerlinContextType = {
  status: "idle" | "pending" | "ready" | "error";
  result: MerlinResult | null;
  path: string | null;
  run: (args: { entityId: string; branchIds?: string[]; scope: MerlinScope; authToken?: string; locale?: string }) => Promise<void>;
  reset: () => void;
  setStatus: (s: MerlinContextType["status"]) => void;
  setResult: (r: MerlinResult | null) => void;
  setPath: (p: string | null) => void;
};

const MerlinContext = createContext<MerlinContextType | null>(null);

export const MerlinProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<MerlinContextType["status"]>("idle");
  const [result, setResult] = useState<MerlinResult | null>(null);
  const [path, setPath] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setPath(null);
  }, []);

  const run = useCallback(async ({ entityId, branchIds = [], scope, authToken, locale = "es" }: { entityId: string; branchIds?: string[]; scope: MerlinScope; authToken?: string; locale?: string }) => {
    setStatus("pending");
    setResult(null);
    setPath(null);
    try {
      const resp = await merlinInterpret({
        request: {
          branchIds,
          lang: locale,
          locale,
          entityId,
          target: scope,
        },
      }, authToken);
      if (resp.code === "ai/cache_hit" && (resp as any).result) {
        setResult((resp as any).result);
        setStatus("ready");
      } else if (resp.code === "ai/analysing" && (resp as any).path) {
        setPath((resp as any).path);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [setStatus, setResult, setPath]);

  const value = useMemo(
    () => ({ status, result, path, run, reset, setStatus, setResult, setPath }),
    [status, result, path, run, reset]
  );

  return <MerlinContext.Provider value={value}>{children}</MerlinContext.Provider>;
};

export const useMerlin = () => {
  const ctx = useContext(MerlinContext);
  if (!ctx) throw new Error("useMerlin must be used within MerlinProvider");
  return ctx;
};
