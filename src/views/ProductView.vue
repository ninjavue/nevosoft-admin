<template>
    <div class="d-flex align-center justify-center mb-30">
      <VaInput v-model="filter" class="col-6" placeholder="Qidirish..." />
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
        <div class="employe-col" v-for="product of products" :key="product._id">
          <VaCard class="m-3 p-2 relative overflow-hidden">
            <VaImage fit="fill" class="w-full h-48 hover:scale-110"  :src="`${url}/${product.image[0]}`"/>
            <h2 class="va-h6 text-center mb-2">{{ product.title }}</h2>
            <div class="d-flex justify-center align-center mb-5 cursor-pointer hover:text-blue-700" @click="handleDesc(product.description)">
              <h2>{{ product.description.substring(0,100) }} <span v-if="product.description.length >=100">...</span></h2>
            </div>
            <a class="va-text-secondary underline absolute bottom-1 left-1 hover:text-blue-500" target="_blank" :href="`https://${product.link}`">{{ product.link }}</a>
            <p class="va-text-secondary absolute bottom-1 right-1">
              {{ product.date }}
            </p>
            <div class="absolute top-3 right-2 d-flex direction-c">
              <VaButton
                round
                class="mb-2"
                color="primary"
                icon="edit"
                @click="editRow(product)"
              />
              <VaButton
                round
                icon="delete"
                color="danger"
                @click="deleteRow(product)"
              />
        </div>
          </VaCard>
        </div>
      </div>
    </div>
  
    <VaDataTable
      v-else
      class="table-crud"
      :items="products"
      :columns="columns"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      @filtered="filtered = $event.items"
    >
      <template #cell(link)="{ row }">
        <div>
          <a class="underline hover:text-blue-500" target="_blank" :href="`https://${row.rowData.link}`">
            {{ row.rowData.link }}
          </a>
        </div>
      </template>
      <template #cell(description)="{ row }">
        <div class="cursor-pointer hover:text-blue-700" @click="handleDesc(row.rowData.description)">
            {{ row.rowData.description.substring(0,30) }} <span v-if="row.rowData.description.length >=30">...</span>
        </div>
      </template>
      <template #cell(image)="{ row }">
        <div>
          <VaAvatar style="min-width: 50px" :src="`${url}/${row.rowData.image[0]}`" class="min-h-14 min-w-14" />
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
      <template v-if="products.length > 0" #bodyAppend>
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
        <h2>Bajarilgan ish qo'shish</h2>
      </template>
      <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
        Maydonlarni to'liq to'ldirish shart!
      </VaAlert>
      <div class="mt-10">
        <VaForm tag="form" @submit.prevent="handleSubmit">
          <VaInput
            class="col-12"
            v-model="product.title"
            label="Title"
            required
          />
            <VaInput
              v-model="product.link"
              class="mt-3 col-12"
              label="Link"
              required
            />
            <VaInput
              v-model="product.description"
              class="mt-3 col-12"
              label="Description"
              required
            />
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
                Bajarilgan ish rasmini tanlang
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
        { key: "image", sortable: true, width: "150px" },
        { key: "title", sortable: true, width: "120px" },
        { key: "description", sortable: true, width: "300px" },
        { key: "link", sortable: true, width: "200px" },
        { key: "date", sortable: true, width: "150px" },
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
        product: {
          title: "",
          image: "",
          link: "",
          description: "",
        },
        isError: false,
        isUpdated: false,
        img: [],
        isPage: false,
        id:'',
        description:'',
        isDesc: false
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
      products() {
        const productsWithNumbers = this.$store.getters.products.map(
          (product, index) => {
            return {
              ...product,
              N: index + 1,
              date: this.formatDate(product.createdAt),
            };
          }
        );
  
        return productsWithNumbers
      },
    },
    methods: {
      handleDesc(text){
        this.description = text
        this.isDesc = true
      },
      handleFileChange(event) {
        this.image = event.target.files[0];
      },
      handleModal() {
        this.showModal = true;
        this.isUpdated = false;
        this.isError = false
        this.product = {};
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
            this.product.title &&
            this.product.link &&
            this.product.description && this.img.length
          ) {
            const formData = new FormData();
            formData.append("title", this.product.title);
            formData.append("link", this.product.link);
            formData.append("description", this.product.description);
            formData.append("image", this.img[0]);
            this.$store
              .dispatch("postProduct", formData)
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
          if ( this.product.title &&
            this.product.link &&
            this.product.description) {
            this.product.image = this.img
            this.$store.dispatch("editProduct", this.product);
            this.product = {};
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
          .dispatch("getProduct", row._id)
          .then((res) => {
            this.product = res.data
            this.img = res.data.image
            this.id = res.data._id
            this.isUpdated = true;
            this.showModal = true;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      deleteRow(row) {
        this.$store.dispatch("deleteProduct", row._id);
        this.$vaToast.init({
          message: "Malumot o'chirildi",
          color: "success",
          position: "bottom-right",
        });
      },
    },
    mounted() {
      this.$store.dispatch("allProduct");
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