import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Specialty } from '../model/specialty';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends GenericService<Specialty> {

  private examChange: Subject<Specialty[]> = new Subject<Specialty[]>();
  private messageChange: Subject<string> = new Subject<string>();


  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/specialties`)
  }

    ///////////////////////
    setSpecialtyChange(data: Specialty[]) {
      this.examChange.next(data);
    }
  
    getSpecialtyChange() {
      return this.examChange.asObservable();
    }
  
    setMessageChange(data: string) {
      this.messageChange.next(data);
    }
  
    getMessageChange() {
      return this.messageChange.asObservable();
    }
}
