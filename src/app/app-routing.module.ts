import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { AllBenchmarkConfigsComponent } from './pages/all-benchmark-configs/all-benchmark-configs.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'app/configs/all', pathMatch: 'full' },
  {
    path: 'public',
    canActivateChild: [PublicGuard],
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: 'app',
    canActivateChild: [PrivateGuard],
    children: [
      { path: 'configs/all', component: AllBenchmarkConfigsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
