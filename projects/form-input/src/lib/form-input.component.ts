import { Component, Input, Output, OnInit } from '@angular/core';
import { IInputs } from './form-input.handler';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'lib-formInput',
  template: `
    <p>
      form-input works!
    </p>
  `,
  styles: []
})
export class FormInputComponent implements OnInit{
  form = new FormGroup({
  })
  @Input('inputs') inputs: IInputs[];
  ngOnInit(): void {
    for (let input of this.inputs){
      this.form.addControl(input.name, new FormControl('', null));
    }
  }

  onSubmit(){
    console.log(this.form.value);
  }

}