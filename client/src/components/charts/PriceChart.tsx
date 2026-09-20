import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi, SeriesMarker, Time } from 'lightweight-charts'
import { OHLCV } from '@/hooks/useMarketData'
import { Trade } from '@/lib/backtest/engine'

interface PriceChartProps {
  data: OHLCV[]
  trades?: Trade[]
  height?: number
}

export function PriceChart({ data, trades = [], height: _height }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Extract CSS variables for theme
    const rootStyle = getComputedStyle(document.documentElement)
    const textSecondary = rootStyle.getPropertyValue('--color-text-secondary').trim() || '#8A8A93'
    const borderStr = rootStyle.getPropertyValue('--color-border').trim() || '#2A2A35'

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textSecondary,
      },
      grid: {
        vertLines: { color: borderStr },
        horzLines: { color: borderStr },
      },
      autoSize: true,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      }
    })

    // @ts-ignore
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries

    return () => {
      chart.remove()
    }
  }, [])

  // Update data and markers
  useEffect(() => {
    if (!seriesRef.current || data.length === 0) return

    const formattedData = data.map(d => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))
    
    // Sort by time just in case
    formattedData.sort((a, b) => new Date(a.time as string).getTime() - new Date(b.time as string).getTime())

    seriesRef.current.setData(formattedData)

    if (trades.length > 0) {
      const markers: SeriesMarker<Time>[] = trades.map(trade => ({
        time: trade.time as Time,
        position: trade.direction === 'LONG' ? 'belowBar' : 'aboveBar',
        color: trade.direction === 'LONG' ? '#3b82f6' : '#a855f7',
        shape: trade.direction === 'LONG' ? 'arrowUp' : 'arrowDown',
        text: `${trade.type} ${trade.direction}`,
      }))

      // Sort markers by time
      markers.sort((a, b) => new Date(a.time as string).getTime() - new Date(b.time as string).getTime())
      // @ts-ignore
      seriesRef.current.setMarkers(markers)
    } else {
      // @ts-ignore
      seriesRef.current.setMarkers([])
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data, trades])

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)]"
    />
  )
}
