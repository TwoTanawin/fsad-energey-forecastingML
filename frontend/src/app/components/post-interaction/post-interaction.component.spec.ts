import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInteractionComponent } from './post-interaction.component';

describe('PostInteractionComponent', () => {
  let component: PostInteractionComponent;
  let fixture: ComponentFixture<PostInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostInteractionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
