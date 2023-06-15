import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse, HttpRequest} from "@angular/common/http";

import {COURSES, findLessonsForCourse} from "../../../../server/db-data";
import {CoursesService} from "./courses.service";
import {Course} from "../model/course";
import {Lesson} from "../model/lesson";

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should get all courses', () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).withContext('no courses returned').toBeTruthy();
      expect(courses.length).withContext('incorrect number of courses').toBe(12);
      const course = courses.find((course: Course) => course.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({payload: Object.values(COURSES)});
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12).subscribe((course: Course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {titles: {description: 'Another Name'}};
    coursesService.saveCourse(12, changes)
      .subscribe((course: Course) => {
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {titles: {description: 'Another Name'}};
    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons: Lesson[]) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne((req: HttpRequest<Lesson[]>) => req.url === '/api/lessons');
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');
    req.flush({payload: findLessonsForCourse(12).slice(0, 3)});
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
