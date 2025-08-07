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
          <ul>
            <li>Se descontarán los Libris correspondientes.</li>
            <li>Se eliminarán los libros ofrecidos y recibidos.</li>
          </ul>
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
