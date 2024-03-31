import {Component, Inject, OnInit} from '@angular/core';
import {MaterialModule} from "../../../material/material.module";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {VitalSign} from "../../../model/vitalSign";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MedicDialogComponent} from "../../medic/medic-dialog/medic-dialog.component";
import {VitalSignsService} from "../../../services/vital-signs.service";
import {RouterLink} from "@angular/router";
import {map, Observable, startWith, Subject, switchMap} from "rxjs";
import {Patient} from "../../../model/patient";
import {PatientService} from "../../../services/patient.service";

@Component({
  selector: 'app-vital-signs-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgIf, ReactiveFormsModule, RouterLink, AsyncPipe],
  template: `
    <h5 mat-dialog-title>Signos Vitales</h5>
    <mat-dialog-content style="display: flex;flex-direction: row">
      <form [formGroup]="form" class="example-container" (submit)="operate()">
        <div [hidden]="true">
          <mat-form-field>
            <input matInput placeholder="ID" required formControlName="id">
          </mat-form-field>
        </div>
        <mat-form-field style="width: 100%">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker">
            <mat-icon matDatepickerToggleIcon>keyboard_arrow_down</mat-icon>
          </mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (f['date'].errors?.['required'] && f['date'].touched) {
            <mat-error>Is required</mat-error>
          }
        </mat-form-field>
        <div style="display: flex;flex-direction: row;justify-content: space-around">
          <div style="margin-right: 1rem">
            <mat-form-field>
              <input type="text" matInput placeholder="Pick Patient" required formControlName="patient"
                     [matAutocomplete]="auto" (keyup)="onChange($event)">
              <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayPatient">
                @for (patient of filteredPatients | async; track patient.idPatient) {
                  <mat-option [value]="patient">{{ patient.firstName }} {{ patient.lastName }}</mat-option>
                }
              </mat-autocomplete>
              @if (f['patient'].errors?.['required'] && f['patient'].touched) {
                <mat-error>Is required</mat-error>
              }
            </mat-form-field>
          </div>
          <div>
            <mat-form-field>
              <input matInput placeholder="Temperature" required formControlName="temperature">
              @if (f['temperature'].errors?.['required'] && f['temperature'].touched) {
                <mat-error>Is required</mat-error>
              }
            </mat-form-field>
          </div>
        </div>
        <div style="display: flex;flex-direction: row;justify-content: space-between">
          <div style="margin-right: 1rem">
            <mat-form-field>
              <input matInput placeholder="Pulse" required formControlName="pulse">
              @if (f['pulse'].errors?.['required'] && f['pulse'].touched) {
                <mat-error>Is required</mat-error>
              }
            </mat-form-field>
          </div>
          <div>
            <mat-form-field>
              <input matInput placeholder="Respiratory Rate" required formControlName="respiratoryRate">
              @if (f['respiratoryRate'].errors?.['required'] && f['respiratoryRate'].touched) {
                <mat-error>Is required</mat-error>
              }
            </mat-form-field>
          </div>
        </div>

        <button mat-raised-button color="primary" type="submit">
          <mat-icon>done</mat-icon>
          <span>Done</span>
        </button>

        <button mat-raised-button color="accent" type="button" (click)="close()">
          <mat-icon>cancel</mat-icon>
          <span>Cancel</span>
        </button>

      </form>

    </mat-dialog-content>
  `,
  styleUrl: './vital-signs-dialog.component.css'
})
export class VitalSignsDialogComponent implements OnInit {
  vitalSign: VitalSign;
  form: FormGroup
  patients: Patient[] = []
  filteredPatients: Observable<Patient[]>;
  inputChange = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) private data: VitalSign,
              private _diagloRef: MatDialogRef<MedicDialogComponent>,
              private vitalSignsService: VitalSignsService,
              private patientService: PatientService) {
    this.vitalSign = {...this.data}
    this.form = new FormGroup({
      id: new FormControl(this.vitalSign.id ?? 0),
      patient: new FormControl(this.vitalSign.patient ?? {}),
      date: new FormControl(this.vitalSign.date ?? '', [Validators.required]),
      temperature: new FormControl(this.vitalSign.temperature ?? '', [Validators.required]),
      pulse: new FormControl(this.vitalSign.pulse ?? '', [Validators.required]),
      respiratoryRate: new FormControl(this.vitalSign.respiratoryRate ?? '', [Validators.required])
    })
  }

  onChange(e) {
    this.inputChange.next(e.target.value)
  }

  ngOnInit(): void {
    this.patientService.findAll()
      .subscribe(value => this.patients = value);
    this.filteredPatients = this.inputChange.asObservable().pipe(map((value: string) => {
      console.log(value)
      console.log(this.patients)
      return this.patients
        .filter(patient => `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(value.toLowerCase().trim()))
    }))
  }


  operate() {
    if (this.vitalSign != null && this.vitalSign.id > 0) {
      this.updateVitalSign()
    } else {
      this.createVitalSign()
    }
  }

  createVitalSign() {
    this.vitalSignsService.save(this.form.value)
      .pipe(switchMap(() => this.vitalSignsService.findAll()))
      .subscribe(data => {
        this.vitalSignsService.setVitalSignChange(data)
        this.vitalSignsService.setMessageChange("CREATED");
      })
    this.close();
  }

  updateVitalSign() {
    this.vitalSignsService.update(this.vitalSign.id,this.form.value)
      .pipe(switchMap(() => this.vitalSignsService.findAll()))
      .subscribe(data => {
        this.vitalSignsService.setVitalSignChange(data)
        this.vitalSignsService.setMessageChange("UPDATED!!");
      })
    this.close();

  }

  displayPatient(patient: Patient) {
    return `${patient.firstName ?? ''} ${patient.lastName ?? ''}`
  }

  get f() {
    return this.form.controls;
  }

  close() {
    this._diagloRef.close()
  }


}
