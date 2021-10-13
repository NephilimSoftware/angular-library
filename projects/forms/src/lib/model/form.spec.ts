import {FormControlContainerChildAlreadyAddedError} from '../errors/form-control-container-child-already-added.error';
import {FormControlContainerChildNotAddedYetError} from '../errors/form-control-container-child-not-added-yet.error';
import {qualityCheckFormControl, MockError} from './api.spec';
import {createCallbackSpy} from './callback.spec';
import {Form} from './form';
import {FormControl} from './form-control';
import {read} from './observables';
import {ChildValidationError, ValidationError} from './validation-errors';
import Spy = jasmine.Spy;

describe('Form', () => {
  interface ChildDto {
    id: number;
    name: string;
  }
  interface MockDto {
    description: string;
    pages: number;
    child: ChildDto;
  }

  class ChildForm extends Form<ChildDto> {
    public readonly id: FormControl<number> = this.add('id', new FormControl<number>(0));
    public readonly name: FormControl<string> = this.add('name', new FormControl<string>(''));
  }

  class MockForm extends Form<MockDto> {
    public readonly pages: FormControl<number> = this.add('pages', new FormControl<number>(0));
    public readonly description: FormControl<string> = this.add('description', new FormControl<string>(''));
    public readonly child: ChildForm = this.add('child', new ChildForm());
  }

  qualityCheckFormControl<MockDto>(() => new MockForm());

  describe('validationErrors', () => {
    const firstError: ValidationError = new MockError('Fura');
    const secondError: ValidationError = new MockError('Janusz');
    const thirdError: ValidationError = new MockError('Gawendi');
    let sut: MockForm;

    beforeEach(() => {
      sut = new MockForm();
    });

    it('returns empty array when there is no validation errors', async () => {
      expect(await read(sut.validationErrors)).toEqual([]);
    });

    it('returns combined list of children errors wrapped with ChildValidationError with its name as path', async () => {
      sut.description.validators.set([() => [firstError, secondError], () => [thirdError]]);
      sut.child.name.validators.set([() => [firstError, secondError], () => [thirdError]]);
      expect(await read(sut.validationErrors)).toEqual([
        new ChildValidationError('description', firstError),
        new ChildValidationError('description', secondError),
        new ChildValidationError('description', thirdError),
        new ChildValidationError('child', new ChildValidationError('name', firstError)),
        new ChildValidationError('child', new ChildValidationError('name', secondError)),
        new ChildValidationError('child', new ChildValidationError('name', thirdError)),
      ]);
    });
  });

  describe('isValid', () => {
    it('returns false when there is validation error', async () => {
      const sut: MockForm = new MockForm();
      sut.description.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isValid)).toBeFalse();
    });
  });

  describe('isInvalid', () => {
    it('returns false when there is validation error', async () => {
      const sut: MockForm = new MockForm();
      sut.description.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isInvalid)).toBeTrue();
    });
  });

  describe('disable()/enable()', () => {
    let sut: MockForm;

    beforeEach(() => {
      sut = new MockForm();
    });

    it('disables and enables all children', async () => {
      sut.disable();
      expect(await read(sut.isDisabled)).toBeTrue();
      expect(await read(sut.pages.isDisabled)).toBeTrue();
      expect(await read(sut.description.isDisabled)).toBeTrue();
      expect(await read(sut.child.isDisabled)).toBeTrue();
      expect(await read(sut.child.id.isDisabled)).toBeTrue();
      expect(await read(sut.child.name.isDisabled)).toBeTrue();
      sut.enable();
      expect(await read(sut.isDisabled)).toBeFalse();
      expect(await read(sut.pages.isDisabled)).toBeFalse();
      expect(await read(sut.description.isDisabled)).toBeFalse();
      expect(await read(sut.child.isDisabled)).toBeFalse();
      expect(await read(sut.child.id.isDisabled)).toBeFalse();
      expect(await read(sut.child.name.isDisabled)).toBeFalse();
    });

    it("doesn't enable children that were disabled separately", async () => {
      sut.description.disable();
      sut.disable();
      sut.child.name.disable();

      expect(await read(sut.description.isDisabled)).toBeTrue();
      expect(await read(sut.child.name.isDisabled)).toBeTrue();

      sut.enable();

      expect(await read(sut.description.isDisabled)).toBeTrue();
      expect(await read(sut.child.name.isDisabled)).toBeTrue();
    });
  });

  describe('markAsTouched()/markAsUntouched()', () => {
    let sut: MockForm;
    let callback: Spy;

    beforeEach(() => {
      sut = new MockForm();
      callback = createCallbackSpy();
    });

    it('marks as touched/untouched all descendants', async () => {
      sut.markAsTouched();
      expect(await read(sut.wasTouched)).toBeTrue();
      expect(await read(sut.pages.wasTouched)).toBeTrue();
      expect(await read(sut.description.wasTouched)).toBeTrue();
      expect(await read(sut.child.wasTouched)).toBeTrue();
      expect(await read(sut.child.id.wasTouched)).toBeTrue();
      expect(await read(sut.child.name.wasTouched)).toBeTrue();
      sut.markAsUntouched();
      expect(await read(sut.wasTouched)).toBeFalse();
      expect(await read(sut.pages.wasTouched)).toBeFalse();
      expect(await read(sut.description.wasTouched)).toBeFalse();
      expect(await read(sut.child.wasTouched)).toBeFalse();
      expect(await read(sut.child.id.wasTouched)).toBeFalse();
      expect(await read(sut.child.name.wasTouched)).toBeFalse();
    });

    it('marks as untouched descendants that were previously marked as touched', async () => {
      sut.description.markAsTouched();
      sut.markAsUntouched();
      expect(await read(sut.description.wasTouched)).toBeFalse();
    });
  });

  describe('markAsDirty()/markAsPristine()', () => {
    let sut: MockForm;
    let callback: Spy;

    beforeEach(() => {
      sut = new MockForm();
      callback = createCallbackSpy();
    });

    it('marks as dirty/pristine all descendants', async () => {
      sut.markAsDirty();
      expect(await read(sut.isDirty)).toBeTrue();
      expect(await read(sut.pages.isDirty)).toBeTrue();
      expect(await read(sut.description.isDirty)).toBeTrue();
      expect(await read(sut.child.isDirty)).toBeTrue();
      expect(await read(sut.child.id.isDirty)).toBeTrue();
      expect(await read(sut.child.name.isDirty)).toBeTrue();
      sut.markAsPristine();
      expect(await read(sut.isDirty)).toBeFalse();
      expect(await read(sut.pages.isDirty)).toBeFalse();
      expect(await read(sut.description.isDirty)).toBeFalse();
      expect(await read(sut.child.isDirty)).toBeFalse();
      expect(await read(sut.child.id.isDirty)).toBeFalse();
      expect(await read(sut.child.name.isDirty)).toBeFalse();
    });

    it('marks as pristine descendants that were previously marked as dirty', async () => {
      sut.description.markAsDirty();
      sut.markAsPristine();
      expect(await read(sut.description.isDirty)).toBeFalse();
    });
  });

  describe('add', () => {
    let sut: Form;
    beforeEach(() => {
      sut = new Form();
    });

    it('returns added control to form group', () => {
      const control: FormControl = new FormControl('');
      expect(sut.add('test', control)).toBe(control);
    });

    it('throws error when control for chosen name was already added', () => {
      sut.add('test', new FormControl(''));
      expect(() => sut.add('test', new FormControl(''))).toThrowMatching(
        FormControlContainerChildAlreadyAddedError.match
      );
    });

    it('throws error when the same control ', () => {
      const control: FormControl = new FormControl('');
      sut.add('test', control);
      expect(() => sut.add('test2', control)).toThrowMatching(FormControlContainerChildAlreadyAddedError.match);
    });
  });

  describe('contains', () => {
    let sut: Form;
    let control: FormControl;

    beforeEach(() => {
      sut = new Form();
      control = new FormControl('');
    });

    it('returns true when control was added to form group', () => {
      sut.add('test', control);
      expect(sut.contains(control)).toBeTrue();
    });

    it('returns false when control was not added to form group', () => {
      expect(sut.contains(control)).toBeFalse();
    });

    it('returns false when control was added and removed from form group', () => {
      sut.add('test', control);
      sut.remove('test');

      expect(sut.contains(control)).toBeFalse();
    });
  });

  describe('remove', () => {
    it('throws error when user tries to remove control that was not added', () => {
      const sut: Form = new Form();
      expect(() => sut.remove('test')).toThrowMatching(FormControlContainerChildNotAddedYetError.match);
    });
  });

  describe('destroy', () => {
    let sut: MockForm;
    let callback: Spy;

    beforeEach(() => {
      sut = new MockForm();
      callback = createCallbackSpy();
    });

    it('stops executing callbacks for value', () => {
      sut.value.set({
        pages: 333,
        description: 'mock',
        child: {
          id: 1,
          name: 'test',
        },
      });
      sut.value.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      sut.destroy();
      sut.value.set({
        pages: 111,
        description: 'mock',
        child: {
          id: 2,
          name: 'test',
        },
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stops executing callbacks for validation', () => {
      sut.description.validators.set([() => [new ValidationError()]]);
      sut.validationErrors.subscribe(callback);
      sut.isValidating.subscribe(callback);
      sut.isValid.subscribe(callback);
      sut.isInvalid.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(4);
      sut.destroy();
      sut.description.validators.set([]);
      expect(callback).toHaveBeenCalledTimes(4);
    });
  });
});
