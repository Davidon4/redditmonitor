import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts';
  import { formatNumber } from '@/lib/utils';

  interface TopPost {
    title: string;
    score: number;
    comments: number;
    created: number;
    selftext?: string;
  }
  
  interface ChartProps {
    topPosts: TopPost[];
  }

  export default function Chart({ topPosts }: ChartProps) {

    // Transform the data for the chart
    const chartData = topPosts.map(post => ({
      ...post,
      displayTitle: typeof post.title === 'string' 
        ? post.title.substring(0, 20) + (post.title.length > 20 ? '...' : '')
        : String(post.title), // Convert to string if it's not already
      score: post.score,
      comments: post.comments,
    }));
    return (
      <div className="w-full h-[400px] sm:h-[450px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 25, left: 15, bottom: 70 }}
          >
            <CartesianGrid 
              strokeDasharray="0 0"
              horizontal={true}
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="displayTitle"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ 
                fontSize: 11,
                fill: '#4B5563',
                fontWeight: 500
              }}
              tickMargin={25}
            />
          <YAxis 
            yAxisId="left"
            orientation="left"
            domain={[0, 'auto']}
            tick={{
              fontSize: 11,
              fill: '#4B5563'
            }}
            tickFormatter={formatNumber}
            width={50}
            label={{
              value: 'Score',
              angle: -90,
              position: 'insideLeft',
              offset: 0,
              style: {
                fontSize: 12,
                fill: '#8B5CF6',
                fontWeight: 500
              }
            }}
          />
           <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[0, 'auto']}
            tick={{
              fontSize: 11,
              fill: '#4B5563'
            }}
            tickFormatter={formatNumber}
            width={50}
            label={{
              value: 'Comments',
              angle: 90,
              position: 'insideRight',
              offset: 0,
              style: {
                fontSize: 12,
                fill: '#10B981',
                fontWeight: 500
              }
            }}
          />
    <Tooltip 
  content={({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
      // Find the original post data to show full title in tooltip
      const post = chartData.find(p => p.title && label && p.title.startsWith(label.replace(/\.{3}$/, '')));
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 max-w-[300px]">
            <p className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
                {post?.title}
            </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"/>
              <p className="text-sm text-gray-600">
                Score: <span className="font-medium text-purple-600">{payload[0].value}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"/>
              <p className="text-sm text-gray-600">
                Comments: <span className="font-medium text-emerald-600">{payload[1].value}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
            }}
          />
            <Legend wrapperStyle={{paddingTop: '20px', fontSize: '13px'}}/>
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              name="Score"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#scoreGradient)"
              dot={{
                r: 4,
                fill: '#8B5CF6',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                stroke: '#8B5CF6',
                strokeWidth: 2,
                fill: '#EDE9FE'
              }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="comments"
              name="Comments"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#commentsGradient)"
              dot={{
                r: 4,
                fill: '#10B981',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                stroke: '#10B981',
                strokeWidth: 2,
                fill: '#ECFDF5'
              }}
            />
          </LineChart>
          </ResponsiveContainer>
      </div>
    );
  }