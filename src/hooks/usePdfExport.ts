import { useRef, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const usePdfExport = () => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePdf = useCallback(async (filters?: any) => {
    const element = pdfRef.current;
    if (!element) {
      console.error("Elemento não encontrado para exportação");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        ignoreCSSOM: false,
        onclone: (clonedDoc, clonedElement) => {
          const walker = clonedDoc.createTreeWalker(
            clonedElement,
            NodeFilter.SHOW_ELEMENT,
            null
          );

          let node;
          while ((node = walker.nextNode())) {
            const element = node as HTMLElement;
            const style = window.getComputedStyle(element);

            if (style.backgroundColor.includes("oklch")) {
              element.style.backgroundColor = getFallbackColor(
                style.backgroundColor
              );
            }

            if (style.color.includes("oklch")) {
              element.style.color = getFallbackColor(style.color, true);
            }
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        (pdfWidth - 40) / imgWidth,
        (pdfHeight - 60) / imgHeight
      );
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 30;

      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Relatório de Contas", pdfWidth / 2, 15, { align: "center" });

      if (filters) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);

        let infoY = 22;

        if (filters.dateRange?.start && filters.dateRange?.end) {
          pdf.text(
            `Período: ${filters.dateRange.start} à ${filters.dateRange.end}`,
            14,
            infoY
          );
          infoY += 4;
        }

        if (filters.costCenter) {
          pdf.text(`Empresa: ${filters.costCenter}`, 14, infoY);
          infoY += 4;
        }

        pdf.text(
          `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
          14,
          infoY
        );

        imgY = infoY + 10;
      }

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(
        `relatorio-contas-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Erro com html2canvas-pro:", error);
    }
  }, []);

  return { pdfRef, generatePdf };
};

function getFallbackColor(oklchColor: string, isText: boolean = false): string {
  if (oklchColor.includes("oklch")) {
    if (oklchColor.includes("0.9") || oklchColor.includes("0.95")) {
      return isText ? "#1f2937" : "#f8fafc";
    }
    if (oklchColor.includes("0.5") || oklchColor.includes("0.6")) {
      return isText ? "#ffffff" : "#6b7280";
    }
    if (oklchColor.includes("0.2") || oklchColor.includes("0.3")) {
      return isText ? "#ffffff" : "#374151";
    }
  }
  return isText ? "#000000" : "#ffffff";
}
