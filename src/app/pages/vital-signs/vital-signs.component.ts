import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {MatTableDataSource} from "@angular/material/table";
import {VitalSign} from "../../model/vitalSign";
import {VitalSignsService} from "../../services/vital-signs.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {VitalSignsDialogComponent} from "./vital-signs-dialog/vital-signs-dialog.component";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './vital-signs.component.html',
  styleUrl: './vital-signs.component.css'
})
export class VitalSignsComponent implements OnInit {
  displayedColumns = ['id', 'date', 'temperature', 'pulse', 'respiratoryRate','actions']
  dataSource: MatTableDataSource<VitalSign>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vitalSignsService: VitalSignsService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.vitalSignsService.findAll()
      .subscribe(data => this.createTable(data)
      )
    this.vitalSignsService.getVitalSignChange()
      .subscribe(data => this.createTable(data))
    this.vitalSignsService.getMessageChange()
      .subscribe(data => {
        this._snackBar.open(data, 'INFO', {duration: 2000})
      })

  }

  createTable(data: VitalSign[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(vitalSign?: VitalSign) {
    this.dialog.open(VitalSignsDialogComponent, {
      width: '500px',
      data: vitalSign,
      disableClose: false,
    })
  }

  delete(idVitalSign:number){
    this.vitalSignsService
      .delete(idVitalSign)
      .pipe(switchMap(()=>this.vitalSignsService.findAll()))
      .subscribe(data=>{
        this.vitalSignsService.setVitalSignChange(data);
        this.vitalSignsService.setMessageChange("DELETED!!");
      })
  }

}
