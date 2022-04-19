import {Directive, Input, OnDestroy} from '@angular/core';
import {ComboBoxComponent} from '../components/combo-box/combo-box.component';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

type SearchFn<TOption> = <TOption>(query: string) => Observable<TOption[]>;

@Directive({
  selector: 'app-combo-box[search],app-combo-box[[search]]',
})
export class ComboBoxSearchDirective<TOption> implements OnDestroy {
  private readonly _returnEmptyResult: SearchFn<TOption> = () => of([]);

  private readonly _search: BehaviorSubject<SearchFn<TOption>> = new BehaviorSubject<SearchFn<TOption>>(
    this._returnEmptyResult
  );
  @Input()
  public set search(value: SearchFn<TOption> | '' | null) {
    if (typeof value === 'string') {
      this._search.next(this._returnEmptyResult);
    } else {
      this._search.next(value ?? this._returnEmptyResult);
    }
  }

  private readonly _subscriptions: Subscription[];

  public constructor(private readonly _comboBox: ComboBoxComponent<TOption>) {
    this._subscriptions = [
      combineLatest([this._search, this._comboBox.query.pipe(distinctUntilChanged())])
        .pipe(
          tap(this._startLoading),
          debounceTime(500),
          switchMap(([search, query]): Observable<TOption[]> => search(query)),
          tap(this._finishLoading)
        )
        .subscribe((response) => {
          this._comboBox.options = response ?? [];
        }),
    ];
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  private readonly _startLoading = (): void => {
    this._comboBox.isLoading = true;
  };

  private readonly _finishLoading = (): void => {
    this._comboBox.isLoading = false;
  };
}
