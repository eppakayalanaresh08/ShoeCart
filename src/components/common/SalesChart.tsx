import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../../types';

type SalesPeriod = 'week' | 'month' | 'year';

interface SalesChartProps {
  orders: Order[];
}

interface ChartPoint {
  label: string;
  value: number;
  isCurrent: boolean;
}

const PERIOD_OPTIONS: Array<{ key: SalesPeriod; label: string }> = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const parseOrderDate = (dateLabel: string) => {
  const normalized = dateLabel.replace(' at ', ' ');
  const parsedDate = new Date(normalized);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
};

const startOfDay = (value: Date) => {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (value: Date) => {
  const next = new Date(value);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (value: Date, amount: number) => {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const getWeekRangeLabel = (endDate: Date) => {
  const startDate = addDays(endDate, -6);
  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;
};

const getMonthRangeLabel = (referenceDate: Date) =>
  referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

const getYearRangeLabel = (referenceDate: Date) => `${referenceDate.getFullYear()}`;

const getWeekPoints = (orders: Array<Order & { parsedDate: Date }>, referenceDate: Date) => {
  const lastDay = startOfDay(referenceDate);
  const firstDay = addDays(lastDay, -6);

  const points: ChartPoint[] = Array.from({ length: 7 }, (_, index) => {
    const pointDate = addDays(firstDay, index);
    const total = orders.reduce((sum, order) => {
      if (!isSameDay(order.parsedDate, pointDate) || order.status === 'Cancelled') {
        return sum;
      }

      return sum + order.total;
    }, 0);

    return {
      label: pointDate.toLocaleDateString('en-US', { weekday: 'short' }),
      value: total,
      isCurrent: isSameDay(pointDate, lastDay),
    };
  });

  return {
    points,
    label: getWeekRangeLabel(lastDay),
    startDate: firstDay,
    endDate: endOfDay(lastDay),
  };
};

const getMonthPoints = (orders: Array<Order & { parsedDate: Date }>, referenceDate: Date) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const bucketCount = Math.ceil(daysInMonth / 7);

  const points: ChartPoint[] = Array.from({ length: bucketCount }, (_, index) => {
    const startDay = index * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);
    const total = orders.reduce((sum, order) => {
      const orderDate = order.parsedDate;
      const sameMonth =
        orderDate.getFullYear() === year && orderDate.getMonth() === month;
      const inBucket = orderDate.getDate() >= startDay && orderDate.getDate() <= endDay;

      if (!sameMonth || !inBucket || order.status === 'Cancelled') {
        return sum;
      }

      return sum + order.total;
    }, 0);

    return {
      label: `W${index + 1}`,
      value: total,
      isCurrent:
        referenceDate.getDate() >= startDay && referenceDate.getDate() <= endDay,
    };
  });

  return {
    points,
    label: getMonthRangeLabel(referenceDate),
    startDate: new Date(year, month, 1),
    endDate: endOfDay(new Date(year, month, daysInMonth)),
  };
};

const getYearPoints = (orders: Array<Order & { parsedDate: Date }>, referenceDate: Date) => {
  const year = referenceDate.getFullYear();

  const points: ChartPoint[] = Array.from({ length: 12 }, (_, index) => {
    const total = orders.reduce((sum, order) => {
      const orderDate = order.parsedDate;
      const sameYear = orderDate.getFullYear() === year;

      if (!sameYear || orderDate.getMonth() !== index || order.status === 'Cancelled') {
        return sum;
      }

      return sum + order.total;
    }, 0);

    return {
      label: new Date(year, index, 1).toLocaleDateString('en-US', { month: 'short' }),
      value: total,
      isCurrent: index === referenceDate.getMonth(),
    };
  });

  return {
    points,
    label: getYearRangeLabel(referenceDate),
    startDate: new Date(year, 0, 1),
    endDate: endOfDay(new Date(year, 11, 31)),
  };
};

export const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const [period, setPeriod] = useState<SalesPeriod>('month');

  const chartData = useMemo(() => {
    const parsedOrders = orders
      .map((order) => {
        const parsedDate = parseOrderDate(order.date);
        return parsedDate ? { ...order, parsedDate } : null;
      })
      .filter((order): order is Order & { parsedDate: Date } => order !== null)
      .sort((left, right) => right.parsedDate.getTime() - left.parsedDate.getTime());

    const referenceDate = parsedOrders[0]?.parsedDate ?? new Date();
    const currentPeriod =
      period === 'week'
        ? getWeekPoints(parsedOrders, referenceDate)
        : period === 'month'
          ? getMonthPoints(parsedOrders, referenceDate)
          : getYearPoints(parsedOrders, referenceDate);

    const periodOrders = parsedOrders.filter((order) => {
      return order.parsedDate >= currentPeriod.startDate && order.parsedDate <= currentPeriod.endDate;
    });

    const completedOrders = periodOrders.filter((order) => order.status !== 'Cancelled');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
    const peakPoint = currentPeriod.points.reduce<ChartPoint | null>((top, point) => {
      if (!top || point.value > top.value) {
        return point;
      }

      return top;
    }, null);

    return {
      ...currentPeriod,
      totalSales,
      completedOrders,
      averageOrderValue,
      peakPoint,
      highestValue: Math.max(...currentPeriod.points.map((point) => point.value), 0),
    };
  }, [orders, period]);

  return (
    <View style={styles.card}>
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.title}>Sales Overview</Text>
          <Text style={styles.subtitle}>{chartData.label}</Text>
        </View>
        <View style={styles.periodTabs}>
          {PERIOD_OPTIONS.map((option) => {
            const isActive = option.key === period;

            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.periodTab, isActive && styles.periodTabActive]}
                onPress={() => setPeriod(option.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.periodTabText, isActive && styles.periodTabTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Revenue</Text>
          <Text style={styles.summaryValue}>{currencyFormatter.format(chartData.totalSales)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Orders</Text>
          <Text style={styles.summaryValue}>{chartData.completedOrders.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg Order</Text>
          <Text style={styles.summaryValue}>
            {currencyFormatter.format(chartData.averageOrderValue)}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.plotArea}>
          <View style={styles.gridLineTop} />
          <View style={styles.gridLineMid} />
          <View style={styles.gridLineLow} />

          <View style={styles.barsRow}>
            {chartData.points.map((point) => {
              const heightPct =
                chartData.highestValue > 0
                  ? Math.max((point.value / chartData.highestValue) * 100, 8)
                  : 8;
              const showPeak = chartData.peakPoint?.label === point.label && point.value > 0;

              return (
                <View key={point.label} style={styles.barColumn}>
                  {showPeak && (
                    <View style={styles.tooltipBadge}>
                      <Text style={styles.tooltipText}>{currencyFormatter.format(point.value)}</Text>
                    </View>
                  )}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        point.isCurrent ? styles.barFillCurrent : styles.barFillDefault,
                        { height: `${heightPct}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{point.value > 0 ? `${Math.round(point.value)}` : '-'}</Text>
                  <Text style={styles.xLabel}>{point.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <Text style={styles.footerText}>
        {chartData.peakPoint && chartData.peakPoint.value > 0
          ? `Best ${period} point: ${chartData.peakPoint.label} with ${currencyFormatter.format(chartData.peakPoint.value)}.`
          : `No completed sales recorded for this ${period}.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerTopRow: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  periodTabActive: {
    backgroundColor: '#7C3AED',
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '800',
    marginTop: 6,
  },
  chartContainer: {
    height: 220,
  },
  plotArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  gridLineTop: {
    position: 'absolute',
    top: '0%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  gridLineMid: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  gridLineLow: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    paddingTop: 24,
    gap: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barTrack: {
    width: '100%',
    maxWidth: 28,
    height: 120,
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 10,
  },
  barFillDefault: {
    backgroundColor: '#C4B5FD',
  },
  barFillCurrent: {
    backgroundColor: '#7C3AED',
  },
  tooltipBadge: {
    position: 'absolute',
    top: -2,
    backgroundColor: '#5B2E8C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  barValue: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
    marginTop: 8,
  },
  xLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 4,
  },
  footerText: {
    marginTop: 16,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
