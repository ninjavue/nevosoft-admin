<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput v-model="filter" class="col-6" placeholder="Xodimni qidirish..." />
    <VaButtonGroup preset="info" class="ml-a">
      <VaButton :color="!isPage ? 'warning' : ''" @click="isPage = !isPage">
      <VaIcon name="dashboard"/>
    </VaButton>
      <VaButton :color="isPage ? 'warning' : ''" @click="isPage = !isPage">
        <VaIcon name="list"/>
      </VaButton>
    </VaButtonGroup>
    <VaButton class="ml-8" @click="handleModal">Qo'shish</VaButton>
  </div>
  <div v-if="isPage" class="employe-card">
    <div class="row">
      <div class="employe-col" v-for="e of employees" :key="e._id">
        <VaCard class="m-3 p-2 relative">
          <VaImage fit="fill" class="w-full h-48"  :src="`${url}/${e.img[0]}`"/>
          <h2 class="va-h6 text-center mb-5">{{ e.full_name }}</h2>
          <div class="d-flex justify-center align-center mb-10">
            <h2>{{ e.job }}</h2>
            <h2 class="ml-a"><b>Oyligi:</b><span>$</span>{{ e.salary }}</h2>
          </div>
          <p class="va-text-secondary absolute bottom-1 right-1">
            {{ e.date }}
          </p>
          <div class="absolute top-3 right-2 d-flex direction-c">
            <VaButton
              round
              class="mb-2"
              color="primary"
              icon="edit"
              @click="editRow(e)"
            />
            <VaButton
              round
              icon="delete"
              color="danger"
              @click="deleteRow(e)"
            />
      </div>
        </VaCard>
      </div>
    </div>
  </div>

  <VaDataTable
    v-else
    class="table-crud"
    :items="employees"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #cell(img)="{ row }">
      <div>
        <VaAvatar style="min-width: 50px" :src="`${url}/${row.rowData.img[0]}`" class="min-h-14 min-w-14" />
      </div>
    </template>
    <template #cell(salary)="{ row }">
      $<span>
        {{row.rowData.salary}}
      </span>
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
    <template v-if="employees.length > 0" #bodyAppend>
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
      <h2>Xodim qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      Maydonlarni to'liq to'ldirish shart!
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput
          class="col-12"
          v-model="emplooye.full_name"
          label="F.I.O"
          required
        />
        <div class="flex align-center justify-center">
          <VaInput
            v-model="emplooye.salary"
            type="number"
            class="mt-3"
            label="Salary"
            required
          />
          <VaInput
            v-model="emplooye.job"
            class="mt-3 ml-10"
            label="Job"
            required
          />
        </div>
        <VaFileUpload
          class="mt-3 w-full"
          v-model="img"
          type="gallery"
          fileTypes="image/*"
        >
          <div class="">
            <div
              style="font-size: 12px"
              class="text-blue-600 mb-3 font-semibold"
            >
              Xodim rasmini tanlang
            </div>
            <div
              style="border-width: 1px; border-radius: 6px"
              class="w-full h-20 border-blue-600 border-solid d-flex justify-center align-center"
              v-if="img.length == 0"
            >
              <VaIcon class="mr-2" name="image" size="4rem" color="primary" />
            </div>
          </div>
        </VaFileUpload>
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
      { key: "img", sortable: true, width: "150px" },
      { key: "full_name", sortable: true, width: "230px" },
      { key: "salary", sortable: true, width: "230px" },
      { key: "job", sortable: true, width: "230px" },
      { key: "date", sortable: true, width: "250px" },
      { key: "actions", width: "150px" },
    ];

    return {
      items: users,
      columns,
      perPage: 4,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      emplooye: {
        full_name: "",
        img: "",
        salary: 0,
        job: "",
      },
      isError: false,
      isUpdated: false,
      img: [],
      isPage: false,
      id:''
    };
  },

  computed: {
    url() {
      return this.$store.getters.imgUrl;
    },
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    employees() {
      const typesWithNumbers = this.$store.getters.employees.map(
        (employe, index) => {
          return {
            ...employe,
            N: index + 1,
            date: this.formatDate(employe.createdAt),
          };
        }
      );

      return typesWithNumbers;
    },
  },
  methods: {
    handleFileChange(event) {
      this.image = event.target.files[0];
    },
    handleModal() {
      this.showModal = true;
      this.isUpdated = false;
      this.isError = false;
      this.emplooye = {};
      this.img = [];
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
        if (
          this.emplooye.full_name &&
          this.emplooye.salary &&
          this.emplooye.job && this.img.length
        ) {
          const formData = new FormData();
          formData.append("full_name", this.emplooye.full_name);
          formData.append("salary", this.emplooye.salary);
          formData.append("job", this.emplooye.job);
          formData.append("img", this.img[0]);
          this.$store
            .dispatch("postEmploye", formData)
            .then(() => {
              this.showModal = false;
              this.emplooye = {};
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
        if (this.emplooye.full_name &&
          this.emplooye.salary &&
          this.emplooye.job) {
          this.emplooye.img = this.img
          this.$store.dispatch("editEmploye", this.emplooye);
          this.emplooye = {};
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
        .dispatch("getEmploye", row._id)
        .then((res) => {
          this.emplooye = res.data
          this.img = res.data.img
          this.id = res.data._id
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteEmploye", row._id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
  },
  mounted() {
    this.$store.dispatch("allEmploye");
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
.employe-card{
  max-height: 400px;
  overflow-y: scroll;
}
.direction-c{
  flex-direction: column;
}
.va-avatar img{
  min-width: 50px;
  min-height: 50px;
}
.employe-col{
  width: 292px;
}
</style>