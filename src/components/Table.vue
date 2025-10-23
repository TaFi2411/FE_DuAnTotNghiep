<template>
  <table class="table table-hover table-bordered align-middle">
    <thead class="table-dark">
      <tr>
        <th v-for="(col, i) in columns" :key="i" class="text-center">
          {{ col.label }}
        </th>
        <th v-if="$slots.actions" class="text-center">Thao tác</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="(col, i) in columns" :key="i" class="text-center">
          <!-- Slot cell cho custom -->
          <slot
            v-if="col.slot"
            :name="col.slot"
            :row="row"
          ></slot>

          <span v-else>{{ row[col.field] }}</span>
        </td>

        <td v-if="$slots.actions" class="text-center">
          <slot name="actions" :row="row"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true }
});
</script>
