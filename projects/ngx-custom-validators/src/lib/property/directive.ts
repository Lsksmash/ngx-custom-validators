import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { property } from './validator';

const PROPERTY_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PropertyValidator),
  multi: true
};

@Directive({
  selector: '[property][formControlName],[property][formControl],[property][ngModel]',
  providers: [PROPERTY_VALIDATOR]
})
export class PropertyValidator implements Validator, OnInit, OnChanges {
  @Input() property: string | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    this.validator = property(this.property!);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'property') {
        this.validator = property(changes[key].currentValue);
        if (this.onChange) {
          this.onChange();
        }
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any} |null {
    if (this.validator) {
      return this.validator(c);
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
