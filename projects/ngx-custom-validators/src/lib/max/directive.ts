import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { max } from './validator';

const MAX_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxValidator),
  multi: true
};

@Directive({
  selector: '[max][formControlName],[max][formControl],[max][ngModel]',
  providers: [MAX_VALIDATOR]
})
export class MaxValidator implements Validator, OnInit, OnChanges {
  @Input() max: number | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    if (typeof this.max !== 'undefined') {
      this.validator = max(this.max);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'max') {
        if (typeof changes[key].currentValue !== 'undefined') {
          this.validator = max(changes[key].currentValue);
        }
        if (this.onChange) {
          this.onChange();
        }
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any}|null {
    if (this.validator) {
      return this.validator(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
