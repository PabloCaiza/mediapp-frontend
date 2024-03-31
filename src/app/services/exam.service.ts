import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Exam } from '../model/exam';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamService extends GenericService<Exam> {

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/exams`)
  }

}
