import {Component, OnInit} from '@angular/core';
import {CalendarService, Message} from "../calendar.service";
import {Subscribable} from "../../util/subscribable";
import {WebSocketService} from "../../util/web-socket.service";

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent extends Subscribable implements OnInit {

  calendars: Message[] = [];

  constructor(
    private calendarService: CalendarService,
    private webSocketService: WebSocketService
  ) {
    super();

    webSocketService.messageStream()
      .subscribe(
        response => {
          // @ts-ignore
          const msg: Message = response;
          console.log('Message: ' + JSON.stringify(msg))
          this.calendars.push(msg);
        },
        error => console.log('Error: ' + error),
        () => console.log('Complete')
      );

    calendarService.calendar$()
      .subscribe(
        msg => {
          console.log(`Message: ${JSON.stringify(msg)}`)
          this.calendars.push(msg);
        },
        error => console.log('Error: ' + error),
        () => console.log('Complete')
      )
  }

  ngOnInit(): void {
  }

  sendMessage() {
    this.webSocketService.send(new Message(
      'me2',
      'test2'
    ));
    this.calendarService.send(new Message(
      'me',
      'test'
    ));
  }

}
