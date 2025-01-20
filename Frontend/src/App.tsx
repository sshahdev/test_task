import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, message } from 'antd'
import { UserOutlined, DownloadOutlined, LoginOutlined } from '@ant-design/icons'
import DashboardLayout from './components/Layout/DashboardLayout'
import UserTable from './components/Users/UserTable'
import { UserService } from './services/userService'
import { User } from './types/user'

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalLogins: 0,
    totalDownloads: 0
  })

  const fetchUsers = async () => {
    console.log('Fetching users...')
    try {
      const data = await UserService.getAllUsers()
      setUsers(data)
      setMetrics({
        totalUsers: data.length,
        totalLogins: data.reduce((sum, user) => sum + user.login_count, 0),
        totalDownloads: data.reduce((sum, user) => sum + user.pdf_download_count, 0)
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      message.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('App component mounted')
    fetchUsers()
  }, [])

  try {
    return (
      <DashboardLayout>
        <div style={{ padding: '24px' }}>
          {/* Analytics Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={metrics.totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Logins"
                  value={metrics.totalLogins}
                  prefix={<LoginOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Downloads"
                  value={metrics.totalDownloads}
                  prefix={<DownloadOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* User Table */}
          <Card style={{ flex: 1 }}>
            <UserTable 
              users={users} 
              loading={loading}
              onDataUpdate={fetchUsers} 
            />
          </Card>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Error rendering App:', error)
    return <div>Error loading dashboard</div>
  }
}

export default App
