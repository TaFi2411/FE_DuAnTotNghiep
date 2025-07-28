<template>
  <div class="wrapper">
    <div class="form-container">
      <h2 class="form-title">Quản lý thương hiệu sản phẩm</h2>

      <form class="form-section">
        <div class="form-group">
          <label for="name">Tên thương hiệu</label>
          <input type="text" id="name" placeholder="Nhập tên thương hiệu" required />
        </div>

        <div class="form-group">
          <label>Trạng thái</label>
          <div class="radio-options">
            <label><input type="radio" value="active" name="status" checked /> Hoạt động</label>
            <label><input type="radio" value="inactive" name="status" /> Ngừng hoạt động</label>
          </div>
        </div>

        <button class="btn btn-primary" type="submit">Thêm mới</button>
      </form>

      <div class="search-bar">
        <input type="text" placeholder="Tìm kiếm thương hiệu sản phẩm..." />
        <button class="btn btn-secondary">Tìm</button>
      </div>

      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Điện thoại</td>
            <td><span class="status-active">Hoạt động</span></td>
            <td>
              <button class="btn btn-edit">Sửa</button>
              <button class="btn btn-delete">Xóa</button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Laptop</td>
            <td><span class="status-inactive">Ngừng hoạt động</span></td>
            <td>
              <button class="btn btn-edit">Sửa</button>
              <button class="btn btn-delete">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 20px;
  background-color: white;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.form-container {
  width: 100%;
  max-width: 980px;
  background-color: #fff;
  padding: 56px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5eaf0;
}

.form-title {
  font-size: 30px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 36px;
  text-align: center;
  padding-bottom: 14px;
  border-bottom: 2px solid #d0d7de;
  letter-spacing: 0.5px;
}

.form-section {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 28px;
}

label {
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
  color: #222;
}

input[type="text"] {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  background-color: #fdfdfd;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  border-color: #1976d2;
  outline: none;
  background-color: #fff;
}

.radio-options {
  display: flex;
  gap: 30px;
  margin-top: 12px;
  font-size: 15px;
}

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.25s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #1976d2;
  color: #fff;
}

.btn-secondary {
  background-color: #f1f3f4;
  color: #333;
}

.btn-edit {
  background-color: #43a047;
  color: white;
  margin-right: 6px;
}

.btn-delete {
  background-color: #e53935;
  color: white;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.product-table th,
.product-table td {
  padding: 18px;
  text-align: center;
  border-bottom: 1px solid #ececec;
  font-size: 15px;
}

.product-table th {
  background-color: #f6f8fa;
  font-weight: 700;
  color: #1a1a1a;
}

.status-active {
  color: #2e7d32;
  font-weight: 600;
}

.status-inactive {
  color: #c62828;
  font-weight: 600;
}

@media (max-width: 768px) {
  .form-container {
    padding: 32px;
  }

  .search-bar {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
