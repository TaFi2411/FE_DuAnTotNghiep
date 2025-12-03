<template>
  <div class="chart-container" :style="{ height: height, width: width }">
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script setup>
import { defineProps, onMounted, watch } from 'vue';
// Import các thành phần cần thiết từ Chart.js
import {
  Chart,
  // Controllers/Chart Types
  LineController,
  BarController,
  DoughnutController,
  // Elements
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  // Scales
  LinearScale, // Cần cho trục Y của Line/Bar chart (Doanh thu)
  CategoryScale, // Cần cho trục X/Y labels của Line/Bar chart (Thời gian, Tên SP)
  // Plugins
  Tooltip,
  Legend
} from 'chart.js';

// ĐĂNG KÝ CÁC THÀNH PHẦN
// Phải đăng ký tất cả các thành phần được sử dụng trong Statistical.vue
Chart.register(
  LineController,
  BarController,
  DoughnutController,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true,
    validator: (value) => ['line', 'bar', 'doughnut'].includes(value)
  },
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '400px'
  },
  width: {
    type: String,
    default: '100%'
  }
});

let myChart = null;

const createChart = () => {
  const ctx = document.getElementById(props.chartId).getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: props.chartType,
    data: props.chartData,
    options: props.chartOptions,
  });
};

onMounted(createChart);

watch(() => [props.chartData, props.chartType, props.chartOptions], () => {
  if (myChart) {
    // Cập nhật dữ liệu và options nếu biểu đồ đã tồn tại
    myChart.data = props.chartData;
    myChart.options = props.chartOptions;
    myChart.update();
  } else {
    // Hoặc tạo lại nếu chưa tồn tại
    createChart();
  }
}, { deep: true });
</script>

<style scoped>
.chart-container {
  position: relative;
  /* Giữ tỷ lệ khung hình cho biểu đồ dạng tròn */
  max-height: 400px; 
}
</style>