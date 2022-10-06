import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { AllBenchmarkConfigsComponent } from './pages/all-benchmark-configs/all-benchmark-configs.component';
import { EditBenchmarkConfigComponent } from './pages/edit-benchmark-config/edit-benchmark-config.component';
import { LoginComponent } from './pages/login/login.component';
import { NewBenchmarkConfigComponent } from './pages/new-benchmark-config/new-benchmark-config.component';

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
      { path: 'configs/new', component: NewBenchmarkConfigComponent },
      { path: 'configs/edit/:id', component: EditBenchmarkConfigComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
