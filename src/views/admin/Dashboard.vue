<template>
  <div class="dashboard p-4">

    <!-- 🔹 Thống kê nhanh -->
    <div class="row g-3 mb-4">
      <div v-for="card in statCards" :key="card.title" class="col-lg-3 col-md-6">
        <div class="summary-card p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="text-muted mb-0">{{ card.title }}</h6>
            <i :class="card.icon" class="fs-5"></i>
          </div>
          <h4 class="fw-bold mb-0">{{ card.value }}</h4>
          <small :class="card.change > 0 ? 'text-success' : 'text-danger'">
            {{ card.change > 0 ? '+' : '' }}{{ card.change }}%
          </small>
        </div>
      </div>
    </div>

    <!-- 🔹 Biểu đồ -->
    <div class="row g-4">
      <div class="col-lg-6 col-md-12" v-for="chart in charts" :key="chart.id">
        <div class="card p-3 shadow-sm chart-card">
          <h5 class="fw-semibold mb-2">{{ chart.title }}</h5>
          <canvas :id="chart.id"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  Chart,
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,
  BarController, BarElement,
  DoughnutController, ArcElement,
  RadarController, RadialLinearScale
} from 'chart.js'

Chart.register(
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,
  BarController, BarElement,
  DoughnutController, ArcElement,
  RadarController, RadialLinearScale
)

// 🧮 Dữ liệu thống kê nhanh
const statCards = ref([
  { title: 'Doanh thu', value: '₫124.5M', change: +12.5, icon: 'bi bi-graph-up-arrow' },
  { title: 'Đơn hàng', value: '342', change: +5.2, icon: 'bi bi-bag-check' },
  { title: 'Khách hàng', value: '218', change: -2.4, icon: 'bi bi-people' },
  { title: 'Sản phẩm', value: '87', change: +8.9, icon: 'bi bi-box-seam' },
])

// Danh sách chart
const charts = [
  { id: 'chartLine', title: 'Doanh thu theo tháng' },
  { id: 'chartBar', title: 'Top sản phẩm bán chạy' },
  { id: 'chartDoughnut', title: 'Doanh thu theo kênh' },
  { id: 'chartRadar', title: 'KPI tuần' },
]

const rand = (max = 100, min = 10) => Math.floor(Math.random() * (max - min + 1)) + min

onMounted(() => {
  // LINE
  const ctxLine = document.getElementById('chartLine')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const gradient = ctxLine.getContext('2d').createLinearGradient(0, 0, 0, 300)
  gradient.addColorStop(0, 'rgba(16,185,129,0.5)')
  gradient.addColorStop(1, 'rgba(16,185,129,0.05)')

  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Doanh thu (triệu)',
        data: months.map(() => rand(200, 50)),
        borderColor: '#10b981',
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  })

  // BAR
  const ctxBar = document.getElementById('chartBar')
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['Aphone X','Bphone Pro','Cmini','Dtab','Ewatch'],
      datasets: [{
        label: 'Số lượng bán',
        data: [120, 190, 150, 80, 100],
        backgroundColor: ['#3b82f6','#06b6d4','#8b5cf6','#f59e0b','#ef4444'],
        borderRadius: 8
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  })

  // DOUGHNUT
  const ctxDoughnut = document.getElementById('chartDoughnut')
  new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: ['Website','Mobile App','Cửa hàng'],
      datasets: [{
        data: [60, 25, 15],
        backgroundColor: ['#22c55e','#3b82f6','#f59e0b'],
        hoverOffset: 10
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })

  // RADAR
  const ctxRadar = document.getElementById('chartRadar')
  new Chart(ctxRadar, {
    type: 'radar',
    data: {
      labels: ['Chất lượng','Tốc độ','Hài lòng','Tỉ lệ hoàn','Độ phủ'],
      datasets: [{
        label: 'Tuần này',
        data: [80,65,90,40,72],
        backgroundColor: 'rgba(239,68,68,0.25)',
        borderColor: 'rgba(239,68,68,0.9)',
        pointBackgroundColor: '#ef4444'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { r: { beginAtZero: true, max: 100 } } }
  })
})
</script>

<style scoped>
.dashboard {
  background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%);
  min-height: 100vh;
}

.summary-card {
  border-radius: 14px;
  background: linear-gradient(135deg, #ffffff, #f3f4f6);
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  transition: all 0.25s ease;
}
.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.chart-card {
  border-radius: 16px;
  background: #fff;
  transition: all 0.25s ease;
}
.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

canvas {
  width: 100% !important;
  height: 320px !important;
  transition: 0.2s ease;
}

.text-success {
  color: #10b981 !important;
}
.text-danger {
  color: #ef4444 !important;
}
</style>
