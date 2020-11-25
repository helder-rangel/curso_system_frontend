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
          <v-toolbar-title>Atividades</v-toolbar-title>

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
            Adicionar Atividade <a-icon type="plus" />
          </a-button>
        </v-toolbar>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <samp style="color: #49D907; font-weight: bold;" v-if="item.status == 1"
          >Atividade Disponivel</samp
        >
        <samp style="color: #F24607; font-weight: bold;" v-if="item.status == 0"
          >Atividade Indisponivel</samp
        >
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <!-- <a-tooltip placement="left">
          <template slot="title">
            <span>Excluir</span>
          </template>

          <v-icon
            big
            class="mr-2"
            @click="excluir(item)"
            style="color: #F24607;"
          >
            mdi-close-thick
          </v-icon>
        </a-tooltip> -->

        <a-tooltip placement="left">
          <template slot="title">
            <span>Editar</span>
          </template>

          <v-icon big class="mr-2" @click="editar(item)" v-if="usuario.perfil.id !== 3">
            mdi-table-edit
          </v-icon>
        </a-tooltip>
      </template>

      <!-- ADICIONAR ATIVIDADE -->
      <template v-slot:[`item.link`]="{ item }">
        <a-tooltip placement="top">
          <template slot="title">
            <span>Atividade</span>
          </template>
          <a-button
            v-if="item.status == 1"
            size="small"
            :href="'//' + item.link"
            target="_blank"
          >
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
        <a-form-item label="Descricao">
          <a-input
            placeholder="Descricao"
            v-model="descricao"
            v-decorator="[
              'descricao',
              {
                rules: [{ required: true, message: 'Informe a descricao.' }],
              },
            ]"
          />
        </a-form-item>
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

        <a-form-item has-feedback label="Disciplina">
          <a-select
            v-model="turma_atividade"
            placeholder="Disciplina"
            v-decorator="[
              'turma',
              {
                rules: [{ required: true, message: 'Informe a disciplina.' }],
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
            <a-form-item label="Descricao">
              <a-input v-model="editAtividade.descricao"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="Status">
              <!-- <a-input v-model="editAtividade.status"></a-input> -->
              <a-select v-model="editAtividade.status" placeholder="Perfil">
                <a-select-option value="1">
                  Disponivel
                </a-select-option>
                <a-select-option value="0">
                  Indisponivel
                </a-select-option>
              </a-select>
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
        { text: "Ações", value: "action" },
        { text: "Descrição", value: "descricao" },
        { text: "Status", value: "status" },
        { text: "Professor", value: "user.name" },
        { text: "Turma", value: "turma.descricao" },
        { text: "Link", value: "link" },
      ],
      link: "",
      descricao: "",
      turma_atividade: "",
      visible: false,
      // checked: "",
      editAtividade: {
        id: "",
        descricao: "",
        status: "",
      },
      // status_atividade: ["Disponivel", "Indisponivel"],
    };
  },
  created() {
    this.listarAtividades();
    this.listarTurmas();
  },
  methods: {
    listarAtividades() {
      let rota = "/atividades";

      this.axios.get(rota).then((res) => {
        this.atividades = res.data;
      });
    },

    adicionarAtividade(e) {
      const me = this;
      let data = new FormData();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/atividades",
              {
                descricao: this.descricao,
                link: this.link,
                status: 1,
                turma_id: this.turma_atividade,
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

    listarTurmas() {
      let rota = "/turmas";
      let me = this;
      let turma = [];
      me.axios.get(rota).then((res) => {
        turma = res.data;
        console.log(res.data);
        for (let tur of turma) {
          console.log(tur);
          me.listagemTurmas.push({
            text: tur.descricao,
            value: tur.id,
          });
        }
      });
    },

    showModal() {
      this.visibleAdd = true;
    },

    cancel() {
      this.form.resetFields();
    },
    editar(item) {
      this.visible = true;
      this.editAtividade.descricao = item.descricao;
      this.editAtividade.status = item.status;
      this.editAtividade.id = item.id;
    },

    cancelarEdicao() {
      this.visible = false;
    },

    alterar() {
      let me = this;
      me.axios
        .put(
          `/atividades/${me.editAtividade.id}`,
          me.editAtividade,
          me.configuration
        )
        .then((res) => {
          this.$message.success("Atividade Atualizada!");
          me.limparEdicao();
          me.listarAtividades();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    limparEdicao() {
      this.visible = false;
    },
    abrirAtividade(item) {
      console.log(item);
      window.open(item);
    },
  },
};
</script>
