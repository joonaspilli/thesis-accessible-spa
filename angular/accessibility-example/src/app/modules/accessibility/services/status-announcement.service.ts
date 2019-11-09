import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StatusMessage } from '../datatypes/status-announcement.datatypes';

@Injectable({
  providedIn: 'root'
})
export class StatusAnnouncementService {

  public get statusAnnouncements(): Observable<StatusMessage> {
    return this.statusAnnouncements$.asObservable();
  }

  private readonly statusAnnouncements$: Subject<StatusMessage> = new Subject();

  constructor() { }

  public announce(message: StatusMessage): void {
    this.statusAnnouncements$.next(message);
  }

}
