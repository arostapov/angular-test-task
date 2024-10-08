import { Settings } from '../interface/settings';

export const defaultSettings: Settings = {
  maxFormsCount: {
    id: 'setting1',
    title: 'Max Forms Count',
    value: 10,
    controlType: 'input',
  },
  dropdownAppearance: {
    id: 'setting3',
    title: 'Dropdown Appearance',
    value: 'input',
    controlType: 'select',
    options: ['input', 'focus'],
  },
  formCancellableSeconds: {
    id: 'setting4',
    title: 'Form Cancellable In Seconds',
    value: 15,
    controlType: 'input',
  },
};
