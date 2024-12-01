import { useDispatch, useSelector } from 'react-redux';
import { editData, getCrypto } from '../reduxTools/CryptoSlice';
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { Button } from '@mui/material';
import EditingModal from './EditingModal';

// Comparator functions
function descendingComparator(a, b, orderBy) {
  if (['rank', 'marketCapUsd', 'maxSupply', 'supply', 'priceUsd', 'volumeUsd24Hr'].includes(orderBy)) {
    return Number(b[orderBy]) - Number(a[orderBy]);
  }
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Table header definitions
const headCells = [
  { id: 'rank', numeric: false, disablePadding: false, label: 'Rank' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'marketCapUsd', numeric: true, disablePadding: false, label: 'MarketCapUsd' },
  { id: 'maxSupply', numeric: true, disablePadding: false, label: 'MaxSupply' },
  { id: 'supply', numeric: true, disablePadding: false, label: 'Supply' },
  { id: 'priceUsd', numeric: true, disablePadding: false, label: 'Price (USD)' },
  { id: 'volumeUsd24Hr', numeric: true, disablePadding: false, label: 'Volume (24Hr)' },
];

// Enhanced table head component
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// Main component
const Home = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('rank');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState(null);


 

  const dispatch = useDispatch();
  const data = useSelector((state) => state.crypto);
  
  const rows = data.cryptoData || [];


  const handleSave = (editedData) => {
    const updatedArr = rows.map((currency) => {
      console.log(editedData.id);
      
      if (currency.id === editedData.id){
        return { ...currency, ...editedData }; 
      }
      return currency; 
    });
    dispatch(editData(updatedArr))
  };


  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getCrypto());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => setDense(event.target.checked);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  if (loading) {
    return <div style={{ height: '100vh' }}>Loading...</div>;
  }

  const handleRefresh = () => {
    dispatch(getCrypto());
  };

  return (
    <Box>
      <Box p={2}>
        <Button variant='contained' color='success' onClick={handleRefresh} sx={{ mx: 3 }}>
          Refresh
        </Button>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} />
              <TableBody>
                {visibleRows.map((row, index) => (
                  <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }} onClick={()=>{setSelectedCurrency(row); setModalOpen(true)}}>
                    <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row">
                      {row.rank}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">{row.marketCapUsd ? parseFloat(row.marketCapUsd).toFixed(2) : 'N/A'}</TableCell>
                    <TableCell align="right">{row.maxSupply ? parseFloat(row.maxSupply).toFixed(2) : 'N/A'}</TableCell>
                    <TableCell align="right">{row.supply ? parseFloat(row.supply).toFixed(2) : 'N/A'}</TableCell>
                    <TableCell align="right">{row.priceUsd ? parseFloat(row.priceUsd).toFixed(2) : 'N/A'}</TableCell>
                    <TableCell align="right">{row.volumeUsd24Hr ? parseFloat(row.volumeUsd24Hr).toFixed(2) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {selectedCurrency && <EditingModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        currencyData={selectedCurrency} 
        onSave={handleSave} 
      />}
    </Box>
  );
};

export default Home;
