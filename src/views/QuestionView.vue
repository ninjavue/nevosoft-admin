<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput v-model="filter" class="col-6" placeholder="Savol qidirish..." />
    <VaButton class="ml-a" @click="handleModal">Qo'shish</VaButton>
  </div>

  <VaDataTable
    class="table-crud"
    :items="questions"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #cell(password)="{ row }">
      <div>{{ row.rowData.password }}</div>
    </template>
    <template #cell(title)="{ row }">
      <div
        class="cursor-pointer hover:text-blue-700"
        @click="handleDesc(row.rowData.title)"
      >
        {{ row.rowData.title.substring(0, 35) }}
        <span v-if="row.rowData.title.length >= 35">...</span>
      </div>
    </template>
    <template #cell(description)="{ row }">
      <div
        class="cursor-pointer hover:text-blue-700"
        @click="handleDesc(row.rowData.description)"
      >
        {{ row.rowData.description.substring(0, 30) }}
        <span v-if="row.rowData.description.length >= 30">...</span>
      </div>
    </template>
    <template #cell(actions)="{ row }">
      <div class="table-btn">
        <VaButton
          round
          class="ml-3"
          color="primary"
          icon="edit"
          @click="editRow(row.rowData)"
        />
        <VaButton
          round
          icon="delete"
          class="ml-3"
          color="danger"
          @click="deleteRow(row.rowData)"
        />
      </div>
    </template>
    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination v-model="currentPage" :pages="pages" />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>
  <VaModal v-model="showModal" hide-default-actions overlay-opacity="0.2" blur>
    <template #header>
      <h2>Savol qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      {{ text }}
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput
          class="col-12"
          v-model="question.title"
          label="Title"
          required
        />
        <VaInput
          v-model="question.description"
          class="mt-3 col-12"
          label="Description"
          required
        />
        <div class="mt-10">
          <VaButton color="danger" class="mr-5" @click="showModal = false">
            Bekor qilish
          </VaButton>
          <VaButton type="submit">
            {{ isUpdated ? "Tahrirlash" : "Kiritish" }}
          </VaButton>
        </div>
      </VaForm>
    </div>
  </VaModal>

  <!-- description -->
  <VaModal v-model="isDesc" hide-default-actions>
    <VaButton
      round
      icon="close"
      @click="isDesc = false"
      class="absolute top-1 right-2"
      color="danger"
    />
    <p>
      {{ description }}
    </p>
  </VaModal>
</template>
      
    <script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "60px" },
      { key: "title", sortable: true, width: "300px" },
      { key: "description", sortable: true, width: "250px" },
      { key: "date", sortable: true, width: "100px" },
      { key: "actions", width: "150px" },
    ];

    return {
      text: "",
      items: users,
      columns,
      perPage: 6,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      question: {
        title: "",
        description: "",
      },
      isError: false,
      isUpdated: false,
      id: "",
      description: "",
      isDesc: false,
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    questions() {
      const questionsWithNumbers = this.$store.getters.questions.map(
        (question, index) => {
          return {
            ...question,
            N: index + 1,
            date: this.formatDate(question.createdAt),
          };
        }
      );

      return questionsWithNumbers;
    },
  },
  methods: {
    handleDesc(text) {
      this.description = text;
      this.isDesc = true;
    },
    handleModal() {
      this.showModal = true;
      this.isUpdated = false;
      this.question = {};
      this.isError = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    },
    handleSubmit() {
      if (!this.isUpdated) {
        if (this.question.title && this.question.description) {
          this.$store
            .dispatch("postQuestion", this.question)
            .then(() => {
              this.showModal = false;
              this.question = {};
              this.$vaToast.init({
                message: "Malumot qo`shildi",
                color: "success",
                position: "bottom-right",
              });
            })
            .catch((err) => {
              console.log(err);
              this.$vaToast.init({
                message: "Malumot qo`shilmadi",
                color: "danger",
                position: "bottom-right",
              });
            });
        } else {
          this.text = "Maydonlarni to'liq to'ldirish shart!";
          this.isError = true;
        }
      } else {
        if (this.question.title && this.question.description) {
          this.$store.dispatch("editQuestion", this.question);
          this.question = {};
          this.showModal = false;
          this.isUpdated = false;
          this.$vaToast.init({
            message: "Malumot tahrirlandi",
            color: "success",
            position: "bottom-right",
          });
        } else {
          this.text = "Maydonlarni to'liq to'ldirish shart!";
          this.isError = true;
        }
      }
    },
    editRow(row) {
      this.$store
        .dispatch("getQuestion", row._id)
        .then((res) => {
          this.question = res.data;
          this.id = res.data._id;
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteQuestion", row._id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
  },
  mounted() {
    this.$store.dispatch("allQuestion");
    if (window.screen.height >= 1080) {
      this.perPage = 8;
    }
  },
});
</script>
    <style lang="scss">
.va-data-table .va-data-table__table .va-data-table__table-td {
  & div {
    &.table-btn {
      padding-bottom: 8px;
      & button {
        margin-top: -6px;
      }
    }
  }
}
</style>