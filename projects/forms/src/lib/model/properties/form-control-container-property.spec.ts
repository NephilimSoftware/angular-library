import {BehaviorSubject} from 'rxjs';
import Spy = jasmine.Spy;
import {qualityCheckFormControlProperty} from '../api.spec';
import {createCallbackSpy} from '../callback.spec';
import {read} from '../observables';
import {FormControlContainerProperty} from './form-control-container-property';
import {FormControlProperty} from './form-control-property';

describe('FormControlContainerProperty', () => {
  interface MockDto {
    developer: string;
    pages: number;
  }

  qualityCheckFormControlProperty<MockDto>(
    (initialValue) => {
      const developer: FormControlProperty<string> = new FormControlProperty<string>(initialValue.developer);
      const pages: FormControlProperty<number> = new FormControlProperty<number>(initialValue.pages);
      return new FormControlContainerProperty<MockDto>(
        new BehaviorSubject({
          developer,
          pages,
        })
      );
    },
    {
      developer: '',
      pages: 0,
    },
    {
      developer: 'Fura',
      pages: 333,
    },
    {
      developer: 'Diaboł',
      pages: 666,
    }
  );

  describe('get()', () => {
    it('returns combined value of child properties', () => {
      const developer: FormControlProperty<string> = new FormControlProperty<string>('Fura');
      const pages: FormControlProperty<number> = new FormControlProperty<number>(333);
      const sut: FormControlContainerProperty<MockDto> = new FormControlContainerProperty<MockDto>(
        new BehaviorSubject({
          developer,
          pages,
        })
      );

      expect(sut.get()).toEqual({
        developer: developer.get(),
        pages: pages.get(),
      });
    });
  });

  describe('set()', () => {
    let developer: FormControlProperty<string>;
    let pages: FormControlProperty<number>;
    let expectedResult: MockDto;
    let sut: FormControlContainerProperty<MockDto>;

    beforeEach(() => {
      developer = new FormControlProperty<string>('');
      pages = new FormControlProperty<number>(0);
      expectedResult = {
        developer: 'Fura',
        pages: 333,
      };
      sut = new FormControlContainerProperty<MockDto>(
        new BehaviorSubject({
          developer,
          pages,
        })
      );
    });

    it('sets values to children', () => {
      sut.set(expectedResult);

      expect(developer.get()).toEqual(expectedResult.developer);
      expect(pages.get()).toEqual(expectedResult.pages);
    });

    it('doesn\'t stop listening for changes on controls after setting value', async () => {
      sut.set(expectedResult);

      developer.set('Diaboł');
      pages.set(666);

      const value: MockDto = sut.get();

      expect(value.developer).toEqual('Diaboł');
      expect(value.pages).toEqual(666);

      expect(await read(sut)).toEqual({developer: 'Diaboł', pages: 666});
    });
  });

  describe('observable', () => {
    it('executes callback when child property was changed', () => {
      const callback: Spy = createCallbackSpy();
      const developer: FormControlProperty<string> = new FormControlProperty<string>('');
      const pages: FormControlProperty<number> = new FormControlProperty<number>(0);
      const sut: FormControlContainerProperty<MockDto> = new FormControlContainerProperty<MockDto>(
        new BehaviorSubject({
          developer,
          pages,
        })
      );

      sut.subscribe(callback);

      developer.set('Fura');

      expect(callback).toHaveBeenCalledWith({
        developer: 'Fura',
        pages: 0,
      });

      pages.set(333);

      expect(callback).toHaveBeenCalledWith({
        developer: 'Fura',
        pages: 333,
      });
    });
  });
});
