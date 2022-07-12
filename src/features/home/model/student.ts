import { StudentResponse } from '../response/student';

export default class Student {
  id: string;
  name: string;
  gender: string;
  mark: number;
  city: string;

  constructor(user: StudentResponse) {
    this.id = user.id;
    this.name = user.name;
    this.gender = user.gender;
    this.mark = user.mark;
    this.city = user.city;
  }
}
