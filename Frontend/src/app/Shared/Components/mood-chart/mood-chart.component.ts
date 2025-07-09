import {
  Component,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { CommonModule } from '@angular/common';
import { AppText } from '../../../../assets/data/constants/texts';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-mood-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './mood-chart.component.html',
  styleUrls: ['./mood-chart.component.scss'],
})

export class MoodChartComponent implements AfterViewInit {
  diarySrv = inject(DiaryEntriesService);
  text = AppText;
  diaryEntries: UpdateEntryModel[] = [];

  errorMessage = '';
  isloading = true;

  dateLabels: string[] = [];
  moodValues: (number | null)[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  moodDescriptions = ['😊 Happy', '😄 Excited', '😌 Calm', '😢 Sad', '😡 Angry'];
  viewMode = 'daily';


  selectedViewMode: 'daily' | 'monthly' | 'yearly' = 'daily';

  onViewModeChange(mode: 'daily' | 'monthly' | 'yearly') {
    this.selectedViewMode = mode;
    this.viewMode = mode;
    this.processDiaryEntries(); // re-process based on view
    this.refreshChart();
  }

  moodToNumericMap: Record<string, number> = Object.fromEntries(
    this.moodDescriptions.map((mood, index) => [mood, index + 1])
  );

  valueToEmoji: Record<number, string> = Object.fromEntries(
    this.moodDescriptions.map((mood, index) => [index + 1, mood.split(' ')[0]])
  );

  moodColors: Record<number, string> = {
    1: '#66BB6A',
    2: '#42A5F5',
    3: '#FFCA28',
    4: '#4FC3F7',
    5: '#EF5350',
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        type: 'line',
        data: [],
        label: 'Mood',
        fill: false,
        borderColor: '#888',
        backgroundColor: '#888',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: [],
        pointHoverBackgroundColor: [],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#999',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 40, right: 30, bottom: 10, left: 10 },
    },
    scales: {
      y: {
        min: 1,
        max: 5.5,
        ticks: {
          stepSize: 1,
          font: { size: 22 },
          color: '#1F1F1F', // text-color for light mode (default)
          callback: (val) => this.valueToEmoji[+val] || '',
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: true,
        },
        border: {
          display: true,
          color: '#1F1F1F', // text-color for light mode (default)
        },
      },
      x: {
        ticks: {
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 45,
          color: '#1F1F1F', // text-color for light mode (default)
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: true,
        },
        border: {
          display: true,
          color: '#1F1F1F', // text-color for light mode (default)
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(31,31,31,0.8)', // text-color with alpha (default light)
        titleColor: '#F5F5F5', // dark-text-color default
        bodyColor: '#F5F5F5', // dark-text-color default
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const val = context.raw as number | null;
            if (val === null || val === undefined) return `❓ Unknown on ${context.label}`;
            const mood = this.moodDescriptions[val - 1] || '❓ Unknown';
            return `${mood} on ${context.label}`;
          }

        },
      },
    },
  };

  isMobile = false; // set default false initially

  constructor() {
    this.isMobile = window.innerWidth < 768;
    this.setYAxisFontSize();

    Chart.register(this.emojiPointsPlugin, this.chartBackgroundPlugin);
  }

  ngOnInit() {
    this.loadDiaryEntries();
  }

  ngAfterViewInit() {
    this.monitorThemeChanges();

    // Add resize listener to update font size dynamically
    window.addEventListener('resize', () => {
      const currentlyMobile = window.innerWidth < 768;
      if (currentlyMobile !== this.isMobile) {
        this.isMobile = currentlyMobile;
        this.setYAxisFontSize();
      }
    });
  }

  setYAxisFontSize() {
    const fontSize = this.isMobile ? 20 : 22;

    this.lineChartOptions = {
      ...this.lineChartOptions,
      scales: {
        ...this.lineChartOptions.scales,
        y: {
          ...this.lineChartOptions.scales?.['y'],
          ticks: {
            ...this.lineChartOptions.scales?.['y']?.ticks,
            font: {
              ...this.lineChartOptions.scales?.['y']?.ticks?.font,
              size: fontSize,
            },
          },
        },
      },
    };

    this.chart?.update();
  }

  loadDiaryEntries() {
    this.isloading = true;
    const token = sessionStorage.getItem('TokenData') || '';

    this.diarySrv.getAllEntries(token).subscribe({
      next: (params) => {
        this.diaryEntries = params;
        this.processDiaryEntries();
        this.refreshChart();
        setTimeout(() => {
          this.chart?.update();
          this.updateChartThemeColors();
          this.refreshChart(); 
        }, 100);
        this.isloading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load entries.';
        this.isloading = false;
      },
    });
  }

  processDiaryEntries(): void {
    const sorted = [...this.diaryEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let grouped: { [key: string]: UpdateEntryModel[] } = {};

    if (this.selectedViewMode === 'daily') {
      const last14 = sorted.slice(-14);
      this.dateLabels = last14.map((entry) =>
        new Date(entry.date).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
        })
      );
      this.moodValues = last14.map(entry => {
        if (entry.mood && entry.mood in this.moodToNumericMap) {
          return this.moodToNumericMap[entry.mood];
        }
        return null;  // use null instead of NaN
      });

    } else if (this.selectedViewMode === 'monthly') {
      grouped = sorted.reduce((acc, entry) => {
        const key = new Date(entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
        (acc[key] = acc[key] || []).push(entry);
        return acc;
      }, {} as { [key: string]: UpdateEntryModel[] });

    } else if (this.selectedViewMode === 'yearly') {
      grouped = sorted.reduce((acc, entry) => {
        const key = new Date(entry.date).getFullYear().toString();
        (acc[key] = acc[key] || []).push(entry);
        return acc;
      }, {} as { [key: string]: UpdateEntryModel[] });
    }

    if (this.selectedViewMode !== 'daily') {
      this.dateLabels = Object.keys(grouped);
      this.moodValues = this.dateLabels.map(label => {
        const moods = grouped[label]
          .map(entry => (entry.mood && entry.mood in this.moodToNumericMap ? this.moodToNumericMap[entry.mood] : NaN))
          .filter(v => !isNaN(v));

        const mode = this.getMode(moods);
        return mode ?? NaN;
      });
    }
  }

  getMode(arr: number[]): number | null {
    if (arr.length === 0) return null;

    const freq: Record<number, number> = {};
    arr.forEach((val) => (freq[val] = (freq[val] || 0) + 1));

    let maxFreq = 0;
    let mode: number | null = null;

    for (const key in freq) {
      const val = Number(key);
      if (freq[val] > maxFreq) {
        maxFreq = freq[val];
        mode = val;
      }
    }
    return mode;
  }

  refreshChart(): void {
    this.lineChartData.labels = this.dateLabels;
    this.lineChartData.datasets[0].data = this.moodValues;

    setTimeout(() => {
      const canvasEl = this.chart?.chart?.canvas as HTMLCanvasElement | undefined;
      if (!canvasEl) return;

      const container = canvasEl.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;

      const minWidthPerPoint = 60; // px per label
      const calculatedWidth = Math.max(minWidthPerPoint * this.dateLabels.length, containerWidth * 0.8);

      // Set min-width on canvas (or style width for exact)
      canvasEl.style.minWidth = `${calculatedWidth}px`;
      // Optional: set parent container min-width too if needed
      container.style.minWidth = `${calculatedWidth}px`;

      this.chart?.update();
    }, 0);

    this.updateChartThemeColors();
  }

  retry() {
    this.loadDiaryEntries();
  }

  isDarkModeActive(): boolean {
    const wrapper = document.querySelector('.body-wrapper');
    return wrapper?.getAttribute('data-theme') === 'dark';
  }

  updateChartThemeColors(): void {
    if (!this.chart) return;
    const ctx = this.chart.chart?.ctx;
    const area = this.chart.chart?.chartArea;
    if (!ctx || !area) return;

    const isDark = this.isDarkModeActive();

    // Gradient colors for line
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    if (isDark) {
      gradient.addColorStop(0, '#FF6F61');
      gradient.addColorStop(0.5, '#FFD54F');
      gradient.addColorStop(1, '#81C784');
    } else {
      gradient.addColorStop(0, this.moodColors[5]);
      gradient.addColorStop(0.5, this.moodColors[3]);
      gradient.addColorStop(1, this.moodColors[1]);
    }

    const dataset = this.lineChartData.datasets[0];
    dataset.borderColor = gradient;

    // Update points colors dynamically per theme
    dataset.pointBackgroundColor = this.moodValues.map((val) => val !== null ? this.moodColors[val] : 'transparent');
    dataset.pointHoverBackgroundColor = this.moodValues.map((val) =>
      val !== null ? this.adjustColorBrightness(this.moodColors[val], isDark ? -20 : 20) : 'transparent'
    );

    const axisColor = isDark ? '#F5F5F5' : '#1F1F1F';
    const tooltipBg = isDark ? 'rgba(245,245,245,0.9)' : 'rgba(31,31,31,0.8)';
    const tooltipText = isDark ? '#1F1F1F' : '#F5F5F5';

    this.lineChartOptions = {
      ...this.lineChartOptions,
      scales: {
        y: {
          ...this.lineChartOptions.scales!['y'],
          ticks: {
            ...this.lineChartOptions.scales!['y']!.ticks,
            color: axisColor,
          },
          border: {
            ...this.lineChartOptions.scales!['y']!.border,
            color: axisColor,
          },
        },
        x: {
          ...this.lineChartOptions.scales!['x'],
          ticks: {
            ...this.lineChartOptions.scales!['x']!.ticks,
            color: axisColor,
          },
          border: {
            ...this.lineChartOptions.scales!['x']!.border,
            color: axisColor,
          },
        },
      },
      plugins: {
        ...this.lineChartOptions.plugins,
        tooltip: {
          ...this.lineChartOptions.plugins!.tooltip,
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
        },
      },
    };

    this.chart.update();
  }

  monitorThemeChanges() {
    const wrapper = document.querySelector('.body-wrapper');
    if (!wrapper) return;

    const observer = new MutationObserver(() => {
      this.updateChartThemeColors();
    });

    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  adjustColorBrightness(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, R + Math.round((percent / 100) * 255)));
    G = Math.min(255, Math.max(0, G + Math.round((percent / 100) * 255)));
    B = Math.min(255, Math.max(0, B + Math.round((percent / 100) * 255)));

    return `rgb(${R},${G},${B})`;
  }

  emojiPointsPlugin = {
    id: 'emojiPoints',
    afterDatasetsDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${this.isMobile ? 14 : 18}px 'Segoe UI Emoji'`;

      dataset.data.forEach((value, index) => {
        const point = meta.data[index];
        if (!point) return;

        const emoji = this.valueToEmoji[value as number];
        if (emoji) {
          ctx.fillText(emoji, point.x, point.y - 25);
        }
      });
    },
  };

  chartBackgroundPlugin = {
    id: 'chartBackground',
    beforeDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const isDark = this.isDarkModeActive();

      ctx.save();
      ctx.fillStyle = isDark ? '#1e1e1e' : '#FAFAFA'; // background colors from your palette
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
      ctx.restore();
    },
  };
}
