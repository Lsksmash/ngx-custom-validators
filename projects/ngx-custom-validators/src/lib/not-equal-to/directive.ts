import { Directive, Input, forwardRef, OnInit } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

import { notEqualTo } from './validator';

const NOT_EQUAL_TO_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NotEqualToValidator),
  multi: true
};

@Directive({
  selector: '[notEqualTo][formControlName],[notEqualTo][formControl],[notEqualTo][ngModel]',
  providers: [NOT_EQUAL_TO_VALIDATOR]
})
export class NotEqualToValidator implements Validator, OnInit {
  @Input() notEqualTo: FormControl | undefined;

  private validator: ValidatorFn | undefined;

  ngOnInit() {
    this.validator = notEqualTo(this.notEqualTo!);
  }

  validate(c: AbstractControl): {[key: string]: any} |null{
    return this.validator ? this.validator(c) : null;
  }
}
