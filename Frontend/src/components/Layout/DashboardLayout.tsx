import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Header 
        style={{ 
          background: '#fff', 
          padding: '0 24px',
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Title level={3} style={{ margin: 0, lineHeight: '64px' }}>Admin Dashboard</Title>
      </Header>
      <Content 
        style={{ 
          marginTop: 64,
          padding: '24px',
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)',
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto'
        }}
      >
        <div style={{ 
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardLayout; 