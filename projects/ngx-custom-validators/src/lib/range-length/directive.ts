import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { rangeLength } from './validator';

const RANGE_LENGTH_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RangeLengthValidator),
  multi: true
};

@Directive({
  selector: '[rangeLength][formControlName],[rangeLength][formControl],[rangeLength][ngModel]',
  providers: [RANGE_LENGTH_VALIDATOR]
})
export class RangeLengthValidator implements Validator, OnInit, OnChanges {
  @Input() rangeLength: [number] | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    this.validator = rangeLength(this.rangeLength!);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'rangeLength') {
        this.validator = rangeLength(changes[key].currentValue);
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
