import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { User, UserFormData } from '../../types/user';

interface UserModalProps {
  visible: boolean;
  user?: User | null;
  onCancel: () => void;
  onSave: (data: UserFormData) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  user,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(user);

  React.useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      form.resetFields();
    }
  }, [visible, user, form]);

  return (
    <Modal
      title={isEdit ? 'Edit User' : 'Add User'}
      open={visible}
      onOk={() => form.validateFields().then(onSave)}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role' }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal; 