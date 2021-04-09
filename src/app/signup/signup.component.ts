import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { AuthService } from '../services/auth.service';
import { HttpModule} from "@angular/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  newuser = {firstname: '', lastname:'', username: '', password: '', email: ''};
  errMess: string;

  constructor(public dialogRef: MatDialogRef<SignupComponent>,
    private authService: AuthService) { }

  ngOnInit() {
  }


  onSubmit() {
    console.log('NewUser: ', this.newuser);
    this.authService.signUp(this.newuser)
      .subscribe(res => {
        if (res.success) {
          this.dialogRef.close(res.success);
        } else {
          console.log(res);
        }
      },
      error => {
      console.log(error);
      this.errMess = error;
      });
  }

}
