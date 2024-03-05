<template>
  <div class="flex flex-col container mx-auto">
    <div class="flex mb-4 mt-4 justify-between">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Filtro..."
        class="p-2 border border-gray-300 rounded-md"
      />
      <div class="flex">
        <button
          class="mr-2 py-2 px-4 bg-green-200 rounded-md"
          @click="reloadDB"
        >
          Reload DB!
        </button>
        <button
          class="py-2 px-4 bg-blue-200 rounded-md"
          @click="showModal = true"
        >
          Upload CSV
        </button>
      </div>
    </div>
    <InputFile v-if="showModal" @closeModal="showModal = false" />
    <div class="overflow-x-auto">
      <table class="table-auto w-full">
        <thead>
          <tr
            class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
          >
            <th class="py-3 px-6 text-left">Name</th>
            <th class="py-3 px-6 text-left">Phone</th>
            <th class="py-3 px-6 text-left">Address</th>
            <th class="py-3 px-6 text-left">Debt Amount</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr
            v-for="(client, index) in filteredClients"
            :key="index"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left whitespace-nowrap">
              {{ client.name }}
            </td>
            <td class="py-3 px-6 text-left whitespace-nowrap">
              <input
                type="text"
                maxlength="11"
                v-model="client.phone"
                @blur="updateClient(client, 'Phone')"
                class="border border-gray-300 rounded-md p-1"
              />
            </td>
            <td class="py-3 px-6 text-left whitespace-nowrap">
              <input
                type="text"
                v-model="client.address"
                @blur="updateClient(client, 'Address')"
                class="border border-gray-300 rounded-md p-1"
              />
            </td>
            <td class="py-3 px-6 text-left whitespace-nowrap">
              {{ client.debt_amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-between items-center">
      <button
        @click="previousPage(clients.currentPage)"
        v-if="clients.currentPage !== 1"
        class="py-2 px-4 bg-gray-200 rounded-md"
      >
        Previous
      </button>
      <span>Page {{ clients.currentPage }} of {{ clients.totalPages }}</span>
      <button
        @click="nextPage(clients.currentPage, clients.totalPages)"
        v-if="clients.currentPage !== clients.totalPages"
        class="py-2 px-4 bg-gray-200 rounded-md"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import InputFile from "./InputFile.vue";

export default {
  name: "TableComponent",
  components: { InputFile },
  setup() {
    const notify = (field) => {
      if (field) {
        toast.success(`${field} was updated!`, {
          autoClose: 1000,
          position: "top-center",
          theme: "light",
        });
      } else {
        toast.success(`Your DB was reloaded!`, {
          autoClose: 1000,
          position: "top-center",
          theme: "light",
        });
      }
    };
    return { notify };
  },
  data() {
    return {
      showModal: false,
      searchQuery: "",
      clients: [],
      phone: "",
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    filteredClients() {
      if (!this.searchQuery) {
        return this.clients.clients;
      } else {
        return this.clients.clients.filter(
          (client) =>
            client.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            client.phone
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            client.address
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
      window.location.reload();
    },
    async reloadDB() {
      try {
        const { status } = await axios.get(
          `${process.env.VUE_APP_API}/api/clients/reload`
        );
        if (status === 200) {
          this.notify();
          this.fetchData();
        }
      } catch (error) {
        console.error("Erro ao obter os dados dos clientes:", error.message);
      }
    },
    async updateClient(client, field) {
      if (client) {
        const { data } = await axios.put(
          `${process.env.VUE_APP_API}/api/clients/${client._id}`,
          client
        );

        const index = this.clients.clients.findIndex(
          (e) => e._id === client._id
        );
        if (index !== -1) {
          this.clients.clients[index] = data;
          this.clients.clients[index].phone = this.clients.clients[index].phone
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
          this.notify(field);
        }
      }
    },
    async fetchData() {
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_API}/api/clients`);
        data.clients.forEach((client) => {
          client.phone = client.phone
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        });
        this.clients = data;
      } catch (error) {
        console.error("Erro ao obter os dados dos clientes:", error.message);
      }
    },
    async nextPage(currentPage, totalPages) {
      if (currentPage < totalPages) {
        const { data } = await axios.get(
          `${process.env.VUE_APP_API}/api/clients?page=${currentPage + 1}`
        );
        data.clients.forEach((client) => {
          client.phone = client.phone
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        });
        this.clients = data;
      }
    },
    async previousPage(currentPage) {
      if (currentPage > 0) {
        const { data } = await axios.get(
          `${process.env.VUE_APP_API}/api/clients?page=${currentPage - 1}`
        );
        data.clients.forEach((client) => {
          client.phone = client.phone
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        });
        this.clients = data;
      }
    },
  },
};
</script>
