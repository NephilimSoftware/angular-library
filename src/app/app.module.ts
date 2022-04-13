import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ControlDebugComponent} from '@app/components/control-debug/control-debug.component';
import {ControlEventsLogComponent} from '@app/components/control-events-log/control-events-log.component';
import {ControlExampleComponent} from '@app/components/control-example/control-example.component';
import {ControlTemplateCodeComponent} from '@app/components/control-template-code/control-template-code.component';
import {ControlTsCodeComponent} from '@app/components/control-ts-code/control-ts-code.component';
import {ImportComponent} from '@app/components/import/import.component';
import {RequiredImportsComponent} from '@app/components/required-imports/required-imports.component';
import {RootComponent} from '@app/components/root/root.component';
import {FormAsynchronousValidatorsPage} from '@app/pages/examples/form/asynchronous-validators/form-asynchronous-validators.page';
import {FormSubmitPage} from '@app/pages/examples/form/submit/form-submit.page';
import {InputCheckboxPage} from '@app/pages/examples/input/checkbox/input-checkbox.page';
import {InputDatePage} from '@app/pages/examples/input/date/input-date.page';
import {InputDatetimeLocalPage} from '@app/pages/examples/input/datetime-local/input-datetime-local.page';
import {InputEmailPage} from '@app/pages/examples/input/email/input-email.page';
import {InputFilePage} from '@app/pages/examples/input/file/input-file.page';
import {InputMonthPage} from '@app/pages/examples/input/month/input-month.page';
import {InputNumberPage} from '@app/pages/examples/input/number/input-number.page';
import {InputPasswordPage} from '@app/pages/examples/input/password/input-password.page';
import {InputRadioPage} from '@app/pages/examples/input/radio/input-radio.page';
import {InputRangePage} from '@app/pages/examples/input/range/input-range.page';
import {InputSearchPage} from '@app/pages/examples/input/search/input-search.page';
import {InputTextPage} from '@app/pages/examples/input/text/input-text.page';
import {InputTimePage} from '@app/pages/examples/input/time/input-time.page';
import {InputWeekPage} from '@app/pages/examples/input/week/input-week.page';
import {SelectMultiplePage} from '@app/pages/examples/select/multiple/select-multiple.page';
import {SelectSinglePage} from '@app/pages/examples/select/single/select-single.page';
import {TextareaPage} from '@app/pages/examples/textarea/textarea.page';
import {CheckPipe} from '@app/pipes/check.pipe';
import {FormsModule} from '@nephilimsoftware/forms';

import {AppRoutingModule} from './app-routing.module';

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
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [RootComponent],
})
export class AppModule {}
