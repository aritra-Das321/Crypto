import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const EditingModal = ({ open, onClose, currencyData, onSave }) => {
  const [formData, setFormData] = React.useState(currencyData);

  React.useEffect(() => {
    setFormData(currencyData);
  }, [currencyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Currency</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="rank"
          label="Rank"
          type="number"
          fullWidth
          variant="standard"
          value={formData.rank || ''}
          onChange={handleChange}
        />
        <TextField    
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="marketCapUsd"
          label="Market Cap USD"
          type="number"
          fullWidth
          variant="standard"
          value={formData.marketCapUsd || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="maxSupply"
          label="Max Supply"
          type="number"
          fullWidth
          variant="standard"
          value={formData.maxSupply || ''}
          onChange={handleChange}
        />
         <TextField
          margin="dense"
          name="supply"
          label="Supply"
          type="number"
          fullWidth
          variant="standard"
          value={formData.supply || ''}
          onChange={handleChange}
        />
         <TextField
          margin="dense"
          name="priceUsd"
          label="Price(USD)"
          type="number"
          fullWidth
          variant="standard"
          value={formData.priceUsd || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="volumeUsd24Hr"
          label="Volume"
          type="number"
          fullWidth
          variant="standard"
          value={formData.volumeUsd24Hr || ''}
          onChange={handleChange}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditingModal;
