<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput
      v-model="filter"
      class="col-6"
      placeholder="Xizmatlarni qidirish..."
    />
    <VaButton class="ml-a" @click="handleModal">Qo'shish</VaButton>
  </div>

  <VaDataTable
    class="table-crud"
    :items="types"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
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
      <h2>Xizmat qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      Maydonlarni to'liq to'ldirish shart!
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        
        <VaInput class="col-12" v-model="name.uz" label="Uzbek" required />
        <VaInput v-model="name.ru" class="mt-3 col-12" label="Rusian" required />
        <VaInput v-model="name.en" class="mt-3 col-12" label="English" required />
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
</template>
  
<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "60px" },
      { key: "Uz", sortable: true, width: "230px" },
      { key: "Ru", sortable: true, width: "230px" },
      { key: "En", sortable: true, width: "230px" },
      { key: "date", sortable: true, width: "250px" },
      { key: "actions", width: "150px" },
    ];

    return {
      items: users,
      columns,
      perPage: 6,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      name: {
          uz: "",
          ru: "",
          en: ""
        },
      isError: false,
      isUpdated: false,
      id:''
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    types() {
      const typesWithNumbers = this.$store.getters.type.map((type, index) => {
        return {
          ...type,
          N: index + 1,
          date: this.formatDate(type.createdAt),
          Ru: type.name.ru,
          En: type.name.en,
          Uz: type.name.uz,
        };
      });

      return typesWithNumbers;
    },
  },
  methods: {
    handleModal() {
      this.showModal = true
      this.isUpdated = false
      this.name = {};
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
        if (this.name.uz && this.name.ru && this.name.en) {
          this.$store
            .dispatch("postType", {name: this.name})
            .then(() => {
              this.showModal = false;
              this.type = {};
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
          this.isError = true;
        }
      } else {
        if (
          this.name.uz &&
          this.name.ru &&
          this.name.en
        ) {
          this.$store.dispatch("editType", {name: this.name, _id: this.id});
          this.name = {};
          this.showModal = false;
          this.isUpdated = false;
          this.$vaToast.init({
            message: "Malumot tahrirlandi",
            color: "success",
            position: "bottom-right",
          });
        } else {
          this.isError = true;
        }
      }
    },
    editRow(row) {
      this.$store
        .dispatch("getType", row._id)
        .then((res) => {
          this.name = res.data.name
          this.id = res.data._id
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteType", row._id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
  },
  mounted() {
    this.$store.dispatch("allType");
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