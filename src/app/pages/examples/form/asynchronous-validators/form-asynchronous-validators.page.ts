import {Component, OnDestroy} from '@angular/core';
import {FormControl, SubmittableForm, ValidationError} from '@nephilimsoftware/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

interface FormDto {
  title: string;
  age: number;
}

class ExampleValidationError extends ValidationError {
  constructor(public readonly message: string) {
    super();
  }

  public toString(): string {
    return this.message;
  }
}

function validateLengthAsync(
  requiredLength: number,
  delayTime: number
): (value: string) => Observable<ValidationError[]> {
  return (value: string) =>
    new BehaviorSubject<ValidationError[]>(
      value.length < requiredLength
        ? [new ExampleValidationError(`Must have at least ${requiredLength} characters`)]
        : []
    ).pipe(
      tap(() => console.log('validating value:', value)),
      delay(delayTime),
      tap(() => console.log('validated value:', value))
    );
}

class ExampleForm extends SubmittableForm<FormDto> {
  public readonly title: FormControl<string> = this.add('title', new FormControl<string>(''));
  public readonly age: FormControl<number> = this.add('age', new FormControl<number>(0));

  constructor() {
    super();

    this.title.validators.set([validateLengthAsync(4, 5000)]);
  }
}

@Component({
  templateUrl: 'form-asynchronous-validators.page.html',
})
export class FormAsynchronousValidatorsPage implements OnDestroy {
  public readonly form: ExampleForm = new ExampleForm();

  public readonly result: BehaviorSubject<FormDto | null> = new BehaviorSubject<FormDto | null>(null);

  public async onSubmitted(event: Event): Promise<void> {
    event.preventDefault();
    //
    // try {
    //   await read(this.form.submit(() => new BehaviorSubject(null).pipe(delay(1000))));
    //   this.result.next(this.form.value.get());
    // } catch (errors) {
    //   console.log(errors);
    // }
    this.form
      .submit(() => new BehaviorSubject(null).pipe(delay(1000)))
      .subscribe(
        () => {
          this.result.next(this.form.value.get());
        },
        (errors) => {
          console.log(errors);
        }
      );
  }

  public ngOnDestroy(): void {
    this.form.destroy();
  }
}
