import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view-component/view-component';
import { ChildTest } from './child-test/child-test';
import { ChildTest2 } from './child-test2/child-test2';

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
    children:[
      {
        path:'first-child',
        component: ChildTest
      },
      {
        path: 'second-child',
        component: ChildTest2
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TestRoutingModule { }
