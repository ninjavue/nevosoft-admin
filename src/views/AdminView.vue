<template>
  <VaLayout
    style="height: calc(100vh + 50px)"
    :left="{ absolute: breakpoints.smDown && isSidebarVisible }"
  >
    <template #top>
      <VaNavbar shadowed>
        <template #left>
          <VaButton
            preset="secondary"
            @click="isSidebarVisible = !isSidebarVisible"
          >
          <VaIcon :name="isSidebarVisible ? 'menu_open' : 'menu'" size="large"/>
        </VaButton>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaSidebar v-model="isSidebarVisible">
        <router-link v-for="{ title, icon,link } in menu" :key="icon" :to="`/admin/${link}`">
        <VaSidebarItem id="link">
            <VaSidebarItemContent>
            <VaIcon :name="icon" />
            <VaSidebarItemTitle> {{ title }} </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
      </router-link>
        <VaSidebarItem class="mt-a mb-30" @click="showModal = true">
          <VaSidebarItemContent class="item-content">
            <VaIcon name="logout" />
            <VaSidebarItemTitle> Logout </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
      </VaSidebar>
    </template>

    <template #content>
      <main class="content">
        <VaCard class="card">
          <router-view></router-view>
        </VaCard>
      </main>
    </template>
  </VaLayout>
  <VaModal v-model="showModal" hide-default-actions overlay-opacity="0.2" blur>
    <template #header>
      <h3 class="text-danger">Diqqat <VaIcon name="warning" /></h3>
    </template>
    <div class="mt-8">Tizimdan chiqishni istaysizmi?</div>
    <template #footer>
      <VaButton color="danger" class="mr-2" @click="showModal = false"> Yo'q </VaButton>
      <VaButton @click="handleLogout"> Ha </VaButton>
    </template>
  </VaModal>
</template>

<script>
import { ref } from "vue";
import { useBreakpoint } from "vuestic-ui";

export default {
  setup() {
    const breakpoints = useBreakpoint();
    const isSidebarVisible = ref(true);
    if (window.screen.width < 1024) {
      isSidebarVisible.value = false;
    }
    return {
      breakpoints,
      isSidebarVisible,
    };
  },

  data() {
    return {
      menu: [
        { icon: "dashboard", title: "Dashboard", link: "dashboard" },
        { icon: "list", title: "Buyurtmalar", link: "orders" },
        { icon: "people", title: "Xodimlar", link: "employees" },
        { icon: "settings", title: "Xizmatlar", link: "services" },
        { icon: "tab", title: "Bajarilgan ishlar", link: "product" },
        { icon: "book", title: "Savollar", link: "question" },
        { icon: "person", title: "Admin", link: "admin" },
      ],
      showModal: false,
    };
  },
  methods: {
    handleLogout(){
      this.$cookies.remove('accessToken')
      localStorage.removeItem('adc_token')
      this.showModal = false
      window.location.reload()
    }
  },
};
</script>

<style lang="scss">
@import '../styles/views/dashboard.scss';
</style>
