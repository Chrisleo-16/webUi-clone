// components/Chart.tsx
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts (disable SSR)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
  options: ApexOptions;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'candlestick' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  width?: string | number;
  height?: string | number;
}

const ChartComponent: React.FC<ChartProps> = ({ options, series, type, width = '100%', height = 350 }) => {
  return (
    <div>
      <Chart options={options} series={series} type={type} width={width} height={height} />
    </div>
  );
};

export default ChartComponent;