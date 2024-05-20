import { Directive, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { uuid } from './validator';

const UUID_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UUIDValidator),
  multi: true
};

@Directive({
  selector: '[uuid][formControlName],[uuid][formControl],[uuid][ngModel]',
  providers: [UUID_VALIDATOR]
})
export class UUIDValidator implements Validator, OnInit, OnChanges {
  @Input() uuid: string | undefined;

  private validator: ValidatorFn | undefined;
  private onChange!: () => void;

  ngOnInit() {
    this.validator = uuid(this.uuid!);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'uuid') {
        this.validator = uuid(changes[key].currentValue);
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
