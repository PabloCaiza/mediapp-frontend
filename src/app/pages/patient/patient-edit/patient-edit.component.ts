import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { NgIf } from '@angular/common';
import { Patient } from '../../../model/patient';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      dni: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          firstName: new FormControl(data.firstName, [
            Validators.required,
            Validators.minLength(3),
          ]),
          lastName: new FormControl(data.lastName, [
            Validators.required,
            Validators.minLength(3),
          ]),
          dni: new FormControl(data.dni, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ]),
          address: new FormControl(data.address, [
            Validators.required,
            Validators.maxLength(150),
          ]),
          phone: new FormControl(data.phone, [
            Validators.required,
            Validators.minLength(9),
          ]),
          email: new FormControl(data.email, [
            Validators.required,
            Validators.email,
          ]),
        });
      });
    }
  }

  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.patientService.update(this.id, patient).subscribe(() => {
        this.patientService.findAll().subscribe((data) => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('UPDATED!')
        });
      });
    } else {
      //INSERT
      //PRACTICA IDEAL
      this.patientService
        .save(patient)
        .pipe(switchMap(() => this.patientService.findAll()))
        .subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!')
        });
    }

    this.router.navigate(['/pages/patient']);

  }

  get f() {
    return this.form.controls;
  }
}
