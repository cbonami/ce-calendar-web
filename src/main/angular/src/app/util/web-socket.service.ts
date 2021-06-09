import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as atmosphere from 'atmosphere.js';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private request!: Atmosphere.Request;
  private subSocket!: Atmosphere.Request;
  private dataStream: Subject<Atmosphere.Response> = new Subject<Atmosphere.Response>();
  private dataStream$ = this.dataStream.asObservable();
  private open = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.request = <Atmosphere.Request>{
      url: 'ws://localhost:8080/websocket',
      contentType: 'application/json',
      trackMessageLength: true,
      shared: false,

      transport: 'websocket', // polling, long-polling, streaming, jsonp, sse and websocket
      fallbackTransport: 'long-polling',

      logLevel: 'debug',
      reconnectInterval: 5000,
      maxReconnectOnClose: 25,

      onError: (response: Atmosphere.Response) => {
        console.log(`Atmosphere received error: ${JSON.stringify(response)}`);
        // this.dataStream.error(response); // niet doen, verwijderd subscribers?
      },

      onClose: (response: Atmosphere.Response) => {
        console.log(`Atmosphere received close ${JSON.stringify(response)}`)
      },

      onOpen: (response: Atmosphere.Response) => {
        console.log(`Atmosphere connected using ${JSON.stringify(response.transport)}`)
      },

      onMessage: (response: Atmosphere.Response) => {
        this.dataStream.next(response);
      },

      onReconnect: (request, response) => {
        console.log('Atmosphere is reconnecting: ');
        console.log(`  Request: ${JSON.stringify(request)}`);
        console.log(`  Response: ${JSON.stringify(response)}`);
      },

      onClientTimeout: request => {
        console.log(`Atmosphere timed out: ${JSON.stringify(request)}`);
      }

    };

    if (atmosphere.subscribe) {
      this.subSocket = atmosphere.subscribe(this.request);
      this.open = true;
    }
  }

  public messageStream<T>(): Observable<T> {
    return this.dataStream$.pipe(
      map(response => JSON.parse(<string>response.responseBody))
    );
  }

  public send(t: any) {
    if (this.subSocket.push) {
      this.subSocket.push(JSON.stringify(t));
    }
  }

  ngOnDestroy(): void {
    console.log('Disconnecting Atmosphere...')
    this.close();
  }

  private close() {
    if (this.open) {
      this.open = false;
      this.subSocket.close;
    }
  }

}
