import Modal from './Modal';
import Button from './Button';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'info' }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="confirm-modal-content">
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={type === 'danger' ? 'danger' : 'primary'}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
