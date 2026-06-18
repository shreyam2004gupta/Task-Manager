
import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

const CustomPieCharts = ({ data, colors = [] }) => {
  const safeData = Array.isArray(data) ? data : []

  return (
    <ResponsiveContainer width={'100%'} height={325}>
      <PieChart>
        <Pie
          data={safeData}
          cx={"50%"}
          cy={"50%"}
          labelLine={false}
          outerRadius={130}
          innerRadius={100}
          fill="#8884d8"
          dataKey="count"
          nameKey={"status"}
        >
          {safeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend/>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CustomPieCharts
