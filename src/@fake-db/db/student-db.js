import mock from '../mock';

const studentsDB = {
  results: [
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39f',
      name: 'QuangPH2',
      gender: 'male',
      mark: 8,
      city: 'Quang Nam',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39e',
      name: 'QuangPN1',
      gender: 'male',
      mark: 9,
      city: 'Da Nang',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39g',
      name: 'Tam',
      gender: 'female',
      mark: 8,
      city: 'Quang Nam',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39h',
      name: 'Doan',
      gender: 'male',
      mark: 7,
      city: 'Hue',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39k',
      name: 'Duy',
      gender: 'male',
      mark: 6,
      city: 'Ha Noi',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39j',
      name: 'Ly',
      gender: 'female',
      mark: 8,
      city: 'Quang Binh',
    },
  ],
};

mock.onGet('/api/students').reply(() => {
  return [200, studentsDB];
});
