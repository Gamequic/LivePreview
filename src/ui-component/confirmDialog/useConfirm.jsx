// useConfirm.js
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const useConfirm = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [onConfirmCallback, setOnConfirmCallback] = useState(null);

    const openConfirmDialog = (callback, message) => {
        setOnConfirmCallback(() => callback);
        setMessage(message);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        handleClose();
    };

    const ConfirmDialogComponent = (
        <ConfirmDialog open={open} onClose={handleClose} onConfirm={handleConfirm} message={message} />
    );

    return { openConfirmDialog, ConfirmDialogComponent };
};

export default useConfirm;
