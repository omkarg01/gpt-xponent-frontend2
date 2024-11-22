import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { MY_APPLICATIONS } from './utils/constants';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  breadcrumbSubject = new BehaviorSubject<MenuItem[]>(MY_APPLICATIONS)
  configSubject = new BehaviorSubject<any>([])

  constructor(
    private readonly http: HttpClient
  ) { }

  setBreadcrumbSubject = (value: MenuItem[]) => {
    this.breadcrumbSubject.next(value)
  }

  setConfigSubject = (value: any) => {
    this.configSubject.next(value)
  }

  getConfiguration = (): Observable<any> => {
    return this.http.get(`${environment.apiendpoint}configuartion`, { responseType: 'json' });
  }

  getOutputSchema = (appId: string): Observable<any> => {
    return this.http.get(
      `${environment.apiendpoint}applications/${appId}/output-schema`,
      { responseType: 'json' }
    );
  }

  createApplication = (reqBody: any): Observable<any> => {
    return this.http.post(`${environment.apiendpoint}applications`, reqBody);
  }
  
  readApplication = (appId: string): Observable<any> => {
    return this.http.get(`${environment.apiendpoint}applications/${appId}`);
  }

  readApplications = (): Observable<any> => {
    return this.http.get(`${environment.apiendpoint}applications`);
  }

  updateApplication = (appId: string, reqBody: any): Observable<any> => {
    return this.http.put(`${environment.apiendpoint}applications/${appId}`, reqBody)
  }

  deleteApplication = (applicationId: any): Observable<any> => {
    const appId = applicationId.$oid ?? '';

    return this.http.delete(`${environment.apiendpoint}applications/${appId}`);
  }

  testInstructions = (reqBody: FormData): Observable<any> => {
    return this.http.post(`${environment.apiendpoint}applications/test`, reqBody);
  }
}
