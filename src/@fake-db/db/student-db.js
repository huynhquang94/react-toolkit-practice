import mock from '../mock';

const studentsDB = {
  results: [
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39f',
      name: 'QuangPH2',
      gender: 'Nam',
      mark: 8,
      city: 'Quang Nam',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39e',
      name: 'QuangPN1',
      gender: 'Nam',
      mark: 9,
      city: 'Da Nang',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39g',
      name: 'Tam',
      gender: 'Nu',
      mark: 8,
      city: 'Quang Nam',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39h',
      name: 'Doan',
      gender: 'Nam',
      mark: 7,
      city: 'Hue',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39k',
      name: 'Duy',
      gender: 'Nam',
      mark: 6,
      city: 'Ha Noi',
    },
    {
      id: '8754ebdc-ef44-4098-9cf7-89d25088d39j',
      name: 'Ly',
      gender: 'Nu',
      mark: 8,
      city: 'Quang Binh',
    },
  ]
};

mock.onGet('/api/students').reply(() => {
  return [200, studentsDB];
});
