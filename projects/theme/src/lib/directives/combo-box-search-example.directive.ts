import {Directive, Input} from '@angular/core';
import {AutoCompleteItemViewModelDto} from '../model/auto-complete-item-view-model.dto';
import {mock} from '../model/mock';
import {ComboBoxSearchDirective} from './combo-box-search.directive';
import {ComboBoxComponent} from '../components/combo-box/combo-box.component';
import {ResultPage} from '../model/result-page';
import {Observable} from 'rxjs';

@Directive({
  selector: 'app-combo-box[search][example]',
})
export class ComboBoxSearchExampleDirective {
  @Input()
  public resultsCount: number = 10;

  @Input()
  public set noResultsMessage(value: string) {
    this._comboBox.noResultsMessage = value;
  }

  public constructor(
    private readonly _comboBox: ComboBoxComponent<AutoCompleteItemViewModelDto>,
    private readonly _searchDirective: ComboBoxSearchDirective
  ) {
    this._searchDirective.search = this._search;
    this._comboBox.noResultsMessage = 'noItemsFound';
  }

  private readonly _search = (query: string): Observable<ResultPage<AutoCompleteItemViewModelDto>> => {
    return mock({
      items: [
        {id: 'sss', value: 'aaa'},
        {id: 'sss', value: 'aaa'},
        {id: 'sss', value: 'aaa'},
      ],
    });
  };
}
