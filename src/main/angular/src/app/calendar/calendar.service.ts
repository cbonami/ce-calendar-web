import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {Observable} from "rxjs";

//const CHAT_URL = "ws://localhost:8080/websocket";
const CHAT_URL = "ws://echo.websocket.org/";

export class Message {

  constructor(
    public author: string,
    public message: string
  ) {
  }

}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() {
  }

  private calendarWebSocket: WebSocketSubject<Message> = webSocket<Message>(CHAT_URL);

  calendar$(): Observable<Message> {
    return this.calendarWebSocket.asObservable();
  }

  send(message: Message) {
    this.calendarWebSocket.next(message);
  }

}
