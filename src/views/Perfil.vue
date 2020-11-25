<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Perfils</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            class="text-xs-center"
            v-model="search"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>
          <a-button type="primary" @click="showModal">
            Adicionar Perfil <a-icon type="plus" />
          </a-button>
        </v-toolbar>
      </template>
    </v-data-table>
    <a-modal
      v-model="visibleAdd"
      :visible="visibleAdd"
      @ok="adicionarPerfil"
      okText="Adicionar"
      cancelText="Cancelar"
      @cancel="cancel()"
      centered
    >
      <!--   -->
      <a-form :form="form" style="padding: 10px;" hideRequiredMark>
        <a-form-item label="Descrição">
          <a-input
            placeholder="Descrição"
            v-model="descricao"
            v-decorator="[
              'descricao',
              {
                rules: [{ required: true, message: 'Informe a descrição.' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Descrição", value: "descricao" },
      ],
      desserts: [],
      descricao: "",
      visibleAdd: false,
      search: "",
      form: this.$form.createForm(this),
    };
  },
  created() {
    this.listarPerfils();
  },
  methods: {
    listarPerfils() {
      const me = this;
      let rota = "/perfils";

      this.axios
        .get(rota, this.configuration)
        .then(function(response) {
          me.desserts = response.data;
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    showModal() {
      this.visibleAdd = true;
    },
    adicionarPerfil(e) {
      const me = this;
      let data = new FormData();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/perfils",
              {
                descricao: this.descricao,
              },
              /* data,*/ this.configuration
            )
            .then((res) => {
              this.visibleAdd = false;
              this.listarPerfils();
              this.cancel();
            });
        }
      });
    },
    cancel() {
      this.form.resetFields();
    },
  },
};
</script>
