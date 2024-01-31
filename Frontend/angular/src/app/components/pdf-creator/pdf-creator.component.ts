import { Component, Input } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-creator',
  templateUrl: './pdf-creator.component.html',
  styleUrls: ['./pdf-creator.component.css']
})
export class PdfCreatorComponent {

  @Input() data: any;
  @Input() columns: any;
  @Input() title: any;


  constructor(){}

  exportPDF(columnData: any, titlePDF: string, titleFile: string): void {
    let rows = [];
    let listReports = this.data.filteredData;
    rows.push(this.columns);
    listReports.forEach((item: any) => {
      let row:any = [];
      columnData.forEach((column: string) => {
        row.push(item[column]);
      });
  
      rows.push(row);
    });
    let title = titlePDF;
    const pdfDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        { text: title, style: 'subheader' },
        {
          style: 'tableExample',
          table: {
            widths: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55],
            heights: 30,
            body: rows,
          },
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 0, 0, 0]
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).download(titleFile);
  }
}
