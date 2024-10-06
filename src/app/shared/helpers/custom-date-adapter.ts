import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class CustomDateAdapter {
  fromModel(value: string | Date | NgbDateStruct): NgbDateStruct {
    if (value instanceof Date) {
      return {
        day: value.getUTCDate(),
        month: value.getUTCMonth() + 1,
        year: value.getUTCFullYear(),
      };
    }

    if (typeof value === 'string') {
      const dateObj = new Date(value);

      return {
        day: dateObj.getUTCDate(),
        month: dateObj.getUTCMonth() + 1,
        year: dateObj.getUTCFullYear(),
      };
    }

    return value;
  }

  toModel(value: NgbDateStruct | null): Date | null {
    if (!value) {
      return value;
    }

    const dateObj = new Date();

    dateObj.setUTCFullYear(value.year, value.month - 1, value.day);
    dateObj.setUTCHours(0, 0, 0, 0);

    return dateObj;
  }
}
