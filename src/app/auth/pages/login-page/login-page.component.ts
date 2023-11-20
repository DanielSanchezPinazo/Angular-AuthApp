import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private _fb = inject( FormBuilder );
  private _authservice = inject( AuthService );
  private _router = inject( Router );

  public myForm: FormGroup = this._fb.group({

    email: ["dani@google.com", [ Validators.required, Validators.email ]],
    password: ["123456", [Validators.required, Validators.minLength(6) ]]
  });


  login() {

    console.log( this.myForm.value );

    const { email, password } = this.myForm.value;

    this._authservice.login( email, password ).subscribe({

      next: () => this._router.navigateByUrl("/dashboard"),
      error: ( message) => {
        // console.log({ loginError: error });
        Swal.fire( "Error", message, "error" )
      }
    });
  };
}
