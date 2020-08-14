import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type AlertType = 'success' | 'warning' | 'danger'

export interface Alert {
  type: AlertType
  text: string
}

@Injectable()
export class AlertService {
  public alert$: Subject<Alert> = new Subject<Alert>();

  success(text: string) {
    this.alert$.next({
      type: 'success',
      text
    })
  }

  danger(text: string) {
    this.alert$.next({
      type: 'danger',
      text
    })
  }

  warning(text: string) {
    this.alert$.next({
      type: 'warning',
      text
    })
  }
}
