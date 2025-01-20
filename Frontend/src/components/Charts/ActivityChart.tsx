import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import { theme } from 'antd'

interface ActivityChartProps {
  data: Array<{
    name: string
    type: string
    value: number
  }>
  title?: string
  height?: number
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, title = 'Activity Overview', height = 200 }: ActivityChartProps) => {
  const { token } = theme.useToken()

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height:300,
      backgroundColor: 'transparent',
    },
    title: {
      text: title,
      style: {
        fontSize: '14px'
      }
    },
    xAxis: {
      categories: ['Activity Metrics'],
      crosshair: true,
    },
    yAxis: {
      title: {
        text: 'Count'
      },
      min: 0
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        grouping: true,
      }
    },
    series: [
      {
        name: 'Logins',
        type: 'column',
        data: [data.find(d => d.type === 'LOGIN')?.value || 0],
        color: token.colorPrimary,
      },
      {
        name: 'Downloads',
        type: 'column',
        data: [data.find(d => d.type === 'DOWNLOAD')?.value || 0],
        color: token.colorSuccess,
      }
    ],
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        const points = (this as any).points || [];
        
        return `
          <div style="padding: 8px">
            <b>${(this as any).x}</b><br/>
            ${points.map((point: any) => 
              `${point.series.name}: <b>${point.y}</b>`
            ).join('<br/>')}
          </div>
        `;
      }
    }
  }

  return (
    <div style={{ 
      background: token.colorBgContainer,
      borderRadius: 8,
      padding: 16
    }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default ActivityChart 
