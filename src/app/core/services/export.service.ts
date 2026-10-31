import { Injectable } from '@angular/core';

/** Columna de un informe: clave del dato y título que se muestra. */
export interface ColumnaInforme {
  key: string;
  label: string;
}

/** Genera y descarga informes tabulados en PDF y CSV. */
@Injectable({ providedIn: 'root' })
export class ExportService {
  /** Informe PDF con cabecera corporativa, tabla y pie de página. */
  async exportarPdf(titulo: string, columnas: ColumnaInforme[], filas: object[]): Promise<void> {
    // Carga bajo demanda: las librerías solo se descargan al pulsar el botón
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    const pdf = new jsPDF();

    pdf.setFillColor(29, 78, 216);
    pdf.rect(0, 0, 210, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('JG Cables', 14, 13);
    pdf.setFontSize(11);
    pdf.text(titulo, 14, 21);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 196, 21, { align: 'right' });

    autoTable(pdf, {
      startY: 36,
      head: [columnas.map(c => c.label)],
      body: filas.map(fila => columnas.map(c => this.valor(fila, c.key))),
      headStyles: { fillColor: [29, 78, 216] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      didDrawPage: () => {
        pdf.setFontSize(9);
        pdf.setTextColor(90, 90, 90);
        pdf.text(`JG Cables · Sistema de gestión · Página ${pdf.getNumberOfPages()}`, 14, 290);
      }
    });

    pdf.save(`${this.nombre(titulo)}.pdf`);
  }

  /** CSV separado por ";" con BOM para que Excel muestre bien las tildes. */
  exportarCsv(titulo: string, columnas: ColumnaInforme[], filas: object[]): void {
    const escapar = (texto: string) => `"${texto.replace(/"/g, '""')}"`;
    const lineas = [
      columnas.map(c => escapar(c.label)).join(';'),
      ...filas.map(fila => columnas.map(c => escapar(this.valor(fila, c.key))).join(';'))
    ];
    const blob = new Blob(['\uFEFF' + lineas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${this.nombre(titulo)}.csv`;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  private valor(fila: object, clave: string): string {
    return String((fila as Record<string, unknown>)[clave] ?? '');
  }

  private nombre(titulo: string): string {
    return `${titulo.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
  }
}
