import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input()
  delay = 5000;

  public text: string;
  public type = 'success';

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      this.text = alert.text;
      this.type = alert.type
    })
  }

}
