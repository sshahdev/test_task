import React from 'react';
import { Modal } from 'antd';
import { User } from '../../types/user';

interface DeleteConfirmationProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  visible,
  user,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      title="Delete User"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete user {user?.name}?</p>
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

export default DeleteConfirmation; 