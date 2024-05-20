import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { lt } from './validator';

const LESS_THAN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => LessThanValidator),
  multi: true
};

@Directive({
  selector: '[lt][formControlName],[lt][formControl],[lt][ngModel]',
  providers: [LESS_THAN_VALIDATOR]
})
export class LessThanValidator implements Validator, OnInit, OnChanges {
  @Input() lt: number | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    if (typeof this.lt === 'number') {
      this.validator = lt(this.lt);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'lt') {
        if (typeof changes[key].currentValue === 'number') {
          this.validator = lt(changes[key].currentValue);
          if (this.onChange) {
            this.onChange();
          }
        }
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any} | null{
    if (this.validator) {
      return this.validator(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
