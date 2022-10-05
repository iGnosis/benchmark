import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBenchmarkConfigsComponent } from './pages/all-benchmark-configs/all-benchmark-configs.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'all_configs',
    component: AllBenchmarkConfigsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
