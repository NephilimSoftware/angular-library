import {FormControlArrayItemAlreadyAddedError} from '../errors/form-control-array-item-already-added.error';
import {FormControlArrayItemNotAddedYetError} from '../errors/form-control-array-item-not-added-yet.error';
import {OutOfRangeError} from '../errors/out-of-range.error';
import {FormControlArrayItemAddedEvent} from '../events/form-control-array-item-added.event';
import {FormControlArrayItemRemovedEvent} from '../events/form-control-array-item-removed.event';
import {FormPropertyChangedEvent} from '../events/form-property-changed.event';
import {IFormControl} from './api';
import {qualityCheckFormControl, MockError} from './api.spec';
import {createCallbackSpy, wrapCallbackWithSpy} from './callback.spec';
import {FormArray} from './form-array';
import {FormControl} from './form-control';
import {read} from './observables';
import {ChildValidationError, ValidationError} from './validation-errors';

describe('FormArray', () => {
  let sut: FormArray<string>;
  let createItem: (v: string) => IFormControl<string>;
  let first: FormControl<string>;
  let second: FormControl<string>;
  let third: FormControl<string>;

  beforeEach(() => {
    createItem = wrapCallbackWithSpy((v) => new FormControl(v));
    sut = new FormArray<string>([], createItem);
    first = new FormControl('Fura');
    second = new FormControl('Janusz');
    third = new FormControl('Gawendi');
  });

  qualityCheckFormControl<string[]>(() => new FormArray<string>([], createItem));

  describe('value', () => {
    it("calls createItem only for values that don't have controls", () => {
      sut.value.set(['Fura', 'Janusz']);
      sut.value.set(['Fura', 'Janusz', 'Gawendi']);
      expect(createItem).toHaveBeenCalledTimes(3);
      expect(createItem).toHaveBeenCalledWith('Fura');
      expect(createItem).toHaveBeenCalledWith('Janusz');
      expect(createItem).toHaveBeenCalledWith('Gawendi');
    });
  });

  describe('items', () => {
    describe('set', () => {
      it('sets all passed control parents to itself', () => {
        sut.items.set([first, second, third]);
        expect(first.parent.get()).toBe(<any>sut);
        expect(second.parent.get()).toBe(<any>sut);
        expect(third.parent.get()).toBe(<any>sut);
      });

      it('sets removed controls parent to null ', () => {
        sut.items.set([first, second, third]);
        sut.items.set([first, second]);
        expect(first.parent.get()).toBe(<any>sut);
        expect(second.parent.get()).toBe(<any>sut);
        expect(third.parent.get()).toBeNull();
      });

      it('dispatches added event with control that were added', () => {
        const callback: (event: FormControlArrayItemAddedEvent<string>) => void = createCallbackSpy();
        sut.itemAdded.subscribe(callback);
        sut.items.set([first]);
        sut.items.set([first, second]);
        sut.items.set([first, second, third]);
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledWith(new FormControlArrayItemAddedEvent(first));
        expect(callback).toHaveBeenCalledWith(new FormControlArrayItemAddedEvent(second));
        expect(callback).toHaveBeenCalledWith(new FormControlArrayItemAddedEvent(third));
      });

      it('dispatches removed event with control that were removed', () => {
        const callback: (event: FormControlArrayItemRemovedEvent<string>) => void = createCallbackSpy();
        sut.itemRemoved.subscribe(callback);
        sut.items.set([first, second, third]);
        sut.items.set([first, second]);
        sut.items.set([first]);
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith(new FormControlArrayItemRemovedEvent(second));
        expect(callback).toHaveBeenCalledWith(new FormControlArrayItemRemovedEvent(third));
      });
    });
  });

  describe('push', () => {
    it('adds control to the end of items', () => {
      sut.push(first);
      expect(sut.items.get()).toEqual([first]);
      sut.push(second);
      expect(sut.items.get()).toEqual([first, second]);
    });

    it('throws FormControlArrayItemAlreadyAddedError when passed control was already added to array', () => {
      sut.push(first);

      expect(() => sut.push(first)).toThrowMatching(FormControlArrayItemAlreadyAddedError.match);
    });

    it('dispatches added event with control that was added', () => {
      const callback: (event: FormControlArrayItemAddedEvent<string>) => void = createCallbackSpy();
      sut.itemAdded.subscribe(callback);
      sut.push(first);
      expect(callback).toHaveBeenCalledOnceWith(new FormControlArrayItemAddedEvent(first));
    });

    it('sets control parent to itself', () => {
      sut.push(first);
      expect(first.parent.get()).toBe(<any>sut);
    });
  });

  describe('insertAt', () => {
    it('adds control to the end of items', async () => {
      sut.items.set([first, second]);
      sut.insertAt(1, third);
      expect(sut.items.get()).toEqual([first, third, second]);
    });

    it('throws OutOfRangeError when negative index was passed', async () => {
      expect(() => sut.insertAt(-1, first)).toThrowMatching(OutOfRangeError.match);
    });

    it('adds item at the end when length of items is passed as index', async () => {
      sut.items.set([third, second]);
      sut.insertAt(sut.items.get().length, first);

      expect(sut.items.get()).toEqual([third, second, first]);
    });

    it('throws OutOfRangeError when index greater than items length was passed', async () => {
      expect(() => sut.insertAt(sut.items.get().length + 1, first)).toThrowMatching(OutOfRangeError.match);
    });

    it('dispatches added event with control that was added', () => {
      const callback: (event: FormControlArrayItemAddedEvent<string>) => void = createCallbackSpy();
      sut.itemAdded.subscribe(callback);
      sut.push(first);
      expect(callback).toHaveBeenCalledOnceWith(new FormControlArrayItemAddedEvent(first));
    });

    it('sets control parent to itself', () => {
      sut.insertAt(0, first);
      expect(first.parent.get()).toBe(<any>sut);
    });
  });

  describe('remove', () => {
    it('removes control', async () => {
      sut.items.set([first, second, third]);
      sut.remove(second);
      expect(sut.items.get()).toEqual([first, third]);
    });

    it('throws FormControlArrayItemNotAddedYetError when control that was not added yet', async () => {
      sut.items.set([first, second]);
      expect(() => sut.remove(third)).toThrowMatching(FormControlArrayItemNotAddedYetError.match);
    });

    it('sets control parent to null', () => {
      sut.items.set([first, second, third]);
      sut.remove(first);
      expect(first.parent.get()).toBeNull();
    });

    it('dispatches removed event with control that was added', () => {
      const callback: (event: FormControlArrayItemRemovedEvent<string>) => void = createCallbackSpy();
      sut.items.set([first, second, third]);
      sut.itemRemoved.subscribe(callback);
      sut.remove(first);
      expect(callback).toHaveBeenCalledOnceWith(new FormControlArrayItemRemovedEvent(first));
    });
  });

  describe('markAsUntouched', () => {
    it('marks all children as untouched', async () => {
      first.markAsTouched();
      second.markAsTouched();
      third.markAsTouched();
      sut.items.set([first, second, third]);
      sut.markAsUntouched();
      expect(await read(sut.isUntouched)).toBeTrue();
      expect(await read(first.isUntouched)).toBeTrue();
      expect(await read(second.isUntouched)).toBeTrue();
      expect(await read(third.isUntouched)).toBeTrue();
      expect(await read(sut.wasTouched)).toBeFalse();
      expect(await read(first.wasTouched)).toBeFalse();
      expect(await read(second.wasTouched)).toBeFalse();
      expect(await read(third.wasTouched)).toBeFalse();
    });
  });

  describe('markAsTouched', () => {
    it('marks all children as untouched', async () => {
      first.markAsUntouched();
      second.markAsUntouched();
      third.markAsUntouched();
      sut.items.set([first, second, third]);
      sut.markAsTouched();
      expect(await read(sut.isUntouched)).toBeFalse();
      expect(await read(first.isUntouched)).toBeFalse();
      expect(await read(second.isUntouched)).toBeFalse();
      expect(await read(third.isUntouched)).toBeFalse();
      expect(await read(sut.wasTouched)).toBeTrue();
      expect(await read(first.wasTouched)).toBeTrue();
      expect(await read(second.wasTouched)).toBeTrue();
      expect(await read(third.wasTouched)).toBeTrue();
    });
  });

  describe('wasTouched', () => {
    it('is set to true when at least on of items is marked as touched', async () => {
      sut.markAsUntouched();
      sut.items.set([first, second, third]);
      second.markAsTouched();
      expect(await read(sut.isUntouched)).toBeFalse();
      expect(await read(sut.wasTouched)).toBeTrue();
    });
  });

  describe('markAsPristine', () => {
    it('marks all children as pristine', async () => {
      first.markAsDirty();
      second.markAsDirty();
      third.markAsDirty();
      sut.items.set([first, second, third]);
      sut.markAsPristine();
      expect(await read(sut.isPristine)).toBeTrue();
      expect(await read(first.isPristine)).toBeTrue();
      expect(await read(second.isPristine)).toBeTrue();
      expect(await read(third.isPristine)).toBeTrue();
      expect(await read(sut.isDirty)).toBeFalse();
      expect(await read(first.isDirty)).toBeFalse();
      expect(await read(second.isDirty)).toBeFalse();
      expect(await read(third.isDirty)).toBeFalse();
    });
  });

  describe('markAsDirty', () => {
    it('marks all children as dirty', async () => {
      first.markAsPristine();
      second.markAsPristine();
      third.markAsPristine();
      sut.items.set([first, second, third]);
      sut.markAsDirty();
      expect(await read(sut.isPristine)).toBeFalse();
      expect(await read(first.isPristine)).toBeFalse();
      expect(await read(second.isPristine)).toBeFalse();
      expect(await read(third.isPristine)).toBeFalse();
      expect(await read(sut.isDirty)).toBeTrue();
      expect(await read(first.isDirty)).toBeTrue();
      expect(await read(second.isDirty)).toBeTrue();
      expect(await read(third.isDirty)).toBeTrue();
    });
  });

  describe('isDirty', () => {
    it('is set to true when at least on of items is marked as dirty', async () => {
      sut.markAsPristine();
      sut.items.set([first, second, third]);
      second.markAsDirty();
      expect(await read(sut.isPristine)).toBeFalse();
      expect(await read(sut.isDirty)).toBeTrue();
    });
  });

  describe('validationErrors', () => {
    const firstError: ValidationError = new MockError('Fura');
    const secondError: ValidationError = new MockError('Janusz');
    const thirdError: ValidationError = new MockError('Gawendi');

    it('returns empty array when there is no validation errors', async () => {
      expect(await read(sut.validationErrors)).toEqual([]);
    });

    it('returns list of child errors with index as name', async () => {
      sut.items.set([first, second, third]);
      first.validators.set([() => [firstError, secondError], () => [thirdError]]);
      second.validators.set([() => [firstError, secondError], () => [thirdError]]);
      expect(await read(sut.validationErrors)).toEqual([
        new ChildValidationError('0', firstError),
        new ChildValidationError('0', secondError),
        new ChildValidationError('0', thirdError),
        new ChildValidationError('1', firstError),
        new ChildValidationError('1', secondError),
        new ChildValidationError('1', thirdError),
      ]);
    });
  });

  describe('isValid', () => {
    it('returns false when there is validation error', async () => {
      sut.push(first);
      first.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isValid)).toBeFalse();
    });
  });

  describe('isInvalid', () => {
    it('returns false when there is validation error', async () => {
      sut.push(first);
      first.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isInvalid)).toBeTrue();
    });
  });

  describe('added', () => {
    it("doesn't dispatch when subscribed", () => {
      const callback: (event: FormControlArrayItemAddedEvent<string>) => void = createCallbackSpy();
      sut.itemAdded.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('merge', () => {
    it('merges sources projected by project callback into one observable', () => {
      const callback: (event: FormPropertyChangedEvent<string>) => void = createCallbackSpy();
      sut.items.set([first, second, third]);
      sut.merge((item) => item.value.changed).subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
      first.value.set('A');
      second.value.set('B');
      third.value.set('C');
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent('Fura', 'A'));
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent('Janusz', 'B'));
      expect(callback).toHaveBeenCalledWith(new FormPropertyChangedEvent('Gawendi', 'C'));
    });
  });

  describe('combine', () => {
    it('merges sources projected by project callback into observable with array of combined values', () => {
      const callback: (event: boolean[]) => void = createCallbackSpy();
      sut.items.set([first, second, third]);
      sut.combine((item) => item.isDisabled).subscribe(callback);
      second.disable();
      first.disable();
      third.disable();
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith([false, false, false]);
      expect(callback).toHaveBeenCalledWith([false, true, false]);
      expect(callback).toHaveBeenCalledWith([true, true, false]);
      expect(callback).toHaveBeenCalledWith([true, true, true]);
    });
  });
});
