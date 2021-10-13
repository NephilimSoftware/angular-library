import {Component, Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '../forms.module';
import {FormControl} from '../model/form-control';

export function itBindsDirectiveTo(description: string, html: string, directive: Type<any>): void {
  it(`binds to ${description}`, () => {
    @Component({
      template: html,
    })
    class MockComponent {
      public readonly formControl: FormControl<string> = new FormControl<string>('');
    }

    const fixture: ComponentFixture<MockComponent> = TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MockComponent],
    }).createComponent(MockComponent);

    expect(fixture.debugElement.queryAll(By.directive(directive)).length).toBe(1);
  });
}
