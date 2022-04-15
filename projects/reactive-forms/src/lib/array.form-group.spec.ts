import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {ArrayFormGroup} from './array.form-group';
import {read} from '@nephilimsoftware/observables';

describe('ArrayFormGroup', () => {
  let arrayFormGroup: ArrayFormGroup<FormControl>;

  beforeEach(() => {
    arrayFormGroup = new ArrayFormGroup();
  });

  it('pushes new element to list', async () => {
    arrayFormGroup.push(new FormControl());
    expect((await read(arrayFormGroup.items)).length).toBe(1);
  });

  it('inserts new elements', async () => {
    arrayFormGroup.insert(0, new FormControl('first control'));
    arrayFormGroup.insert(1, new FormControl('second control'));
    expect((await read(arrayFormGroup.items))[0].value).toBe('first control');
    expect((await read(arrayFormGroup.items))[1].value).toBe('second control');
  });

  it('sets new elements', async () => {
    arrayFormGroup.setItems([new FormControl(), new FormControl()]);
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes given item', async () => {
    const items: FormControl[] = [new FormControl('first'), new FormControl('second'), new FormControl('third')];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeItem(items[1]);
    expect((await read(arrayFormGroup.items))[0].value).toBe('first');
    expect((await read(arrayFormGroup.items))[1].value).toBe('third');
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes item by index', async () => {
    const items: FormControl[] = [new FormControl('first'), new FormControl('second'), new FormControl('third')];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeAt(1);
    expect((await read(arrayFormGroup.items))[0].value).toBe('first');
    expect((await read(arrayFormGroup.items))[1].value).toBe('third');
    expect((await read(arrayFormGroup.items)).length).toBe(2);
  });

  it('removes all items', async () => {
    const items: FormControl[] = [new FormControl('first'), new FormControl('second'), new FormControl('third')];
    arrayFormGroup.setItems(items);
    arrayFormGroup.removeAllItems();
    expect((await read(arrayFormGroup.items)).length).toBe(0);
  });

  // it('merges all events', async () => {
  //   const controls: FormControl[] = [new FormControl('init-0'), new FormControl('init-1')];
  //   arrayFormGroup.setItems(controls);
  //   const merged: Observable<string> = arrayFormGroup.merge((item) => item.valueChanges);
  // });
  //
  // it('combine all values', async () => {
  //   const controls: FormControl[] = [new FormControl('init-0'), new FormControl('init-1')];
  //   arrayFormGroup.setItems(controls);
  //   const combine: Observable<string[]> = arrayFormGroup.combine((item) => item.value);
  // });
  //
  // it('fetches data synchronously', async () => {
  //   arrayFormGroup.push(new FormControl('init'));
  // });
});
