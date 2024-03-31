import {Injectable} from '@angular/core';
import {GenericService} from "./generic.service";
import {VitalSign} from "../model/vitalSign";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService extends GenericService<VitalSign> {

  private vitalSignsChange: Subject<VitalSign[]> = new Subject<VitalSign[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/signs`);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getVitalSignChange() {
    return this.vitalSignsChange.asObservable();
  }

  setVitalSignChange(signs: VitalSign[]) {
    this.vitalSignsChange.next(signs);
  }
}
