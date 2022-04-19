import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ControlDebugComponent} from '@app/forms/components/control-debug/control-debug.component';
import {ControlEventsLogComponent} from '@app/forms/components/control-events-log/control-events-log.component';
import {ControlExampleComponent} from '@app/forms/components/control-example/control-example.component';
import {ControlTemplateCodeComponent} from '@app/forms/components/control-template-code/control-template-code.component';
import {ControlTsCodeComponent} from '@app/forms/components/control-ts-code/control-ts-code.component';
import {ImportComponent} from '@app/forms/components/import/import.component';
import {RequiredImportsComponent} from '@app/forms/components/required-imports/required-imports.component';
import {RootComponent} from '@app/forms/components/root/root.component';
import {FormsRoutingModule} from '@app/forms/forms-routing.module';
import {FormAsynchronousValidatorsPage} from '@app/forms/pages/examples/form/asynchronous-validators/form-asynchronous-validators.page';
import {FormSubmitPage} from '@app/forms/pages/examples/form/submit/form-submit.page';
import {InputCheckboxPage} from '@app/forms/pages/examples/input/checkbox/input-checkbox.page';
import {InputDatePage} from '@app/forms/pages/examples/input/date/input-date.page';
import {InputDatetimeLocalPage} from '@app/forms/pages/examples/input/datetime-local/input-datetime-local.page';
import {InputEmailPage} from '@app/forms/pages/examples/input/email/input-email.page';
import {InputFilePage} from '@app/forms/pages/examples/input/file/input-file.page';
import {InputMonthPage} from '@app/forms/pages/examples/input/month/input-month.page';
import {InputNumberPage} from '@app/forms/pages/examples/input/number/input-number.page';
import {InputPasswordPage} from '@app/forms/pages/examples/input/password/input-password.page';
import {InputRadioPage} from '@app/forms/pages/examples/input/radio/input-radio.page';
import {InputRangePage} from '@app/forms/pages/examples/input/range/input-range.page';
import {InputSearchPage} from '@app/forms/pages/examples/input/search/input-search.page';
import {InputTextPage} from '@app/forms/pages/examples/input/text/input-text.page';
import {InputTimePage} from '@app/forms/pages/examples/input/time/input-time.page';
import {InputWeekPage} from '@app/forms/pages/examples/input/week/input-week.page';
import {SelectMultiplePage} from '@app/forms/pages/examples/select/multiple/select-multiple.page';
import {SelectSinglePage} from '@app/forms/pages/examples/select/single/select-single.page';
import {TextareaPage} from '@app/forms/pages/examples/textarea/textarea.page';
import {CheckPipe} from '@app/forms/pipes/check.pipe';
import {FormsModule} from '@nephilimsoftware/forms';

const components: any[] = [
  ControlDebugComponent,
  ControlEventsLogComponent,
  ControlExampleComponent,
  ControlTemplateCodeComponent,
  ControlTsCodeComponent,
  ImportComponent,
  RequiredImportsComponent,
];
const pages: any[] = [
  FormAsynchronousValidatorsPage,
  FormSubmitPage,
  InputCheckboxPage,
  InputDatePage,
  InputDatetimeLocalPage,
  InputEmailPage,
  InputFilePage,
  InputMonthPage,
  InputNumberPage,
  InputPasswordPage,
  InputRadioPage,
  InputRangePage,
  InputSearchPage,
  InputTextPage,
  InputTimePage,
  InputWeekPage,
  SelectMultiplePage,
  SelectSinglePage,
  TextareaPage,
];
const pipes: any[] = [CheckPipe];

@NgModule({
  declarations: [RootComponent, ...components, ...pages, ...pipes],
  imports: [CommonModule, FormsModule, FormsRoutingModule],
  exports: [...components, ...pages, ...pipes],
})
export class AppFormsModule {}
