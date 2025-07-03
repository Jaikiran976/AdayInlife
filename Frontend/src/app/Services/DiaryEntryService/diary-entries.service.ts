import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NewEntry } from '../../Models/newEntry.module';
import { Observable } from 'rxjs';
import { UpdateEntryModel } from '../../Models/updateentry.module';

@Injectable({
  providedIn: 'root'
})
export class DiaryEntriesService {

  baseapiurl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  //add a new entry
  addNewEntry(entry: NewEntry): Observable<NewEntry> {
    return this.http.post<NewEntry>(
      `${this.baseapiurl}/api/DiaryEntries/AddEntry`,
      entry
    );
  }

  //call api to get all entries
  getAllEntries(token: string): Observable<UpdateEntryModel[]> {
    return this.http.get<UpdateEntryModel[]>(`${this.baseapiurl}/api/DiaryEntries/GetAllEntries?token=${token}`);
  }

  deleteEntry(id: any): Observable<string>{
    return this.http.delete<string>(`${this.baseapiurl}/api/DiaryEntries/DeleteEntry?id=${id}`)
  }
}
