import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AllBenchmarkConfigsComponent } from './pages/all-benchmark-configs/all-benchmark-configs.component';
import { FormsModule } from '@angular/forms';
import { PublicGuard } from './guards/public-guard';
import { PrivateGuard } from './guards/private-guard';

@NgModule({
  declarations: [AppComponent, LoginComponent, AllBenchmarkConfigsComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [PublicGuard, PrivateGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
