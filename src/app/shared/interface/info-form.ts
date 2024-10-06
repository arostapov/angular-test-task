import { FormControl } from '@angular/forms';

export interface InfoForm {
  country: FormControl<string | null>;
  username: FormControl<string | null>;
  date: FormControl<Date | null>;
}
