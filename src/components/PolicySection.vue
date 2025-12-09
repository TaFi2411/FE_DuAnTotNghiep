<template>
  <div>
    <div class="policy-premium-row mt-4">

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalBaoHanh">
        <i class="bi bi-shield-lock"></i>
        <span>Bảo hành chính hãng</span>
      </div>

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalHangMoi">
        <i class="bi bi-award"></i>
        <span>Hàng mới 100%</span>
      </div>

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalGiaoNhanh">
        <i class="bi bi-truck"></i>
        <span>Giao nhanh toàn quốc</span>
      </div>

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalDongGoi">
        <i class="bi bi-box"></i>
        <span>Đóng gói chống sốc</span>
      </div>

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalDoiTra">
        <i class="bi bi-arrow-repeat"></i>
        <span>Đổi trả 7 ngày</span>
      </div>

      <div class="policy-premium-item" data-bs-toggle="modal" data-bs-target="#modalTuVan">
        <i class="bi bi-chat-dots"></i>
        <span>Tư vấn 24/7</span>
      </div>

    </div>

    <!-- Modal Bảo hành chính hãng -->
   <div class="modal fade" id="modalBaoHanh" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content p-3">
      <h5 class="mb-3 text-center fw-bold">Chính sách bảo hành – TDT Store</h5>

      <div class="policy-content">

        <h6 class="fw-bold mt-2">1 - BẢO HÀNH CÓ CAM KẾT TRONG 12 THÁNG</h6>
        <ul>
          <li>Chỉ áp dụng cho sản phẩm chính, KHÔNG áp dụng cho phụ kiện đi kèm.</li>
          <li>Bảo hành trong tối đa <b>15 ngày</b> (tính từ ngày TDT Store nhận máy lỗi đến ngày báo khách nhận lại).</li>
          <li>Không bảo hành lại lần 2 trong vòng <b>30 ngày</b> kể từ ngày máy được trả bảo hành.</li>
          <li>Nếu TDT Store vi phạm cam kết (quá 15 ngày hoặc phải bảo hành lại trong 30 ngày), khách hàng được chọn:
            <ul>
              <li><b>Hư gì đổi nấy ngay và luôn</b></li>
              <li>Hoặc <b>Hoàn tiền</b> với mức phí <b>giảm 50%</b></li>
            </ul>
          </li>
          <li>Từ tháng thứ 13 trở đi: chỉ áp dụng bảo hành hãng (nếu có), KHÔNG áp dụng bảo hành cam kết.</li>
        </ul>

        <h6 class="fw-bold mt-3">2 - HƯ GÌ ĐỔI NẤY NGAY VÀ LUÔN<br>(Không áp dụng cho Apple Watch)</h6>

        <h6 class="fw-semibold mt-2">2.1 - Hư sản phẩm chính → Đổi sản phẩm chính mới</h6>
        <ul>
          <li>Tháng đầu tiên: <b>Miễn phí</b>.</li>
          <li>Từ tháng 2 → tháng 12: <b>phí 10% giá trị hóa đơn / tháng</b>.<br>
            (VD: tháng 2 → 10%, tháng 3 → 20%...)</li>
          <li>Nếu không có sản phẩm chính để đổi → áp dụng:
            <ul>
              <li>Bảo hành có cam kết, hoặc</li>
              <li>Hoàn tiền với phí giảm 50%</li>
            </ul>
          </li>
        </ul>

        <h6 class="fw-semibold mt-2">2.2 - Hư phụ kiện đi kèm → Đổi phụ kiện tương đương</h6>
        <ul>
          <li>Đổi miễn phí trong vòng <b>12 tháng</b>.</li>
          <li>Đổi bằng phụ kiện TDT Store đang kinh doanh, chất lượng tương đương.</li>
          <li>Nếu không có phụ kiện tương đương hoặc khách không đồng ý → áp dụng bảo hành hãng.</li>
        </ul>

        <h6 class="fw-semibold mt-2">2.3 - Lỗi phần mềm</h6>
        <ul>
          <li>Không áp dụng đổi trả – chỉ hỗ trợ khắc phục phần mềm.</li>
        </ul>

        <h6 class="fw-semibold mt-2">2.4 - Khách muốn đổi full box (nguyên hộp)</h6>
        <ul>
          <li>Áp dụng phí đổi trả tại mục 2.1.</li>
          <li>Thu thêm <b>20% giá trị hóa đơn</b> phí lấy full box.</li>
        </ul>

        <h6 class="fw-bold mt-3">3 - CHÍNH SÁCH HOÀN TIỀN</h6>
        <ul>
          <li>Áp dụng cho cả sản phẩm lỗi và không lỗi.</li>
          <li>Tháng đầu tiên: <b>phí 20% giá trị hóa đơn</b>.</li>
          <li>Từ tháng 2 → tháng 12: <b>phí 10% giá trị hóa đơn / tháng</b>.</li>
        </ul>
      </div>
    </div>
  </div>
</div>


    <!-- Modal Hàng mới 100% -->
    <div class="modal fade" id="modalHangMoi" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 class="mb-3">Hàng mới 100%</h5>
          <p>Tất cả sản phẩm đều là hàng mới nguyên seal, chưa kích hoạt, đầy đủ phụ kiện.</p>
        </div>
      </div>
    </div>

    <!-- Modal Giao nhanh toàn quốc -->
    <div class="modal fade" id="modalGiaoNhanh" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 class="mb-3">Giao nhanh toàn quốc</h5>
          <p>Hỗ trợ giao hàng siêu tốc, đồng kiểm trước khi nhận.</p>
        </div>
      </div>
    </div>

    <!-- Modal Đóng gói chống sốc -->
    <div class="modal fade" id="modalDongGoi" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 class="mb-3">Đóng gói chống sốc</h5>
          <p>Sản phẩm được đóng gói kỹ lưỡng, đảm bảo an toàn trong suốt quá trình vận chuyển.</p>
        </div>
      </div>
    </div>

    <!-- Modal Đổi trả 7 ngày -->
    <div class="modal fade" id="modalDoiTra" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 class="mb-3">Đổi trả 7 ngày</h5>
          <p>Hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm gặp lỗi từ nhà sản xuất.</p>
        </div>
      </div>
    </div>

    <!-- Modal Tư vấn 24/7 -->
    <div class="modal fade" id="modalTuVan" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 class="mb-3">Tư vấn 24/7</h5>
          <p>Đội ngũ hỗ trợ luôn sẵn sàng tư vấn miễn phí mọi lúc mọi nơi.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "PolicySection",
};
</script>

<style scoped>
.policy-premium-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.policy-premium-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background-color 0.2s;
  font-size: 15px;
}

.policy-premium-item i {
  font-size: 20px;
}

.policy-premium-item:hover {
  background: #f4f4f4;
}
</style>