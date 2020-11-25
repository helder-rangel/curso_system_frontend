<template>
  <v-container>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="atividades"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Entrega Atividade</v-toolbar-title>

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
            Adicionar Nova Entrega <a-icon type="plus" />
          </a-button>
        </v-toolbar>
      </template>

      <!-- ADICIONAR ATIVIDADE -->
      <template v-slot:[`item.link`]="{ item }">
        <a-tooltip placement="top">
          <template slot="title">
            <span>Atividade</span>
          </template>
          <a-button size="small" :href="'//' + item.link" target="_blank">
            <a-icon type="download" />
          </a-button>
        </a-tooltip>
      </template>
    </v-data-table>

    <!-- MODAL EDITAR E ADICIONAR -->
    <a-modal
      v-model="visibleAdd"
      :visible="visibleAdd"
      @ok="adicionarAtividade"
      okText="Adicionar"
      cancelText="Cancelar"
      @cancel="cancel()"
      centered
    >
      <!--   -->
      <a-form :form="form" style="padding: 10px;" hideRequiredMark>
        <a-form-item label="Link">
          <a-input
            placeholder="Link"
            v-model="link"
            v-decorator="[
              'link',
              {
                rules: [{ required: true, message: 'Informe o link.' }],
              },
            ]"
          />
        </a-form-item>

        <a-form-item has-feedback label="Atividade">
          <a-select
            v-model="turma_atividade"
            placeholder="Atividade"
            v-decorator="[
              'turma',
              {
                rules: [{ required: true, message: 'Informe a atividade.' }],
              },
            ]"
          >
            <a-select-option
              v-for="turma_atividade in listagemTurmas"
              :key="turma_atividade.value"
              :value="turma_atividade.value"
            >
              {{ turma_atividade.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      headers: {
        Authorization: this.$store.state.portarias_token,
      },
      usuario: this.$store.state.usuario,
      search: "",
      atividades: [],
      turmas: [],
      listagemTurmas: [],
      visibleAdd: false,
      form: this.$form.createForm(this),
      headers: [
        { text: "Atividade", value: "atividade.descricao" },
        { text: "Aluno", value: "user.name" },
        { text: "Data Entrega", value: "updated_at" },
        { text: "Link", value: "link" },
      ],
      link: "",
      turma_atividade: "",
      visible: false,
    };
  },
  created() {
    this.listarAtividades();
    this.listar_Atividades();
  },
  methods: {
    listarAtividades() {
      let rota = "/entrega_atividades";

      this.axios.get(rota).then((res) => {
        this.atividades = res.data;
        for (let pro of this.atividades) {
          pro.updated_at = new Date(pro.updated_at).toLocaleDateString();
        }
      });
    },

    adicionarAtividade(e) {
      const me = this;
      let data = new FormData();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/entrega_atividades",
              {
                link: this.link,
                atividade_id: this.turma_atividade,
                user_id: this.usuario.id,
              },
              this.configuration
            )
            .then((res) => {
              this.visibleAdd = false;
              this.listarAtividades();
              this.cancel();
            });
        }
      });
    },

    listar_Atividades() {
      let rota = "/atividades";
      let me = this;
      let turma = [];
      me.axios.get(rota).then((res) => {
        turma = res.data;
        console.log(res.data);
        for (let tur of turma) {
          console.log(tur);
          if (tur.status != false) {
            me.listagemTurmas.push({
              text: tur.descricao,
              value: tur.id,
            });
          }
        }
      });
    },

    showModal() {
      this.visibleAdd = true;
    },

    cancel() {
      this.form.resetFields();
    },

    cancelarEdicao() {
      this.visible = false;
    },

    limparEdicao() {
      this.visible = false;
    },
  },
};
</script>
