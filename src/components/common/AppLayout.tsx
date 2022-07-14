import { Box, makeStyles } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Table from '../../features/home/page/Table';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },

  header: {
    gridArea: 'header',
    marginBottom: '30px',
  },
  sidebar: {
    gridArea: 'sidebar',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    gridArea: 'main',
    backgroundColor: theme.palette.background.paper,
    padding: '0px 100px',
  },
}));

export function AppLayout() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Header />
      </Box>

      <Box className={classes.main}>
        <Routes>
          <Route path="/" element={<Table />} />
        </Routes>
      </Box>
    </Box>
  );
}
