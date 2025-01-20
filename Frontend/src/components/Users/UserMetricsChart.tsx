import React from 'react';
import { Card, Row, Col, Statistic, Progress, theme } from 'antd';
import { LoginOutlined, DownloadOutlined } from '@ant-design/icons';
import { User } from '../../types/user';
import ActivityChart from '../Charts/ActivityChart';

interface UserMetricsChartProps {
  user: User;
}

const UserMetricsChart: React.FC<UserMetricsChartProps> = ({ user }) => {
  const { token } = theme.useToken();

  // Calculate percentages for progress bars
  const maxValue = 100; // Maximum reference value
  const loginPercentage = Math.min((user.login_count / maxValue) * 100, 100);
  const downloadPercentage = Math.min((user.pdf_download_count / maxValue) * 100, 100);

  // Prepare data for the chart
  const chartData = [
    {
      name: 'Logins',
      value: user.login_count,
      type: 'LOGIN'
    },
    {
      name: 'Downloads',
      value: user.pdf_download_count,
      type: 'DOWNLOAD'
    }
  ];

  return (
    <Card 
      bordered={false}
      style={{ 
        background: token.colorBgContainer,
        borderRadius: 8,
      }}
    >
      <Row gutter={24}>
        <Col span={14}>
          <ActivityChart 
            data={chartData} 
            height={200}
            title={`Activity Summary - ${user.name}`}
          />
        </Col>
        <Col span={10}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card 
                size="small" 
                style={{ 
                  background: token.colorPrimaryBg,
                  borderRadius: 8,
                }}
              >
                <Statistic
                  title={<span style={{ color: token.colorPrimary }}>Total Logins</span>}
                  value={user.login_count}
                  prefix={<LoginOutlined style={{ color: token.colorPrimary }} />}
                  valueStyle={{ color: token.colorPrimary }}
                />
                <Progress 
                  percent={loginPercentage} 
                  showInfo={false}
                  strokeColor={token.colorPrimary}
                  trailColor={token.colorPrimaryBorder}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card 
                size="small"
                style={{ 
                  background: token.colorSuccessBg,
                  borderRadius: 8,
                }}
              >
                <Statistic
                  title={<span style={{ color: token.colorSuccess }}>Total Downloads</span>}
                  value={user.pdf_download_count}
                  prefix={<DownloadOutlined style={{ color: token.colorSuccess }} />}
                  valueStyle={{ color: token.colorSuccess }}
                />
                <Progress 
                  percent={downloadPercentage}
                  showInfo={false}
                  strokeColor={token.colorSuccess}
                  trailColor={token.colorSuccessBorder}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default UserMetricsChart; 