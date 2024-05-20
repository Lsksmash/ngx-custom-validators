import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { lte } from './validator';

const LESS_THAN_EQUAL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => LessThanEqualValidator),
  multi: true
};

@Directive({
  selector: '[lte][formControlName],[lte][formControl],[lte][ngModel]',
  providers: [LESS_THAN_EQUAL_VALIDATOR]
})
export class LessThanEqualValidator implements Validator, OnInit, OnChanges {
  @Input() lte: number | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    if (typeof this.lte !== 'undefined') {
      this.validator = lte(this.lte);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'lte') {
        if (typeof changes[key].currentValue !== 'undefined') {
          this.validator = lte(changes[key].currentValue);
        }
        if (this.onChange) {
          this.onChange();
        }
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any} |null{
    if (this.validator) {
      return this.validator(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
