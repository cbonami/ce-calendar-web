import {OnDestroy} from '@angular/core';
import {SubSink} from "subsink";

export abstract class Subscribable implements OnDestroy {

  protected subs = new SubSink();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
