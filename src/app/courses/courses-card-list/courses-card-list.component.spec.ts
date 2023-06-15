import {DebugElement} from "@angular/core";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

import {setupCourses} from "../common/setup-test-data";
import {CoursesModule} from "../courses.module";
import {CoursesCardListComponent} from './courses-card-list.component';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed
      .configureTestingModule({imports: [CoursesModule]})
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).withContext('Could not find cards').toBeTruthy();
    expect(cards.length).withContext('Unexpected number of courses').toBe(12);
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0];
    const card = el.query(By.css('.course-card:first-child'));
    const title = card.query(By.css('.mat-mdc-card-header'));
    const image = card.query(By.css('.mat-mdc-card-image'));
    expect(card).withContext('Could not find a card of course').toBeTruthy();
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});
