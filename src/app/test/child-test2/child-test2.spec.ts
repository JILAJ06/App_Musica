import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildTest2 } from './child-test2';

describe('ChildTest2', () => {
  let component: ChildTest2;
  let fixture: ComponentFixture<ChildTest2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildTest2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildTest2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
