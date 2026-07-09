import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Card from '../../components/ui/Card';

const RevenueChart = ({ data }) => {
    return (
        <Card className="revenue-chart-card">
            <div className="section-header">
                <h3>Revenue Trends (Last 30 Days)</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="_id"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${value}`, 'Revenue']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.1}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RevenueChart;
