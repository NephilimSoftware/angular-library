import {Component, OnDestroy} from '@angular/core';
import {allAreTrue, Form, FormArray, FormControl, IFormControlContainer, SubmittableForm, Validate} from '@nephilimsoftware/forms';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {delay, map} from 'rxjs/operators';

interface AddressDto {
  street: string;
  city: string;
  postalCode: string;
}

interface UserDto {
  login: string;
  firstName: string;
  lastName: string;
  isAddressRequired: boolean;
  age: number;
  address: AddressDto;
  additionalAddresses: AddressDto[];
  friendNames: string[];
}

class AddressForm extends Form<AddressDto> {
  public readonly street: FormControl<string> = this.add('street', new FormControl(''));
  public readonly city: FormControl<string> = this.add('city', new FormControl('', [Validate.isRequired]));
  public readonly postalCode: FormControl<string> = this.add('postalCode', new FormControl(''));

  constructor(initialValue?: AddressDto) {
    super();

    if (initialValue) {
      this.value.set(initialValue);
    }
  }
}

class UserForm extends SubmittableForm<UserDto> {
  public readonly login: FormControl<string> = this.add(
    'login',
    new FormControl<string>('', [Validate.isRequired])
  );
  public readonly firstName: FormControl<string> = new FormControl<string>('', [Validate.isRequired]);
  public readonly lastName: FormControl<string> = this.add(
    'lastName',
    new FormControl<string>('', [Validate.isRequired])
  );
  public readonly age: FormControl<number> = this.add('age', new FormControl<number>(0));
  public readonly isAddressRequired: FormControl<boolean> = new FormControl<boolean>(false);
  public readonly address: AddressForm = new AddressForm();
  public readonly additionalAddresses: FormArray<AddressDto, AddressForm> = this.add(
    'additionalAddresses',
    new FormArray<AddressDto, AddressForm>([], (address) => new AddressForm(address))
  );

  public readonly friendNames: FormArray<string> = this.add(
    'friendNames',
    new FormArray([], (v) => new FormControl(v, [Validate.isRequired]))
  );

  private readonly _subscriptions: Subscription[];

  constructor() {
    super();

    const isFirstNameEnabled: Observable<boolean> = this.login.value.pipe(map((value) => value.length > 3));

    this._subscriptions = [
      isFirstNameEnabled.subscribe(IFormControlContainer.setChild<UserDto>(this, 'firstName', this.firstName)),
      combineLatest([this.firstName.isValid, isFirstNameEnabled])
        .pipe(allAreTrue())
        .subscribe(IFormControlContainer.setChild<UserDto>(this, 'lastName', this.lastName)),
      this.isAddressRequired.value.subscribe(IFormControlContainer.setChild<UserDto>(this, 'address', this.address)),
    ];
  }

  public destroy(): void {
    super.destroy();

    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

interface SubmitTaskResponseDto {
  code: string;
  data: UserDto;
}

@Component({
  templateUrl: 'form-submit.page.html',
})
export class FormSubmitPage implements OnDestroy {
  public readonly form: UserForm = new UserForm();

  public readonly result: BehaviorSubject<UserDto | null> = new BehaviorSubject<UserDto | null>(null);

  public async onSubmitted(event: Event): Promise<void> {
    event.preventDefault();
    // const response: SubmitTaskResponseDto = await read(this.form.submit(this._saveUserDto));
    // this.result.next(response.data);
    this.form.submit(this._saveUserDto).subscribe((response) => this.result.next(response.data));
  }

  public onAddAddressClicked(): void {
    this.form.additionalAddresses.push(new AddressForm());
  }

  public onAddFriendNameClicked(): void {
    this.form.friendNames.push(new FormControl('', [Validate.isRequired]));
  }

  public onRemoveAddressClicked(address: AddressForm): void {
    this.form.additionalAddresses.remove(address);
  }

  public ngOnDestroy(): void {
    this.form.destroy();
  }

  private readonly _saveUserDto = (data: UserDto): Observable<SubmitTaskResponseDto> => {
    return new BehaviorSubject<SubmitTaskResponseDto>({
      code: 'success',
      data,
    }).pipe(delay(1000));
  };
}
