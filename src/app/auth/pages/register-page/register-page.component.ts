import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private _fb = inject( FormBuilder );
  private _authService = inject( AuthService );
  private _router = inject( Router );

  myForm: FormGroup = this._fb.group({

    name: [ "", [ Validators.required ]],
    email: [ "", [ Validators.required, Validators.email ]],
    password: [ "", [ Validators.required, Validators.minLength( 6 )]],
  });

  register() {

    const { name, email, password } = this.myForm.value;

    this._authService.register( name, email, password ).subscribe({

      next: () => this._router.navigateByUrl("/dashboard"),
      error: ( message) => {
        // console.log({ loginError: message });
        Swal.fire( "Error", message, "error" )
      }
    });
  };

}
