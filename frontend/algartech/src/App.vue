<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-center items-center">
        <h1 class="text-xl font-bold">Algar Tech - Desafio 2 / CRUD</h1>
      </div>
    </nav>
    <main class="flex-1">
      <TableComponent />
    </main>
    <footer class="bg-gray-900 text-white py-8 px-4">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 AlgarTech - Feito com 💙.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import TableComponent from "./components/TableComponent.vue";

export default {
  name: "App",
  components: {
    TableComponent,
  },
};
</script>
