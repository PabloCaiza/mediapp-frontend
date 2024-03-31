import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { NgFor } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [NgFor, MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent implements OnInit {

  //patients: Patient[] = [];
  dataSource: MatTableDataSource<Patient>;
  displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    /*this.patientService.findAll().subscribe(data => {
      this.createTable(data);
    });*/
    this.patientService.listPageable(0, 1).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });

    this.patientService.getPatientChange().subscribe(data => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'})
    });    
  }

  createTable(data: Patient[]){    
    this.dataSource = new MatTableDataSource(data);    
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  delete(idPatient: number){
    this.patientService.delete(idPatient)
    .pipe(switchMap( ()=> this.patientService.findAll() ))
    .subscribe(data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('DELETED!');
    })
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  showMore(e: any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }
}
