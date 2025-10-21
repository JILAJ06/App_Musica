import { NgModule } from '@angular/core';
import { ViewComponent } from './view-component/view-component';
import { ChildTest } from './child-test/child-test';
import { ChildTest2 } from './child-test2/child-test2';
import { StaticChild } from './static-child/static-child';
import { TestRoutingModule } from './test-routing-module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ViewComponent,
    ChildTest,
    ChildTest2,
    StaticChild
  ],
  imports: [
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
