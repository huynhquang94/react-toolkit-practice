import { StudentResponse } from '../response/student';

export default class Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  mark: number;
  city: string;

  constructor(student: StudentResponse) {
    this.id = student.id;
    this.name = student.name;
    this.gender = student.gender;
    this.mark = student.mark;
    this.city = student.city;
  }
}
