<template>
  <div id="teste">
    <v-container>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="lancamentos"
        class="elevation-1"
      >
        <!-- Campo Pesquisa e Filtragem de processos -->
        <!-- <template v-slot:[`item.status`]="{ item }">
          <span v-if="item.status == 'Confirmado'">
            <v-icon style="color: #49D907; ">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </span>
          <span v-if="item.status == 'Pendente'">
            <v-icon style="color: gray; ">
              mdi-checkbox-blank-circle-outline
            </v-icon>
          </span>
          <span v-if="item.status == 'Negativo'">
            <v-icon style="color: #F24607;">
              mdi-close-circle-outline
            </v-icon>
          </span>
        </template> -->

        <template v-slot:[`item.action`]="{ item }">
          <a-tooltip placement="left">
            <template slot="title">
              <span>Excluir</span>
            </template>

            <v-icon
              big
              class="mr-2"
              @click="excluir(item)"
              style="color: #F24607;"
              v-if="usuario.perfil.id !== 3"
            >
              mdi-close-thick
            </v-icon>
          </a-tooltip>

          <a-tooltip placement="left">
            <template slot="title">
              <span>Editar</span>
            </template>

            <v-icon
              v-if="usuario.perfil.id !== 3"
              big
              class="mr-2"
              @click="editar(item)"
            >
              mdi-table-edit
            </v-icon>
          </a-tooltip>
        </template>

        <!-- <template v-slot:[`item.tipo_lancamento`]="{ item }">
          <samp
            style="color: #49D907; font-weight: bold;"
            v-if="item.tipo_lancamento == 'Receita'"
            >Receita</samp
          >
          <samp
            style="color: #F24607; font-weight: bold;"
            v-if="item.tipo_lancamento == 'Despesa'"
            >Despesa</samp
          >
        </template> -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Turmas</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-text-field
              class="text-xs-center"
              v-model="search"
              label="Pesquisa"
              single-line
              hide-details
            ></v-text-field>

            <v-spacer></v-spacer>
            <a-button type="primary" @click="showModal" v-if="usuario.perfil.id !== 3">
              Adicionar Turma <a-icon type="plus" />
            </a-button>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-container>

    <a-modal
      v-model="visibleAdd"
      :visible="visibleAdd"
      @ok="adicionarTurma"
      okText="Adicionar"
      cancelText="Cancelar"
      @cancel="cancel()"
      centered
    >
      <!--   -->
      <a-form :form="form" style="padding: 10px;" hideRequiredMark>
        <a-form-item label="Curso">
          <a-input
            placeholder="Curso"
            v-model="curso"
            v-decorator="[
              'curso',
              {
                rules: [{ required: true, message: 'Informe a curso.' }],
              },
            ]"
          />
        </a-form-item>
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
        <a-form-item label="Periodo">
          <a-input
            placeholder="Periodo"
            v-model="periodo"
            v-decorator="[
              'periodo',
              {
                rules: [{ required: true, message: 'Informe a periodo.' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- EDITAR INFORMAÇÕES -->
    <a-modal
      title="Editar Turma"
      :visible="visible"
      centered
      @cancel="cancelarEdicao"
    >
      <a-form>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="Curso">
              <a-input v-model="editSetor.curso"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Descrição">
              <a-input v-model="editSetor.descricao"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Periodo">
              <a-input v-model="editSetor.periodo"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template slot="footer">
        <a-button key="back" @click="cancelarEdicao">Cancelar</a-button>
        <a-button key="submit" type="primary" @click="alterar"
          >Alterar</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script>
import locale from "ant-design-vue/es/date-picker/locale/pt_BR";
import axios from "axios";

export default {
  data() {
    return {
      configuration: {
        headers: {
          Authorization: this.$store.state.portarias_token,
        },
      },
      check: null,
      host: this.axios.defaults.baseURL,
      usuario: this.$store.state.usuario,
      locale,
      dateFormat: "DD/MM/YYYY",
      search: "",
      lancamentos: [],
      lancamentosUsuario: [],
      expanded: [],
      arquivo_upload: "",
      headers: [
        { text: "Ações", value: "action", sortable: false },
        { text: "Curso ", value: "curso" },
        { text: "Disciplina", value: "descricao" },
        { text: "Periodo", value: "periodo" },
        { text: "Professor", value: "user.name" },
      ],

      uploadVisible: false,
      idUpload: "",
      file: null,

      // Anexos
      anexoVisible: false,
      anexos: [],

      visibleAdd: false,
      form: this.$form.createForm(this),
      numero_processo: "",
      destinatario: "",
      data: "",
      // NOVO
      descricao: "",
      valor: "",
      curso: "",
      periodo: "",
      tipo_l: "",

      visible: false,

      tipo_lancamento: ["Receita", "Despesa"],
      status: ["Pendente", "Confirmado", "Negativo"],
      status_lancamento: "Lançado",
      editSetor: {
        id: "",
        descricao: "",
        valor: "",
        data: "",
        status: "",
      },
      idExcluir: "",
    };
  },

  created() {
    this.listaLancamentos();
    this.listaLancamentosUsuario();
  },

  methods: {
    listaLancamentos() {
      let rota = "/turmas";

      this.axios
        .get(rota, this.configuration)
        .then((res) => {
          this.lancamentos = res.data;
          console.log(res.data);
          // for (let pro of this.lancamentos) {
          //   pro.data = new Date(pro.data).toLocaleString();
          //   pro.valor = pro.valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          // }
          console.log("Usuario" + this.usuario.id);
        })
        .catch((e) => {
          // eslint-disable-line no-unused-vars
        });
    },

    listaLancamentosUsuario() {
      let rota = `lancamentos/usuario/${this.usuario.id}`;

      this.axios.get(rota, this.configuration).then((res) => {
        this.lancamentosUsuario = res.data.lancamentos;
        for (let pro of this.lancamentosUsuario) {
          pro.data = new Date(pro.data).toLocaleString();
          pro.valor = pro.valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      });
    },

    adicionarTurma(e) {
      const me = this;
      let data = new FormData();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/turmas",
              {
                descricao: this.descricao,
                periodo: this.periodo,
                curso: this.curso,
                user_id: this.usuario.id,
              },
              /* data,*/ this.configuration
            )
            .then((res) => {
              this.visibleAdd = false;
              this.listaLancamentos();
              this.listaLancamentosUsuario();
              this.cancel();
            });
        }
      });
    },

    showAnexoModal(anexos) {
      this.anexoVisible = true;
      this.anexos = anexos;
    },

    showModal() {
      this.visibleAdd = true;
    },

    cancel() {
      this.form.resetFields();
    },

    cancelAnexoModal() {
      this.anexoVisible = false;
      this.anexos = [];
    },

    setFile(e) {
      var files = e.target.files;
      this.file = files[0];
    },

    send() {
      let me = this;
      let data = new FormData();

      data.append("anexo", this.file);
      data.append("cumprido", this.check);
      // data.append("observacoes", this.anexoModalObs);

      this.axios
        .post(`/lancamentos/upload/${this.idUpload}`, data, this.configuration)
        .then((res) => {
          if (res.data.success) {
            this.$message.success("Arquivo anexado a movimentação!");
          }
          me.limparEdicao();
          me.cancelUpload();
          me.listaLancamentos();
          me.listaLancamentosUsuario();
          me.handleReset();
        });
    },

    editar(item) {
      this.visible = true;
      this.editSetor.descricao = item.descricao;
      this.editSetor.periodo = item.periodo;
      this.editSetor.curso = item.curso;
      this.editSetor.id = item.id;
    },

    cancelarEdicao() {
      this.visible = false;
    },

    alterar() {
      let me = this;
      me.axios
        .put(`/turmas/${me.editSetor.id}`, me.editSetor, me.configuration)
        .then((res) => {
          if (res.data.success) {
            this.$message.success("Lançamento Atualizado!");
          }
          me.limparEdicao();
          me.listaLancamentos();
          me.listaLancamentosUsuario();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
    limparEdicao() {
      this.visible = false;
      this.formNome = "";
      this.formUsuario = "";
      this.formId = "";
      this.check = "";
      this.arquivo_upload = "";
    },
    handleReset() {
      this.form.resetFields();
    },

    excluir(item) {
      const me = this;

      this.$confirm({
        title: "Deseja excluir esse item?",
        onOk() {
          me.axios
            .delete(`turmas/${item.id}`, me.configuration)
            .then((response) => {
              if (response.data.success) {
                this.$message.success("Lancamentos Removido!");
              }
              me.listaLancamentos();
              me.listaLancamentosUsuario();
            });
        },
      });
    },
  },
};
</script>

<style>
#header {
  display: block;
  background-color: #ffffff;
  max-width: 768px;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  color: #2a3d29;
}

#header img {
  margin: 30px;
}

.home {
  padding: 0 10px;
}

.ant-table-thead > tr > th {
  background: #7fa07d !important;
  font-weight: bold !important;
}

.ant-table-thead
  > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-tbody
  > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-thead
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td,
.ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
  background: #eaf9ec !important;
}

.ant-table-title {
  background: #6b8669;
}

.ant-btn:hover,
.ant-btn:focus {
  color: #7fa07d !important;
  border-color: #7fa07d !important;
}

.ant-btn-primary {
  color: #fff !important;
  background-color: #7fa07d !important;
  border-color: #6b8669 !important;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  color: #fff !important;
  background-color: #a4c3a3 !important;
  border-color: #7fa07d !important;
}
</style>
