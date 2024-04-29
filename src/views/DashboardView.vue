<template>
  <div>
    <h1 class="va-h4 pl-4 text-shadow text-blue-800">Dashboard</h1>
    <div class="row">
      <div class="w-72 p-5" v-for="item,i of dashboard" :key="i">
        <VaCard class="p-4 d-flex justify-center align-center direction-c" :to="`/admin/${item.link}`">
            <h4 class="va-h4">{{ item.title }}</h4>
            <h2 class="va-h2 cnt-shadow">{{ item.count }}</h2>
        </VaCard>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    computed:{
      dashboard(){
        const list =[
          {
            title: "Buyurtmalar",
            count: this.$store.getters.order.length,
            link: 'orders'
          },
          {
            title: "Xizmatlar",
            count: this.$store.getters.type.length,
            link: 'services'
          },
          {
            title: "Xodimlar",
            count: this.$store.getters.employees.length,
            link: 'employees'
          },
          {
            title: "Adminlar",
            count: this.$store.getters.admin.length,
            link: 'admin'
          },
          {
            title: "Savollar",
            count: this.$store.getters.questions.length,
            link: 'question'
          },
          {
            title: "Bajarilgan",
            count: this.$store.getters.products.length,
            link: 'product'
          },
        ]

        return list
      }
    },
    mounted() {
      this.$store.dispatch('allAdmin')
      this.$store.dispatch('allEmploye')
      this.$store.dispatch('allType')
      this.$store.dispatch('allOrder')
      this.$store.dispatch('allQuestion')
      this.$store.dispatch('allProduct')
    },
}
</script>

<style lang="scss">
.direction-c{
  flex-direction: column;
}
.text-shadow{
  text-shadow: 3px 3px 2px rgba(33, 9, 250, 0.6);
}
.cnt-shadow{
  color: rgba(33, 9, 250, 0.6);
  text-shadow: 0 1px 0 #4a99f3, 0 2px 0 #3186f7, 0 3px 0 #1156b1, 0 4px 0 #2c3ff0, 0 5px 0 #174ea0, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
}
</style>