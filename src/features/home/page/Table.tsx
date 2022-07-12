import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import { Table as MuiTable, TableContainer } from '@mui/material';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { getStudents } from '../StudentSlice';

function Table() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHeader />
          <TableBody />
        </MuiTable>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}

export default Table;
