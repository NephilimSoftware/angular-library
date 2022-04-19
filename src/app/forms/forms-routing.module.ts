import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from '@app/forms/components/root/root.component';
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

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'examples',
        children: [
          {
            path: 'input',
            children: [
              {
                path: 'text',
                component: InputTextPage,
              },
              {
                path: 'password',
                component: InputPasswordPage,
              },
              {
                path: 'email',
                component: InputEmailPage,
              },
              {
                path: 'search',
                component: InputSearchPage,
              },
              {
                path: 'number',
                component: InputNumberPage,
              },
              {
                path: 'date',
                component: InputDatePage,
              },
              {
                path: 'week',
                component: InputWeekPage,
              },
              {
                path: 'month',
                component: InputMonthPage,
              },
              {
                path: 'time',
                component: InputTimePage,
              },
              {
                path: 'datetime-local',
                component: InputDatetimeLocalPage,
              },
              {
                path: 'range',
                component: InputRangePage,
              },
              {
                path: 'file',
                component: InputFilePage,
              },
              {
                path: 'checkbox',
                component: InputCheckboxPage,
              },
              {
                path: 'radio',
                component: InputRadioPage,
              },
            ],
          },
          {
            path: 'textarea',
            component: TextareaPage,
          },
          {
            path: 'select',
            children: [
              {
                path: 'single',
                component: SelectSinglePage,
              },
              {
                path: 'multiple',
                component: SelectMultiplePage,
              },
            ],
          },
          {
            path: 'form',
            children: [
              {
                path: 'submit',
                component: FormSubmitPage,
              },
              {
                path: 'async-validators',
                component: FormAsynchronousValidatorsPage,
              }
            ]
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}
