import React, { useState } from 'react';
import { Table, Button, message, Dropdown, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, FileOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { User, UserFormData } from '../../types/user';
import UserModal from './UserModal';
import DeleteConfirmation from './DeleteConfirmation';
import UserMetricsChart from './UserMetricsChart';
import { UserService } from '../../services/userService';
import { generateUserReport } from '../../services/reportService';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onDataUpdate: () => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDataUpdate }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const handleAddUser = async (userData: UserFormData) => {
    try {
      await UserService.createUser(userData);
      await onDataUpdate();
      message.success('User added successfully');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to add user');
    }
  };

  const handleEditUser = async (userData: UserFormData) => {
    try {
      if (!selectedUser) return;
      await UserService.updateUser(selectedUser.id.toString(), userData);
      await onDataUpdate();
      message.success('User updated successfully');
      setIsModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return;
      await UserService.deleteUser(selectedUser.id.toString());
      await onDataUpdate();
      message.success('User deleted successfully');
      setIsDeleteModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const generateReport = async (user: User) => {
    try {
      await generateUserReport(user);
      await onDataUpdate();
      message.success(`Report generated for ${user.name}`);
    } catch (error) {
      message.error('Failed to generate report');
    }
  };

  const getDropdownItems = (record: User): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => {
        setSelectedUser(record);
        setIsModalVisible(true);
      },
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => {
        setSelectedUser(record);
        setIsDeleteModalVisible(true);
      },
    },
    {
      key: 'report',
      icon: <FileOutlined />,
      label: 'Generate Report',
      onClick: () => generateReport(record),
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: any, record: User) => (
        <Dropdown menu={{ items: getDropdownItems(record) }} trigger={['click']}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <div style={{ 
        marginBottom: 16,
        width: '100%'
      }}>
        <Button 
          type="primary" 
          onClick={() => {
            setSelectedUser(null);
            setIsModalVisible(true);
          }}
        >
          Add User
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ 
              padding: '24px', 
              background: '#fff',
              width: '100%'
            }}>
              <UserMetricsChart user={record} />
            </div>
          ),
          expandIcon: ({ expanded, onExpand, record }) => (
            <Button 
              type="text" 
              icon={<PlusOutlined rotate={expanded ? 45 : 0} />} 
              onClick={(e) => {
                e.stopPropagation();
                onExpand(record, e);
              }}
              style={{ 
                transition: 'all 0.3s',
                marginRight: 8
              }}
            />
          ),
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(
              expanded 
                ? [...expandedRowKeys, Number(record.id)]
                : expandedRowKeys.filter(key => key !== Number(record.id))
            );
          }
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: users.length,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `Total ${total} users`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          onShowSizeChange: (size) => {
            setCurrentPage(1);
            setPageSize(size);
          }
        }}
        style={{
          background: '#fff',
          borderRadius: 8,
          width: '100%'
        }}
        scroll={{ x: '100%' }}
      />
      
      <UserModal
        visible={isModalVisible}
        user={selectedUser}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedUser(null);
        }}
        onSave={(userData) => {
          if (selectedUser) {
            handleEditUser(userData);
          } else {
            handleAddUser(userData);
          }
        }}
      />

      <DeleteConfirmation
        visible={isDeleteModalVisible}
        user={selectedUser}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserTable; 