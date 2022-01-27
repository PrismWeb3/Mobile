export class Subject<T> {
  private _observables: Observable<T>[] = [];

  public subscribe(p_callback: (p_value: T) => void): () => void {
    const observable = new Observable<T>();
    this._observables.push(observable);
    observable.subscribe(p_callback);

    return () => {
      // unsubscribe
      const index = this._observables.indexOf(observable);

      if (index !== -1) {
        this._observables.splice(index, 1);
      }
    };
  }

  public next(value: T) {
    for (const observable of this._observables) {
      observable.execute(value);
    }
  }
}

export class Observable<T> {
  private _callback: (p_value: T) => void = () => {};

  constructor() {}

  public subscribe(p_callback: (p_value: T) => void) {
    this._callback = p_callback;
  }

  public execute(value: T) {
    this._callback(value);
  }
}
