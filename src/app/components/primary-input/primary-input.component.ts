import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';

type InputTypes = "text" | "email" | "password" | "date" | "number";

@Component({
    selector: 'app-primary-input',
    imports: [ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PrimaryInputsComponent),
            multi: true
        }
    ],
    templateUrl: './primary-input.component.html',
    styleUrls: ['./primary-input.component.scss']
})
export class PrimaryInputsComponent implements ControlValueAccessor {
  @Input() type: InputTypes = "text";
  @Input() inputName: string = "";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() readonly: boolean = false;

  value: string = '';
  isDisabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
