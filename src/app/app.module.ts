import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AllBenchmarkConfigsComponent } from './pages/all-benchmark-configs/all-benchmark-configs.component';
import { FormsModule } from '@angular/forms';
import { PublicGuard } from './guards/public-guard';
import { PrivateGuard } from './guards/private-guard';
import { NewBenchmarkConfigComponent } from './pages/new-benchmark-config/new-benchmark-config.component';
import { EditBenchmarkConfigComponent } from './pages/edit-benchmark-config/edit-benchmark-config.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, AllBenchmarkConfigsComponent, NewBenchmarkConfigComponent, EditBenchmarkConfigComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [PublicGuard, PrivateGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
