import {Directive, Injectable, Input, OnDestroy} from '@angular/core';
import {AutoCompleteItemViewModelDto} from '../model/auto-complete-item-view-model.dto';
import {ComboBoxComponent} from '../components/combo-box/combo-box.component';
import {ResultPage} from '../model/result-page';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

type SearchFn = (query: string) => Observable<ResultPage<AutoCompleteItemViewModelDto>>;

@Directive({
  selector: 'app-combo-box[search],app-combo-box[[search]]',
})
export class ComboBoxSearchDirective implements OnDestroy {
  private readonly _search: BehaviorSubject<SearchFn | null> = new BehaviorSubject<SearchFn | null>(null);
  @Input()
  public set search(value: SearchFn | '' | null) {
    this._search.next(typeof value !== 'string' ? value : null);
  }

  private readonly _subscriptions: Subscription[];

  public constructor(private readonly _comboBox: ComboBoxComponent<AutoCompleteItemViewModelDto>) {
    this._comboBox.displayWith = (option) => option.value ?? '';

    this._subscriptions = [
      combineLatest([
        this._search.pipe(tap(this._startLoading)),
        this._comboBox.query.pipe(distinctUntilChanged(), tap(this._startLoading), debounceTime(500)),
      ])
        .pipe(
          switchMap(([search, query]) =>
            search
              ? search(query).pipe(catchError(() => of(<ResultPage<AutoCompleteItemViewModelDto>>{})))
              : of(<ResultPage<AutoCompleteItemViewModelDto>>{})
          ),
          tap(this._finishLoading)
        )
        .subscribe((response) => {
          this._comboBox.options = response.items ?? [];
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
