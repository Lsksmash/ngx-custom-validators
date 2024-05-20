import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { range } from './validator';

const RANGE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RangeValidator),
  multi: true
};

@Directive({
  selector: '[range][formControlName],[range][formControl],[range][ngModel]',
  providers: [RANGE_VALIDATOR]
})
export class RangeValidator implements Validator, OnInit, OnChanges {
  @Input() range: [number] | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    this.validator = range(this.range!);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'range') {
        this.validator = range(changes[key].currentValue);
        if (this.onChange) {
          this.onChange();
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
