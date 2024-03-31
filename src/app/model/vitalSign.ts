import {Patient} from "./patient";

export interface VitalSign {
  id: number;
  date: string;
  temperature: string;
  pulse: string;
  respiratoryRate: string;
  patient: Patient;
}
