import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {FormControlContainerChildAlreadyAddedError} from '../errors/form-control-container-child-already-added.error';
import {FormControlContainerChildNotAddedYetError} from '../errors/form-control-container-child-not-added-yet.error';
import {IFormControl, IFormControlContainer, IFormControlContainerChildren, IFormControlParent} from './api';
import {flatten} from './array';
import {IsEnabledFeature} from './features/is-enabled.feature';
import {FormControlParentGuard} from './form-control-parent-guard';
import {allAreTrue, atLeastOneIsTrue, combineLatestIncludingEmpty, negate} from './observables';
import {FormControlContainerProperty, IFormControlContainerPropertyChildren} from './properties/form-control-container-property';
import {FormControlProperty} from './properties/form-control-property';
import {ChildValidationError} from './validation-errors';

declare type ChildFormControl<TParentValue> = IFormControl<TParentValue[keyof TParentValue]>;

export class Form<TValue = any> implements IFormControlContainer<TValue> {
  private static getChildNames<TValue>(controls: IFormControlContainerChildren<TValue>): (keyof TValue)[] {
    const result: (keyof TValue)[] = Object.keys(controls).map((key) => key as keyof TValue);
    return result;
  }

  private static getChildren<TValue>(
    controls: IFormControlContainerChildren<TValue>
  ): IFormControl<TValue[keyof TValue]>[] {
    const result: IFormControl<TValue[keyof TValue]>[] = Form.getChildNames<TValue>(controls)
      .map((key) => controls[key])
      .filter((child): child is IFormControl<TValue[keyof TValue]> => child !== undefined);
    return result;
  }

  private static createFormControlContainerPropertyChildren<TValue>(
    children: IFormControlContainerChildren<TValue>
  ): IFormControlContainerPropertyChildren<TValue> {
    const result: IFormControlContainerPropertyChildren<TValue> = <IFormControlContainerPropertyChildren<TValue>>{};

    Form.getChildNames<TValue>(children).forEach((name) => {
      result[name] = children[name]?.value;
    });

    return result;
  }

  public readonly value: FormControlContainerProperty<TValue>;
  public readonly parent: FormControlProperty<IFormControlParent | null>;

  private readonly _children: FormControlProperty<IFormControlContainerChildren<TValue>>;
  private readonly _controls: Observable<IFormControl<TValue[keyof TValue]>[]>;

  private readonly _isEnabledFeature: IsEnabledFeature;

  public readonly isEnabled: Observable<boolean>;
  public readonly isDisabled: Observable<boolean>;

  public readonly isUntouched: Observable<boolean>;
  public readonly wasTouched: Observable<boolean>;

  public readonly isPristine: Observable<boolean>;
  public readonly isDirty: Observable<boolean>;

  public readonly isValidating: Observable<boolean>;
  public readonly validationErrors: Observable<ChildValidationError[]>;
  public readonly isValid: Observable<boolean>;
  public readonly isInvalid: Observable<boolean>;

  private readonly _parentGuard: FormControlParentGuard<TValue>;

  constructor() {
    this._children = new FormControlProperty<IFormControlContainerChildren<TValue>>({});
    this.value = new FormControlContainerProperty(
      this._children.pipe(map(Form.createFormControlContainerPropertyChildren))
    );
    this.parent = new FormControlProperty<IFormControlParent | null>(null);
    this._parentGuard = new FormControlParentGuard<TValue>(this, this.parent);
    this._controls = this._children.pipe(map(Form.getChildren), shareReplay(1));

    this._isEnabledFeature = new IsEnabledFeature(this.parent);
    this.isEnabled = this._isEnabledFeature.isEnabled;
    this.isDisabled = this._isEnabledFeature.isDisabled;

    this.isValidating = this._combineChildren((child) => child.isValidating).pipe(atLeastOneIsTrue());
    this.isUntouched = this._combineChildren((child) => child.isUntouched).pipe(allAreTrue());
    this.wasTouched = this.isUntouched.pipe(negate());
    this.isPristine = this._combineChildren((child) => child.isPristine).pipe(allAreTrue());
    this.isDirty = this.isPristine.pipe(negate());

    this.validationErrors = this._children.pipe(
      switchMap((children) =>
        combineLatestIncludingEmpty(
          Form.getChildNames<TValue>(children).map((name) =>
            (children[name] as ChildFormControl<TValue>).validationErrors.pipe(
              map(ChildValidationError.forPath(name.toString()))
            )
          )
        )
      ),
      map(flatten)
    );
    this.isValid = this.validationErrors.pipe(
      map((validationErrors) => validationErrors.length === 0),
      distinctUntilChanged()
    );
    this.isInvalid = this.isValid.pipe(negate());
  }

  public add<
    TKey extends keyof TValue = keyof TValue,
    TFormControl extends IFormControl = IFormControl,
  >(name: TKey, control: TFormControl): TFormControl {
    const controls: IFormControlContainerChildren<TValue> = this._children.get();
    if (controls[name] || control.parent.get()) {
      throw new FormControlContainerChildAlreadyAddedError(name.toString());
    }

    this._children.set({
      ...controls,
      [name]: control,
    });

    control.parent.set(this);

    return control;
  }

  public contains(control: IFormControl<TValue[keyof TValue]>): boolean {
    return Form.getChildren(this._children.get()).indexOf(control) > -1;
  }

  public remove(name: keyof TValue): void {
    const controls: IFormControlContainerChildren<TValue> = this._children.get();
    const child: ChildFormControl<TValue> | undefined = controls[name];
    if (!child) {
      throw new FormControlContainerChildNotAddedYetError(name.toString());
    }

    const newControls: IFormControlContainerChildren<TValue> = {...controls};
    delete newControls[name];
    this._children.set(newControls);

    child.parent.set(null);
  }

  public readonly enable = (): void => {
    this._isEnabledFeature.enable();
  };
  public readonly disable = (): void => {
    this._isEnabledFeature.disable();
  };

  public readonly markAsDirty = (): void => {
    this._forEachChild((child) => child.markAsDirty());
  };
  public readonly markAsPristine = (): void => {
    this._forEachChild((child) => child.markAsPristine());
  };

  public readonly markAsTouched = (): void => {
    this._forEachChild((child) => child.markAsTouched());
  };
  public readonly markAsUntouched = (): void => {
    this._forEachChild((child) => child.markAsUntouched());
  };

  public destroy(): void {
    this._forEachChild((child) => child.destroy());
    this.value.destroy();
    this._parentGuard.destroy();
    this.parent.destroy();
    this._isEnabledFeature.destroy();
  }

  private _forEachChild(callback: (child: ChildFormControl<TValue>) => void): void {
    Form.getChildren(this._children.get()).forEach(callback);
  }

  private _combineChildren<TResult>(
    project: (child: ChildFormControl<TValue>) => Observable<TResult>
  ): Observable<TResult[]> {
    return this._controls.pipe(switchMap((children) => combineLatestIncludingEmpty(children.map(project))));
  }
}
