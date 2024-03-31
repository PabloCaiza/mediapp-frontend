import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConsultListExamDTOI } from '../model/consultListExamDTOI';
import { FilterConsultDTO } from '../model/filterConsultDTO';
import { Consult } from '../model/consult';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  private url: string = `${environment.HOST}/consults`

  constructor(private http: HttpClient) { }

  saveTransactional(dto: ConsultListExamDTOI){
    return this.http.post(this.url, dto);
  }

  searchOthers(dto: FilterConsultDTO){    
    return this.http.post<Consult[]>(`${this.url}/search/others`, dto);
  }

  searchByDates(date1: string, date2: string){
    /*const params: HttpParams = new HttpParams();
    params.set('date1', date1);
    params.set('date2', date2);
    
    return this.http.get<Consult[]>(`${this.url}/search/dates`, {
      params: params
    });*/

    return this.http.get<Consult[]>(`${this.url}/search/dates?date1=${date1}&date2=${date2}`);
  }

  getExamsByIdConsult(idConsult: number){
    return this.http.get<any>(`${environment.HOST}/consultexams/${idConsult}`);
  }

  callProcedureOrFunction(){
    return this.http.get<any>(`${this.url}/callProcedureNative`)
  }

  //pdf
  generateReport(){
    return this.http.get(`${this.url}/generateReport`, { responseType: 'blob'});
  }

  //Files, Image
  saveFile(data: File){
    const formdata: FormData = new FormData();
    formdata.append('file', data);

    /*const patientBlob = new Blob([JSON.stringify(patient)], { type: "application/json" });
    formdata.append('patient', patientBlob)*/

    return this.http.post(`${this.url}/saveFile`, formdata);
  }
  
  readFile(id: number){
    return this.http.get(`${this.url}/readFile/${id}`, { responseType: 'blob'});
  }
}
