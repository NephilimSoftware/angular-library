import {ValidationErrors} from '@angular/forms';

export class ValidationError {
  public constructor(public readonly errors: ValidationErrors) {}
}
