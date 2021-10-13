import {FormControlContainerIsNotAParentError} from '../errors/form-control-container-is-not-a-parent.error';
import {ParentStillContainsControlError} from '../errors/parent-still-contains-control.error';
import {FormPropertyChangedEvent} from '../events/form-property-changed.event';
import {IFormControl, IFormControlContainer, IFormControlProperty} from './api';
import {createCallbackSpy} from './callback.spec';
import {Form} from './form';
import Spy = jasmine.Spy;
import {FormControl} from './form-control';
import {read} from './observables';
import {ValidationError} from './validation-errors';

export class MockError extends ValidationError {
  constructor(public readonly label: string) {
    super();
  }
}

export function qualityCheckFormControlProperty<TValue>(
  createSut: (initialValue: TValue) => IFormControlProperty<TValue>,
  initialValue: TValue,
  first: TValue,
  second: TValue
): void {
  describe('get()', () => {
    it('returns initial value when set() was never executed.', () => {
      expect(createSut(initialValue).get()).toEqual(initialValue);
      expect(createSut(first).get()).toEqual(first);
      expect(createSut(second).get()).toEqual(second);
    });
  });

  describe('set(value)', () => {
    let sut: IFormControlProperty<TValue>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('changes value returned by get() to one passed in parameter.', () => {
      sut.set(first);
      expect(sut.get()).toEqual(first);
    });
  });

  describe('changed', () => {
    let sut: IFormControlProperty<TValue>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('dispatches synchronously when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.changed.subscribe(callback);
      sut.set(first);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent(initialValue, first));
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent(first, second));
    });

    it("doesn't dispatch when set() was executed with current value", () => {
      const callback: Spy = createCallbackSpy();

      sut.changed.subscribe(callback);
      sut.set(first);
      sut.set(first);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent(initialValue, first));
    });
  });

  describe('subscribe', () => {
    let sut: IFormControlProperty<TValue>;
    beforeEach(() => {
      sut = createSut(initialValue);
    });

    it('dispatches synchronously with initial value when set() was not executed.', () => {
      const callback: Spy = createCallbackSpy();
      const currentValue: TValue = sut.get();

      sut.subscribe(callback);

      expect(callback).toHaveBeenCalledOnceWith(currentValue);
    });

    it('dispatches synchronously when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.subscribe(callback);
      sut.set(first);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(initialValue);
      expect(callback).toHaveBeenCalledWith(first);
      expect(callback).toHaveBeenCalledWith(second);
    });

    it("doesn't dispatch synchronously when set() was executed with the same value.", () => {
      const callback: Spy = createCallbackSpy();

      sut.subscribe(callback);
      sut.set(first);
      sut.set(first);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(initialValue);
      expect(callback).toHaveBeenCalledWith(first);
    });

    it('dispatches synchronously with latest version when set() was executed.', () => {
      const callback: Spy = createCallbackSpy();

      sut.set(first);
      sut.subscribe(callback);
      sut.set(second);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(first);
      expect(callback).toHaveBeenCalledWith(second);
    });
  });
}

