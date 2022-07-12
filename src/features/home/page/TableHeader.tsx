import { TableCell, TableRow, TableHead } from "@mui/material";

import tableLabel from '../constant/TableLabel';

function TableHeader() { 
  return (
    <TableHead>
      <TableRow>
        {tableLabel.map((column, index) => (
          <TableCell key={index}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;
