import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { includedIn } from './validator';

const INCLUDED_IN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IncludedInValidator),
  multi: true
};

@Directive({
  selector: '[includedIn][formControlName],[includedIn][formControl],[includedIn][ngModel]',
  providers: [INCLUDED_IN_VALIDATOR]
})
export class IncludedInValidator implements Validator, OnInit, OnChanges {
  @Input() includedIn: Array<any> | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    if (this.includedIn) {
      this.validator = includedIn(this.includedIn);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'includedIn') {
        if (changes[key].currentValue) {
          this.validator = includedIn(changes[key].currentValue);
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
