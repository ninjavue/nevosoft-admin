<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput v-model="filter" class="col-6" placeholder="Admin qidirish..." />
    <VaButton class="ml-a" @click="handleModal">Admin qo'shish</VaButton>
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
    <template #cell(password)="{ row }">
      <div>
        <span v-if="isShow === row.rowData._id">{{
          row.rowData.password
        }}</span>
        <span v-else>***********</span>
        <VaButton
          style="margin-top: -3px"
          round
          class="ml-2"
          preset="secondary"
          size="small"
          @click="handlePassword(row.rowData._id)"
        >
          <svg
          v-if="isShow !== row.rowData._id"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-eye-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path
              d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-eye-slash-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"
            />
            <path
              d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"
            />
          </svg>
        </VaButton>
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
      <h2>Xizmat qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      {{ text }}
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput class="col-12" v-model="login.login" label="Login" required />
        <VaInput
          v-model="login.password"
          class="mt-3 col-12"
          label="Password"
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
</template>
    
  <script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "60px" },
      { key: "login", sortable: true, width: "230px" },
      { key: "password", sortable: true, width: "230px" },
      { key: "date", sortable: true, width: "250px" },
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
      login: {
        login: "",
        password: "",
        en: "",
      },
      isError: false,
      isUpdated: false,
      id: "",
      isShow: "",
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    types() {
      const typesWithNumbers = this.$store.getters.admin.map((type, index) => {
        return {
          ...type,
          N: index + 1,
          date: this.formatDate(type.createdAt),
        };
      });

      return typesWithNumbers;
    },
  },
  methods: {
    handlePassword(id){
      if(this.isShow === id){
        this.isShow = ''
      }else{
        this.isShow = id
      }
    },
    handleModal() {
      this.showModal = true;
      this.isUpdated = false;
      this.login = {};
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
        if (this.login.login && this.login.password) {
          if (this.login.password.length >= 8) {
            this.$store
              .dispatch("postAdmin", this.login)
              .then(() => {
                this.showModal = false;
                this.login = {};
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
            this.text = "Parol kamida 8 ta belgidan iborat bo'lishi kerak!";
            this.isError = true;
          }
        } else {
          this.text = "Maydonlarni to'liq to'ldirish shart!";
          this.isError = true;
        }
      } else {
        if (this.login.login && this.login.password) {
          if (this.login.password.length >= 8) {
            this.$store.dispatch("editAdmin", this.login);
            this.login = {};
            this.showModal = false;
            this.isUpdated = false;
            this.$vaToast.init({
              message: "Malumot tahrirlandi",
              color: "success",
              position: "bottom-right",
            });
          } else {
            this.text = "Parol kamida 8 ta belgidan iborat bo'lishi kerak!";
            this.isError = true;
          }
        } else {
          this.text = "Maydonlarni to'liq to'ldirish shart!";
          this.isError = true;
        }
      }
    },
    editRow(row) {
      this.$store
        .dispatch("getAdmin", row._id)
        .then((res) => {
          this.login = res.data;
          this.id = res.data._id;
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteAdmin", row._id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
  },
  mounted() {
    this.$store.dispatch("allAdmin");
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