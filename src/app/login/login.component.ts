import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  user = {username: '', password: '', remember: false};
  errMess: string;


  constructor(public dialogRef: MatDialogRef<LoginComponent>, public dialog: MatDialog,
    private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('User: ', this.user);
    this.authService.logIn(this.user)
      .subscribe(res => {
        if (res.success) {
          this.dialogRef.close(res.success);
          this.router.navigateByUrl('/booklist');
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
        this.errMess = error;
      });

  }

  openSignupForm() {

    this.closeLoginForm();
    console.log("inside sign up form via login component")
    const signupRef = this.dialog.open(SignupComponent, {width: '500px', height: '450px'});

    signupRef.afterClosed()
      .subscribe(result => {
        console.log(result);
      });
  }

  closeLoginForm() {
    this.dialogRef.close();
  }



}
