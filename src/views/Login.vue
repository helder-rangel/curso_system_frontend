<template>
  <div
    style="
      max-width:500px;
      margin: 20% auto;
      border-radius: 10px;
      padding: 40px;
      border: 1px solid #d9d9d9;
      background: #fff;
      margin-top: 80px;
    "
  >
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'userName',
            {
              rules: [
                { required: true, message: 'Please input your username!' },
              ],
            },
          ]"
          placeholder="Username"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                { required: true, message: 'Please input your Password!' },
              ],
            },
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button">
          Login
        </a-button>
        <!-- Ou
        <router-link to="/registro">
        <a>
          Registre-se Agora!
        </a>
        </router-link> -->
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "normal_login",
    });
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post("auth/login", {
              email: values.userName,
              password: values.password,
            })
            .then((res) => {
              console.log(res.data)
              this.$store.dispatch("guardarToken", res.data.token);
              this.$store.dispatch("guardarUsuario", res.data);
              this.$router.push({ name: "Home" });
            })
            .catch((errorLogin) => {
              if (errorLogin.response.status == 400) {
                this.$message.info(
                  "Usuario não encontrado ou senha incorreta."
                );
              } else if (errorLogin.response.status == 401) {
                this.$message.warning(
                  "O usuário está desativado. Entre em contato com administrador do sistema."
                );
              } else {
                this.$message.info("Erro no Servidor.");
              }
            });
        }
      });
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
