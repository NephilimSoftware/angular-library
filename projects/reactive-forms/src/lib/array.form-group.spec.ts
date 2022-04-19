import {FormControl} from '@angular/forms';
import {currentValue} from './abstract-control';
import {Observable, Subject} from 'rxjs';
import {ArrayFormGroup} from './array.form-group';
import {read} from '@nephilimsoftware/observables';
import {createCallbackSpy} from './model/callback.spec';
import Spy = jasmine.Spy;

describe('ArrayFormGroup', () => {
  class MockFormControl extends FormControl {
    public readonly requested: Subject<string> = new Subject<string>();
  }

  let arrayFormGroup: ArrayFormGroup<MockFormControl>;

  beforeEach(() => {
    arrayFormGroup = new ArrayFormGroup();
  });

  it('pushes new element to list', async () => {
    arrayFormGroup.push(new MockFormControl());
    expect((await read(arrayFormGroup.items)).length).toBe(1);
  });

  it('inserts new elements', async () => {
    arrayFormGroup.insert(0, new MockFormControl('first control'));
    arrayFormGroup.insert(1, new MockFormControl('second control'));
    expect((await read(arrayFormGroup.items))[0].value).toBe('first control');
    expect((await read(arrayFormGroup.items))[1].value).toBe('second control');
  });

  it('sets new elements', async () => {
    arrayFormGroup.setItems([new MockFormControl(), new MockFormControl()]);
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes given item', async () => {
    const items: MockFormControl[] = [
      new MockFormControl('first'),
      new MockFormControl('second'),
      new MockFormControl('third'),
    ];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeItem(items[1]);
    expect((await read(arrayFormGroup.items))[0].value).toBe('first');
    expect((await read(arrayFormGroup.items))[1].value).toBe('third');
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes item by index', async () => {
    const items: MockFormControl[] = [
      new MockFormControl('first'),
      new MockFormControl('second'),
      new MockFormControl('third'),
    ];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeAt(1);
    expect((await read(arrayFormGroup.items))[0].value).toBe('first');
    expect((await read(arrayFormGroup.items))[1].value).toBe('third');
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes all items', async () => {
    const items: MockFormControl[] = [
      new MockFormControl('first'),
      new MockFormControl('second'),
      new MockFormControl('third'),
    ];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeAllItems();
    expect((await read(arrayFormGroup.items)).length).toBe(0);
  });

  it('merges all events', () => {
    const controls: MockFormControl[] = [new MockFormControl(), new MockFormControl()];
    const callback: Spy = createCallbackSpy();
    arrayFormGroup.setItems(controls);
    const merged: Observable<string> = arrayFormGroup.merge((item) => item.requested);
    merged.subscribe(callback);

    expect(callback).not.toHaveBeenCalled();

    controls[0].requested.next('first');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');

    controls[1].requested.next('second');
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('combines all values', () => {
    const controls: MockFormControl[] = [new MockFormControl(), new MockFormControl()];
    const callback: Spy = createCallbackSpy();
    arrayFormGroup.setItems(controls);
    const combine: Observable<string[]> = arrayFormGroup.combine((item) => currentValue(item));
    combine.subscribe(callback);

    controls[0].setValue('first');
    controls[1].setValue('second');

    expect(callback).toHaveBeenCalledWith(['first', 'second']);

    controls[1].setValue('third');

    expect(callback).toHaveBeenCalledWith(['first', 'third']);
  });
});
