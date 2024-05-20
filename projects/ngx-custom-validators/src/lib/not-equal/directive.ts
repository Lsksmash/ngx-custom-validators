import { Directive, Input, forwardRef, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { notEqual } from './validator';

const NOT_EQUAL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NotEqualValidator),
  multi: true
};

@Directive({
  selector: '[notEqual][formControlName],[notEqual][formControl],[notEqual][ngModel]',
  providers: [NOT_EQUAL_VALIDATOR]
})
export class NotEqualValidator implements Validator, OnInit, OnChanges {
  @Input() notEqual: any;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    this.validator = notEqual(this.notEqual);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'notEqual') {
        this.validator = notEqual(changes[key].currentValue);
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
