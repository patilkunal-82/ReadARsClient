import { Routes, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { BooklistComponent } from '../booklist/booklist.component';
import { BookdetailComponent } from '../bookdetail/bookdetail.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { MybooksComponent } from '../mybooks/mybooks.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'aboutus', component: AboutComponent },
  { path: 'booklist', component: BooklistComponent, canActivate: [AuthGuard] },
  { path: 'mybooks', component: MybooksComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'contactus',     component: ContactComponent },
  { path: 'bookdetail/:id', component: BookdetailComponent }

];
