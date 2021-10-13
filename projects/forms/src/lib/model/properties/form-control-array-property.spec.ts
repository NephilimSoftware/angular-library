import {BehaviorSubject} from 'rxjs';
import {OutOfRangeError} from '../../errors/out-of-range.error';
import {FormPropertyChangedEvent} from '../../events/form-property-changed.event';
import {IFormControl} from '../api';
import {qualityCheckFormControlProperty} from '../api.spec';
import {createCallbackSpy, wrapCallbackWithSpy} from '../callback.spec';
import {FormControl} from '../form-control';
import {FormControlArrayProperty} from './form-control-array-property';

describe('FormControlArrayProperty', () => {
  qualityCheckFormControlProperty(
    (initialValue) => {
      const formControls: BehaviorSubject<IFormControl<string>[]> = new BehaviorSubject<IFormControl<string>[]>([]);
      function updateFormControls(values: string[]): void {
        formControls.next(values.map((value) => new FormControl(value)));
      }
      return new FormControlArrayProperty<string>(initialValue, formControls, updateFormControls);
    },
    [],
    ['Fura', 'Janusz'],
    ['Fura', 'Janusz', 'Gawendi']
  );

  let sut: FormControlArrayProperty<string>;
  let items: BehaviorSubject<IFormControl<string>[]>;
  let updateItems: (value: string[]) => void;

  beforeEach(() => {
    updateItems = wrapCallbackWithSpy<string[], void>((values) => {
      items.next(values.map((value) => new FormControl<string>(value)));
    });
    items = new BehaviorSubject<IFormControl<string>[]>([]);
    sut = new FormControlArrayProperty<string>([], items, updateItems);
  });

  describe('subscribe', () => {
    let callback: (value: string[]) => void;
    beforeEach(() => {
      callback = createCallbackSpy();
    });

    it('calls callback with empty array when there is no controls', () => {
      items.next([]);
      sut.subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });

    it('calls callback with form control values with same order as form controls', () => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
      sut.subscribe(callback);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
    });

    it('calls callback when form control values has changed', () => {
      const firstFormControl: IFormControl<string> = new FormControl('Fura');
      items.next([firstFormControl, new FormControl('Janusz'), new FormControl('Gawendi')]);
      sut.subscribe(callback);
      firstFormControl.value.set('Zonk');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Zonk', 'Janusz', 'Gawendi']);
    });
  });

  describe('get', () => {
    it('returns empty array when there is no controls', () => {
      items.next([]);
      expect(sut.get()).toEqual([]);
    });

    it('returns form control values with same order as form controls', () => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
      expect(sut.get()).toEqual(['Fura', 'Janusz', 'Gawendi']);
    });

    it('returns updated value when form control value was changed', () => {
      const firstFormControl: IFormControl<string> = new FormControl('Fura');
      items.next([firstFormControl, new FormControl('Janusz'), new FormControl('Gawendi')]);
      firstFormControl.value.set('Zonk');
      expect(sut.get()).toEqual(['Zonk', 'Janusz', 'Gawendi']);
    });
  });

  describe('set', () => {
    it("doesn't call when isEqual returns true for all the items", () => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
      sut = new FormControlArrayProperty<string>([], items, updateItems, (a, b) => a.toLowerCase() === b.toLowerCase());
      sut.set(['FURA', 'janusz', 'gAWENDI']);
      expect(updateItems).not.toHaveBeenCalled();
    });
  });

  describe('push', () => {
    beforeEach(() => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
    });
    it('calls updateItems with value added to the end of items', () => {
      sut.push('Nephilim');
      expect(updateItems).toHaveBeenCalledOnceWith(['Fura', 'Janusz', 'Gawendi', 'Nephilim']);
    });

    it('calls updateItems with value added to the end of items even if it contains passed value', () => {
      sut.push('Gawendi');
      expect(updateItems).toHaveBeenCalledOnceWith(['Fura', 'Janusz', 'Gawendi', 'Gawendi']);
    });

    it('dispatches changed event with updated value', () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.push('Nephilim');
      expect(callback).toHaveBeenCalledOnceWith(
        new FormPropertyChangedEvent(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi', 'Nephilim'])
      );
    });

    it('calls subscription with updated value', () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.push('Nephilim');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi', 'Nephilim']);
    });
  });

  describe('insertAt', () => {
    beforeEach(() => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
    });
    it('throws OutOfRangeError when index is negative', () => {
      expect(() => sut.insertAt(-1, 'Gawendi')).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when index is greater than length of items', () => {
      expect(() => sut.insertAt(items.value.length + 1, 'Gawendi')).toThrowMatching(OutOfRangeError.match);
    });

    it('calls updateItems with value added in index passed in parameter', () => {
      sut.insertAt(0, 'Nephilim');
      expect(updateItems).toHaveBeenCalledOnceWith(['Nephilim', 'Fura', 'Janusz', 'Gawendi']);
    });

    it('calls updateItems value array even if it contains passed value', () => {
      sut.insertAt(1, 'Gawendi');
      expect(updateItems).toHaveBeenCalledOnceWith(['Fura', 'Gawendi', 'Janusz', 'Gawendi']);
    });

    it('calls updateItems value inserted at the end of items when index is equal to length of current items', () => {
      sut.insertAt(items.value.length, 'Nephilim');
      expect(updateItems).toHaveBeenCalledOnceWith(['Fura', 'Janusz', 'Gawendi', 'Nephilim']);
    });

    it('dispatches changed event with updated value', () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.insertAt(1, 'Nephilim');
      expect(callback).toHaveBeenCalledOnceWith(
        new FormPropertyChangedEvent(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Nephilim', 'Janusz', 'Gawendi'])
      );
    });

    it('calls subscription with updated value', () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.insertAt(1, 'Nephilim');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Nephilim', 'Janusz', 'Gawendi']);
    });
  });

  describe('move', () => {
    beforeEach(() => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
    });

    it('throws OutOfRangeError when fromIndex is negative', () => {
      expect(() => sut.move(-1, 0)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when fromIndex is equal to length of items', () => {
      expect(() => sut.move(items.value.length, 0)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when fromIndex is greater than length of items', () => {
      expect(() => sut.move(items.value.length + 1, 0)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when toIndex is negative', () => {
      expect(() => sut.move(0, -1)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when toIndex is equal to length of items', () => {
      expect(() => sut.move(0, items.value.length)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when toIndex is greater than length of items', () => {
      expect(() => sut.move(0, items.value.length + 1)).toThrowMatching(OutOfRangeError.match);
    });

    it('calls updateItems with reordered items when fromIndex is lower than toIndex', () => {
      sut.move(0, 2);
      expect(updateItems).toHaveBeenCalledOnceWith(['Janusz', 'Gawendi', 'Fura']);
    });

    it('calls updateItems with reordered items when fromIndex is greater than toIndex', () => {
      sut.move(2, 0);
      expect(updateItems).toHaveBeenCalledOnceWith(['Gawendi', 'Fura', 'Janusz']);
    });

    it("doesn't call updateItems with reordered items when fromIndex equals toIndex", () => {
      sut.move(2, 2);
      expect(updateItems).not.toHaveBeenCalled();
    });

    it('dispatches changed event with updated value', () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.move(0, 2);
      expect(callback).toHaveBeenCalledOnceWith(
        new FormPropertyChangedEvent(['Fura', 'Janusz', 'Gawendi'], ['Janusz', 'Gawendi', 'Fura'])
      );
    });

    it('calls subscription with updated value', () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.move(0, 2);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Janusz', 'Gawendi', 'Fura']);
    });

    it("doesn't dispatch changed event with updated value when fromIndex equals toIndex", () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.move(0, 0);
      expect(callback).not.toHaveBeenCalled();
    });

    it("doesn't call subscription with updated value when fromIndex equals toIndex", () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.move(0, 0);
      expect(callback).toHaveBeenCalledOnceWith(['Fura', 'Janusz', 'Gawendi']);
    });

    it("doesn't dispatch changed event with updated value when move didn't change value", () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.set(['A', 'A', 'B']);
      sut.changed.subscribe(callback);
      sut.move(0, 1);
      expect(callback).not.toHaveBeenCalled();
    });

    it("doesn't call subscription with updated value when move didn't change value", () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.set(['A', 'A', 'B']);
      sut.subscribe(callback);
      sut.move(0, 1);
      expect(callback).toHaveBeenCalledOnceWith(['A', 'A', 'B']);
    });
  });

  describe('removeAt', () => {
    beforeEach(() => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
    });

    it('throws OutOfRangeError when index is negative', () => {
      expect(() => sut.removeAt(-1)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when index is equal to length of items', () => {
      expect(() => sut.removeAt(items.value.length)).toThrowMatching(OutOfRangeError.match);
    });

    it('throws OutOfRangeError when index is greater than length of items', () => {
      expect(() => sut.removeAt(items.value.length + 1)).toThrowMatching(OutOfRangeError.match);
    });

    it('calls updateItems with array without items that match predicate', () => {
      sut.removeAt(0);
      expect(updateItems).toHaveBeenCalledOnceWith(['Janusz', 'Gawendi']);
    });

    it('calls updateItems with array without all items that match predicate', () => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
      sut.removeAt(1);
      expect(updateItems).toHaveBeenCalledOnceWith(['Fura', 'Gawendi']);
    });

    it('dispatches changed event with updated value', () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.removeAt(2);
      expect(callback).toHaveBeenCalledOnceWith(
        new FormPropertyChangedEvent(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Janusz'])
      );
    });

    it('calls subscription with updated value', () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.removeAt(2);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz']);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      items.next([new FormControl('Fura'), new FormControl('Janusz'), new FormControl('Gawendi')]);
    });
    it('calls updateItems with array without items that match predicate', () => {
      sut.remove((item) => item === 'Fura');
      expect(updateItems).toHaveBeenCalledOnceWith(['Janusz', 'Gawendi']);
    });

    it("doesn't call updateItems when items didn't match passed predicate", () => {
      sut.remove((item) => item === 'Nephilim');
      expect(updateItems).not.toHaveBeenCalled();
    });

    it('calls updateItems with array without all items that match predicate', () => {
      items.next([
        new FormControl('Fura'),
        new FormControl('Fura'),
        new FormControl('Janusz'),
        new FormControl('Gawendi'),
      ]);
      sut.remove((item) => item === 'Fura');
      expect(updateItems).toHaveBeenCalledOnceWith(['Janusz', 'Gawendi']);
    });

    it('dispatches changed event with updated value', () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.remove((item) => item === 'Fura');
      expect(callback).toHaveBeenCalledOnceWith(
        new FormPropertyChangedEvent(['Fura', 'Janusz', 'Gawendi'], ['Janusz', 'Gawendi'])
      );
    });

    it('calls subscription with updated value', () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.remove((item) => item === 'Fura');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(['Fura', 'Janusz', 'Gawendi']);
      expect(callback).toHaveBeenCalledWith(['Janusz', 'Gawendi']);
    });

    it("doesn't dispatch changed event when value was not changed", () => {
      const callback: (event: FormPropertyChangedEvent<string[]>) => void = createCallbackSpy();
      sut.changed.subscribe(callback);
      sut.remove((item) => item === 'Nephilim');
      expect(callback).not.toHaveBeenCalled();
    });

    it("doesn't call subscription when value was not changed", () => {
      const callback: (value: string[]) => void = createCallbackSpy();
      sut.subscribe(callback);
      sut.remove((item) => item === 'Nephilim');
      expect(callback).toHaveBeenCalledOnceWith(['Fura', 'Janusz', 'Gawendi']);
    });
  });
});
