import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { notIncludedIn } from './validator';

const NOT_INCLUDED_IN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NotIncludedInValidator),
  multi: true
};

@Directive({
  selector: '[notIncludedIn][formControlName],[notIncludedIn][formControl],[notIncludedIn][ngModel]',
  providers: [NOT_INCLUDED_IN_VALIDATOR]
})
export class NotIncludedInValidator implements Validator, OnInit, OnChanges {
  @Input() notIncludedIn: Array<any> | undefined;

  private validator: ValidatorFn | undefined;
  private onChange: (() => void) | undefined;

  ngOnInit() {
    this.validator = notIncludedIn(this.notIncludedIn!);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'notIncludedIn') {
        this.validator = notIncludedIn(changes[key].currentValue);
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
