import { TableCell, TableRow, TableBody as MuiTableBody } from "@mui/material";
import { useSelector } from 'react-redux';

import { selectStudents } from '../StudentSlice';
import tableLabel from '../constant/TableLabel';

function TableBody() {
  const students = useSelector(selectStudents);

  return (
     // TODO type any
    <MuiTableBody>
      {students.map((student: any) => (
          <TableRow key={student.id}>
            {tableLabel.map(({ field, type }, index) => (
              <TableCell key={index}>
                {type === 'string' && student[field]}
                {type === 'number' && student[field]}
              </TableCell>
            ))}
          </TableRow>
        ))}
    </MuiTableBody>
  );
}

export default TableBody;
