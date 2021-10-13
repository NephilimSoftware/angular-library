import {Subscription} from 'rxjs';
import {FormControlContainerIsNotAParentError} from '../errors/form-control-container-is-not-a-parent.error';
import {ParentStillContainsControlError} from '../errors/parent-still-contains-control.error';
import {FormPropertyChangingEvent} from '../events/form-property-changing.event';
import {IFormControl, IFormControlParent} from './api';
import {FormControlProperty} from './properties/form-control-property';

export class FormControlParentGuard<TValue> {
  private readonly _parentChangingSubscription: Subscription;

  constructor(
    private readonly _formControl: IFormControl<TValue>,
    private readonly _parent: FormControlProperty<IFormControlParent | null> ) {
    this._parentChangingSubscription = _parent.changing.subscribe(this._onParentChanging);
  }

  public destroy(): void {
    this._parentChangingSubscription.unsubscribe();
  }

  private readonly _onParentChanging = (
    event: FormPropertyChangingEvent<IFormControlParent | null>
  ): void => {
    if (event.previousValue !== null && event.previousValue.contains(<any>this._formControl)) {
      event.cancelAndThrow(new ParentStillContainsControlError());
    }
    if (event.currentValue !== null && event.currentValue?.contains(<any>this._formControl) === false) {
      event.cancelAndThrow(new FormControlContainerIsNotAParentError());
    }
  };
}
