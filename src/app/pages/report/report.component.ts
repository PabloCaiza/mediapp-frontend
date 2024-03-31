import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ConsultService } from '../../services/consult.service';
import { Chart, ChartType } from 'chart.js/auto';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule, PdfViewerModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{

  chart: Chart;
  type: ChartType = 'line';
  lineType: ChartType = 'line';
  barType: ChartType = 'bar';
  doughnutType: ChartType = 'doughnut';
  radarType: ChartType = 'radar';
  pieType: ChartType = 'pie';

  pdfSrc: string;

  selectedFiles: FileList;
  filename: string;
  imageData: SafeResourceUrl; //any

  imageSignal = signal(null);
  
  constructor(
    private consultService: ConsultService,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
      this.draw();     
  }

  change(type: string) {
    switch (type) {
      case 'line':
        this.type = this.lineType;
        break;
      case 'bar':
        this.type = this.barType;
        break;
      case 'doughnut':
        this.type = this.doughnutType;
        break;
      case 'radar':
        this.type = this.radarType;
        break;
      case 'pie':
        this.type = this.pieType;
        break;
      default:
        break;
    }

    if(this.chart != null){
      this.chart.destroy();
    }
    this.draw();
  }

  draw(){
    this.consultService.callProcedureOrFunction().subscribe(data => {
        const dates = data.map( x => x.consultdate);
        const quantities = data.map(x => x.quantity);

        //console.log(dates);
        //console.log(quantites);

        this.chart = new Chart('canvas', {
          type: this.type,
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Quantity',
                data: quantities,
                borderColor: '#3cba9f',
                fill: false,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 0, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                display: true,
              },
              y: {
                display: true,
                beginAtZero: true,
              },
            },
          },
        });
    });
  }

  viewReport(){
    this.consultService.generateReport().subscribe(data => {
      this.pdfSrc = window.URL.createObjectURL(data);
    });
  }

  downloadReport(){
    this.consultService.generateReport().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      //console.log(url);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.pdf';
      a.click();
    });
  }

  selectFile(e: any){
    this.selectedFiles = e.target.files;
    this.filename = e.target.files[0]?.name;
  }

  upload(){
    this.consultService.saveFile(this.selectedFiles.item(0)).subscribe();
  }

  viewImage(){
    this.consultService.readFile(1).subscribe(data => {
      this.convertToBase64(data);
    });
  }

  convertToBase64(data: any){
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const base64 = reader.result;
      //console.log(base64);
      //this.imageData = base64;
      this.applySanitizer(base64);
    }
  }

  applySanitizer(base64: any){
    this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(base64);    
    this.imageSignal.set(this.imageData);
  }
}
