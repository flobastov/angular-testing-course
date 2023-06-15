import {fakeAsync, flush, flushMicrotasks, tick} from "@angular/core/testing";
import {of} from "rxjs";
import {delay} from "rxjs/operators";

describe("Async Testing Examples", () => {
  it('Asynchronous testing example with Jasmine done())', (done: DoneFn) => {
    let result = false;

    setTimeout(() => {
      result = true;
      expect(result).toBeTruthy();
      done();
    }, 1000)
  });

  it('Asynchronous testing example with setTimeout()', fakeAsync(() => {
    let result = false;
    setTimeout(() => result = true, 1000);
    flush(); // OR tick(1000);
    expect(result).toBeTruthy();
  }));

  it('Asynchronous testing example with Promise', fakeAsync(() => {
    let result = false;
    Promise.resolve()
      .then(() => Promise.resolve())
      .then(() => Promise.resolve())
      .then(() => result = true);

    flushMicrotasks();
    expect(result).toBeTruthy();
  }));

  it('Asynchronous testing example with setTimeout() + Promise', fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    flushMicrotasks();
    tick(1000);
    expect(counter).toBe(11);
  }));

  it('Asynchronous testing example with Observables', fakeAsync(() => {
    let result = false;
    of(true).pipe(delay(1000)).subscribe(() => result = true);
    tick(1000);
    expect(result).toBeTruthy();
  }));
});
