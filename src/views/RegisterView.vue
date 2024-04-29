<template>
  <VaProgressBar v-show="isLoading" indeterminate />
  <div class="register">
    <VaCard>
      <h2 class="mb-10 va-h5 text-blue-800">Nevosoft.uz</h2>
      <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
        Login yoki Parol xato!
      </VaAlert>
      <VaForm @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <VaInput
          stateful
          label="Login"
          v-model="auth.login"
          required
          :rules="[(v) => !!v || 'Login maydonini to`ldiring.']"
        />

        <VaInput
          stateful
          label="Parol"
          type="password"
          v-model="auth.password"
          required
          :rules="[asyncRule, (v) => !!v || 'Parol maydonini to`ldiring.']"
        />

        <VaButton type="submit">
          <VaIcon
            class="mr-2"
            name="loop"
            spin="counter-clockwise"
            v-if="isLoading"
          />
          <span v-else>Kirish</span>
        </VaButton>
      </VaForm>
    </VaCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: {
        login: "",
        password: "",
      },
      isLoading: false,
      isError: false,
    };
  },

  methods: {
    async handleSubmit() {
      this.isLoading = true;
      const self = this;
      setTimeout(() => {
        try {
          if (self.auth.login && self.auth.password) {
            self.$store
              .dispatch("postLogin", self.auth)
              .then((res) => {
                if (res.status == 200) {
                  localStorage.setItem('adc_token', res.data.accessToken + 'addeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
                  self.$cookies.set("accessToken", res.data.accessToken);
                  self.isLoading = false;
                  window.location.href = "/admin";
                  this.$vaToast.init({ message: "Tizimga mofaqiyatli kirdingiz.", color: 'success', position: 'bottom-right' })
                } else {
                  self.auth.login = "";
                  self.auth.password = "";
                  self.isLoading = false;
                  self.isError = true;
                }
              })
              .catch((error) => {
                error
                self.auth.login = "";
                self.auth.password = "";
                self.isLoading = false;
                self.isError = true;
              });
          }
        } catch (error) {
          self.isLoading = false;
          self.isError = true;
        }
      }, 2000);
    },

    async asyncRule(v) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(v.length >= 8 || "Parolda kamida 8 ta belgi bo'lishi kerak");
        }, 3000);
      });
    },
  }
};
</script>


<style lang="scss">
@import "../styles/views/register.scss";
</style>
