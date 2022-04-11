import {Observable} from 'rxjs';
import {AutoCompleteItemViewModelDto} from './auto-complete-item-view-model.dto';
import {ResultPage} from './result-page';

export type ComboBoxSearchFn = (query: string) => Observable<ResultPage<AutoCompleteItemViewModelDto>>;
