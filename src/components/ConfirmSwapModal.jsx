import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

const ConfirmSwapModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar intercambio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que querés confirmar este intercambio? Una vez confirmado:
          
        <p>- Se descontarán los Libris correspondientes.</p>
        <p>- Se eliminarán los libros ofrecidos y recibidos.</p>

          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmSwapModal
