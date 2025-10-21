import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildTest } from './child-test';

describe('ChildTest', () => {
  let component: ChildTest;
  let fixture: ComponentFixture<ChildTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
