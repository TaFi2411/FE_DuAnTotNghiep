<template>
  <div class="container" style="width: 100%;">
    <div class="title d-flex justify-content-center">
      <h1>Thêm loại sản phẩm</h1>
    </div>
    <div class="form-type">
      <form action="">
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Tên loại</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Nhập tên loại">
        </div>

        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
            Hoạt đông
          </label>
        </div>

        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
          <label class="form-check-label" for="flexRadioDefault2">
            Ngừng hoạt động
          </label>
        </div>

        <button type="button" class="btn btn-primary">Thêm</button>


        
      </form>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên loại</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Điện thoại</td>
            <td>Hoạt động</td>
            <td>Nút xóa sửa</td>
          </tr>
          
          
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>