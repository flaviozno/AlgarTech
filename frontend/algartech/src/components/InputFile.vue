<template>
  <div>
    <div
      class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
      @click="closeModal"
    ></div>
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50"
      :style="{ width: modalWidth }"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Carregar CSV</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          Fechar
        </button>
      </div>

      <div class="flex flex-col items-center space-y-4">
        <label
          for="csv"
          class="w-full flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
        >
          <input
            type="file"
            id="csv"
            class="hidden"
            @change="handleFileUpload"
          />
          Carregar CSV
        </label>

        <button
          @click="uploadCsv"
          :disabled="!csvData"
          class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:pointer-events-none"
        >
          Enviar CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InputFile",
  data() {
    return {
      modalWidth: "400px",
      csvData: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    handleFileUpload(event) {
      this.csvData = event.target.files[0];
    },
    async uploadCsv() {
      if (this.csvData) {
        const formData = new FormData();
        formData.append("csvFile", this.csvData);

        await axios
          .post("http://localhost:3333/api/file", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.status === 200) {
              this.closeModal();
            }
          });
      }
    },
  },
};
</script>

<style>
[data-x] {
  transition: transform 0.15s;
  will-change: transform;
}

[data-x="dragging"] {
  transform: scale(1.05);
}
</style>
