<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput
      v-model="filter"
      class="col-6"
      placeholder="Buyurtmani qidirish..."
    />
    <VaButton class="ml-a" @click="handleModal">Qo'shish</VaButton>
  </div>

  <VaDataTable
    class="table-crud"
    :items="orders"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #cell(name)="{ row }">
      <div :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.name }}
      </div>
    </template>
    <template #cell(phone)="{ row }">
      <div :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.phone }}
      </div>
    </template>
    <template #cell(N)="{ row }">
      <div :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.N }}
      </div>
    </template>
    <template #cell(date)="{ row }">
      <div :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.date }}
      </div>
    </template>
    <template #cell(siteType)="{ row }">
      <div :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.siteType }}
      </div>
    </template>
    <template #cell(description)="{ row }">
      <div @click="handleDesc(row.rowData.description)" :class="{ 'bg-blue-500 text-white': !row.rowData.status }">
        {{ row.rowData.description.substring(0, 30) }}<span v-if="row.rowData.description.length >= 30">...</span>
      </div>
    </template>
    <template #cell(actions)="{ row }">
      <div :class="`table-btn ${!row.rowData.status ? 'bg-blue-500' : ''}`">
        <VaButton
          round
          class="ml-3"
          :color="row.rowData.status ? 'success' : 'warning'"
          :icon="row.rowData.status ? 'va-check' : 'va-close'"
          @click="handleDone(row.rowData)"
        />
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
      <h2>Yangi buyurtma</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      Maydonlarni to'liq to'ldirish shart!
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput class="col-12" v-model="order.name" label="F.I.O" required />

        <VaInput
          v-model="order.phone"
          class="mt-3 col-12"
          v-mask="'+998 ## ### ## ##'"
          label="Telefon"
          required
        />

        <VaSelect
          v-model="changeId"
          class="mt-3 col-12"
          label="Qanday sayt"
          :options="
            types.map((type) => ({ value: type._id, text: type.name.ru }))
          "
          required
        />
        <VaTextarea
          class="col-12 mb-10 mt-3"
          v-model="order.description"
          label="Malumot yozib qoldirish."
          required
        />

        <div>
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
      { key: "name", sortable: true, width: "230px" },
      { key: "phone", sortable: true, width: "250px" },
      { key: "date", sortable: true, width: "250px" },
      { key: "siteType", sortable: true, width: "250px" },
      { key: "description" },
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
      username: "",
      password: "",
      value: "",
      options: ["admin", "user"],
      order: {
        name: "",
        phone: "",
        description: "",
        typeId: "",
      },
      isError: false,
      changeId: {},
      isUpdated: false,
      description:'',
      isDesc: false
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    orders() {
      const ordersWithNumbers = this.$store.getters.order.map(
        (order, index) => {
          let siteType = "";
          this.$store.getters.type.map((t) => {
            if (order.typeId == t._id) {
              siteType = t.name.ru;
            }
          });
          return {
            ...order,
            N: index + 1,
            date: this.formatDate(order.createdAt),
            siteType,
          };
        }
      );

      return ordersWithNumbers;
    },
    types() {
      return this.$store.getters.type;
    },
  },
  methods: {
    handleDesc(text){
      this.description = text
      this.isDesc = true
    },
    handleModal() {
      this.showModal = true;
      this.order = {};
      this.changeId = {};
      this.isUpdated = false
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
        if (this.changeId && this.order.description) {
          this.order.typeId = this.changeId.value;
          this.order.phone = this.order.phone.replace(new RegExp('\\s', 'g'), '')
          this.$store
            .dispatch("postOrder", this.order)
            .then(() => {
              this.showModal = false;
              this.order = {};
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
          this.changeId &&
          this.order.description &&
          this.order.name &&
          this.order.phone
        ) {
          this.order.typeId = this.changeId.value;
          this.order.phone = this.order.phone.replace(new RegExp('\\s', 'g'), '')
          this.$store.dispatch("editOrder", this.order);
          this.order = {};
          this.changeId = {};
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
        .dispatch("getOrder", row._id)
        .then((res) => {
          this.order = res.data;
          this.changeId = this.types.find(
            (type) => type._id === res.data.typeId
          );
          this.changeId = {
            value: this.changeId._id,
            text: this.changeId.name.ru,
          };
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteOrder", row._id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
    handleDone(row) {
      let list = {
        _id: row._id,
        status: !row.status,
      };
      this.$store.dispatch("editStatus", list);
    },
  },
  mounted() {
    this.$store.dispatch("allOrder");
    this.$store.dispatch("allType");
    if (window.screen.height >= 1080) {
      this.perPage = 8
    }
  },
});
</script>
<style lang="scss">
.va-data-table .va-data-table__table .va-data-table__table-td {
  padding: 0;
  vertical-align: text-top;
  & div {
    padding: 0.9rem;
    &.table-btn {
      padding-bottom: 8px;
      & button {
        margin-top: -6px;
      }
    }
  }
}
</style>