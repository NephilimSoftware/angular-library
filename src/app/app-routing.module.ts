import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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

const routes: Routes = [
  {
    path: '',
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
