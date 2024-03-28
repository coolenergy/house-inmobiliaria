"use client";
import { useState, useEffect } from "react";
import { PDFViewer as PDF_Viewer } from "@react-pdf/renderer";

export default function PDFViewer({
  datasheet,
  className,
}: {
  datasheet: JSX.Element;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <PDF_Viewer className={className}>{datasheet}</PDF_Viewer>;
}