export function qualityCheckFormControl<TValue>(createSut: () => IFormControl<TValue>): void {
  describe('isEnabled', () => {
    it('is initially set to true', async () => {
      expect(await read(createSut().isEnabled)).toBeTrue();
    });
  });

  describe('isDisabled', () => {
    it('is initially set to false', async () => {
      expect(await read(createSut().isDisabled)).toBeFalse();
    });
  });

  describe('isUntouched', () => {
    it('is initially set to true', async () => {
      expect(await read(createSut().isUntouched)).toBeTrue();
    });
  });

  describe('wasTouched', () => {
    it('is initially set to false', async () => {
      expect(await read(createSut().wasTouched)).toBeFalse();
    });
  });

  describe('isPristine', () => {
    it('is initially set to true', async () => {
      expect(await read(createSut().isPristine)).toBeTrue();
    });
  });

  describe('isDirty', () => {
    it('is initially set to false', async () => {
      expect(await read(createSut().isDirty)).toBeFalse();
    });
  });

  describe('validationErrors', () => {
    it('is initially set to empty array', async () => {
      expect(await read(createSut().validationErrors)).toEqual([]);
    });
  });

  describe('isValid', () => {
    let sut: IFormControl<TValue>;

    beforeEach(() => {
      sut = createSut();
    });

    it('returns true when there is no validation errors', async () => {
      expect(await read(sut.isValid)).toBeTrue();
    });
  });

  describe('isInvalid', () => {
    const error: ValidationError = new MockError('Fura');
    let sut: IFormControl<TValue>;

    beforeEach(() => {
      sut = createSut();
    });

    it('returns true when there is no validation errors', async () => {
      expect(await read(sut.isInvalid)).toBeFalse();
    });
  });

  describe('isValidating', () => {
    it('is initially set to false', async () => {
      expect(await read(createSut().isValidating)).toBeFalse();
    });
  });

  describe('parent', () => {
    it("throws error when trying to set parent that doesn't contain control", () => {
      const parent: Form = new Form();
      const sut: IFormControl = createSut();
      expect(() => sut.parent.set(parent)).toThrowMatching(FormControlContainerIsNotAParentError.match);
    });

    it('throws error when trying to set null as parent and parent still contains this control', () => {
      const parent: Form = new Form();
      const sut: IFormControl = createSut();
      parent.add('test', sut);
      expect(() => sut.parent.set(null)).toThrowMatching(ParentStillContainsControlError.match);
    });
  });

  describe('enable()/disable()', () => {
    let sut: IFormControl<TValue>;
    let callback: Spy;

    beforeEach(() => {
      sut = createSut();
      callback = createCallbackSpy();
    });

    it('dispatches synchronously isEnabled with proper value', () => {
      sut.isEnabled.subscribe(callback);
      sut.disable();
      sut.enable();
      sut.disable();
      sut.enable();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });
    it('dispatches synchronously isDisabled with proper value', () => {
      sut.isDisabled.subscribe(callback);
      sut.disable();
      sut.enable();
      sut.disable();
      sut.enable();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('dispatches synchronously isEnabled only once when state was not changed', () => {
      sut.isEnabled.subscribe(callback);
      sut.disable();
      sut.disable();
      sut.disable();
      sut.enable();
      sut.enable();
      sut.enable();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('dispatches synchronously isDisabled only once when state was not changed', () => {
      sut.isDisabled.subscribe(callback);
      sut.disable();
      sut.disable();
      sut.disable();
      sut.enable();
      sut.enable();
      sut.enable();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('markAsTouched()/markAsUntouched()', () => {
    let sut: IFormControl<TValue>;
    let callback: Spy;

    beforeEach(() => {
      sut = createSut();
      callback = createCallbackSpy();
    });

    it('dispatches synchronously isUntouched with proper value', () => {
      sut.isUntouched.subscribe(callback);
      sut.markAsTouched();
      sut.markAsUntouched();
      sut.markAsTouched();
      sut.markAsUntouched();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('dispatches synchronously wasTouched with proper value', () => {
      sut.wasTouched.subscribe(callback);
      sut.markAsTouched();
      sut.markAsUntouched();
      sut.markAsTouched();
      sut.markAsUntouched();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('dispatches synchronously isTouched only once when state was not changed', () => {
      sut.isUntouched.subscribe(callback);
      sut.markAsTouched();
      sut.markAsTouched();
      sut.markAsTouched();
      sut.markAsUntouched();
      sut.markAsUntouched();
      sut.markAsUntouched();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('dispatches synchronously wasTouched only once when state was not changed', () => {
      sut.wasTouched.subscribe(callback);
      sut.markAsTouched();
      sut.markAsTouched();
      sut.markAsTouched();
      sut.markAsUntouched();
      sut.markAsUntouched();
      sut.markAsUntouched();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('markAsDirty()/markAsPristine()', () => {
    let sut: IFormControl<TValue>;
    let callback: Spy;

    beforeEach(() => {
      sut = createSut();
      callback = createCallbackSpy();
    });

    it('dispatches synchronously isPristine with proper value', () => {
      sut.isPristine.subscribe(callback);
      sut.markAsDirty();
      sut.markAsPristine();
      sut.markAsDirty();
      sut.markAsPristine();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('dispatches synchronously isDirty with proper value', () => {
      sut.isDirty.subscribe(callback);
      sut.markAsDirty();
      sut.markAsPristine();
      sut.markAsDirty();
      sut.markAsPristine();
      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('dispatches synchronously isPristine only once when state was not changed', () => {
      sut.isPristine.subscribe(callback);
      sut.markAsDirty();
      sut.markAsDirty();
      sut.markAsDirty();
      sut.markAsPristine();
      sut.markAsPristine();
      sut.markAsPristine();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('dispatches synchronously isDirty only once when state was not changed', () => {
      sut.isDirty.subscribe(callback);
      sut.markAsDirty();
      sut.markAsDirty();
      sut.markAsDirty();
      sut.markAsPristine();
      sut.markAsPristine();
      sut.markAsPristine();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(false);
      expect(callback).toHaveBeenCalledWith(true);
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('destroy', () => {
    let sut: IFormControl<TValue>;
    let callback: Spy;

    beforeEach(() => {
      sut = createSut();
      callback = createCallbackSpy();
    });

    it('stops executing callbacks for wasTouched/isUntouched', () => {
      sut.markAsUntouched();
      sut.wasTouched.subscribe(callback);
      sut.isUntouched.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      sut.destroy();
      sut.markAsTouched();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('stops executing callbacks for isDirty/isPristne', () => {
      sut.markAsPristine();
      sut.isPristine.subscribe(callback);
      sut.isDirty.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      sut.destroy();
      sut.markAsDirty();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('stops executing callbacks for isEnabled/isDisabled', () => {
      sut.enable();
      sut.isEnabled.subscribe(callback);
      sut.isDisabled.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      sut.destroy();
      sut.disable();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('stops executing callbacks for parent', () => {
      const parent: Form = new Form();
      parent.add('test', sut);
      sut.parent.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      sut.destroy();
      parent.remove('test');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
}

describe('IFormControl', () => {
  describe('setEnabled', () => {
    let formControl: FormControl<string>;
    let sut: (isEnabled: boolean) => void;

    beforeEach(() => {
      formControl = new FormControl<string>('Fura');
      sut = IFormControl.setEnabled(formControl);
    });

    it('returns function that enables passed formControl when true is passed as parameter', async () => {
      formControl.disable();
      sut(true);
      expect(await read(formControl.isEnabled)).toBeTrue();
    });

    it('returns function that enables passed formControl when true is passed as parameter', async () => {
      formControl.enable();
      sut(false);
      expect(await read(formControl.isEnabled)).toBeFalse();
    });
  });

  describe('setDisabled', () => {
    let formControl: FormControl<string>;
    let sut: (isDisabled: boolean) => void;

    beforeEach(() => {
      formControl = new FormControl<string>('Fura');
      sut = IFormControl.setDisabled(formControl);
    });

    it('returns function that disables passed formControl when true is passed as parameter', async () => {
      formControl.enable();
      sut(true);
      expect(await read(formControl.isDisabled)).toBeTrue();
    });

    it('returns function that disables passed formControl when true is passed as parameter', async () => {
      formControl.disable();
      sut(false);
      expect(await read(formControl.isDisabled)).toBeFalse();
    });
  });
});

describe('IFormControlComponent', () => {
  describe('setChild', () => {
    let parent: Form;
    let child: FormControl<string>;
    let sut: (isChild: boolean) => void;

    beforeEach(() => {
      parent = new Form();
      child = new FormControl('Fura');

      sut = IFormControlContainer.setChild(parent, 'test', child);
    });

    it('returns function that adds child to parent form when true is passed', async () => {
      expect(child.parent.get()).toBeNull();
      sut(true);
      expect(child.parent.get()).toBe(parent);
    });

    it('returns function that removes child from parent form when false is passed', async () => {
      parent.add('test', child);
      sut(false);
      expect(child.parent.get()).toBeNull();
    });
  });
});
