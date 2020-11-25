<template>
<v-container>
  <div>
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="margin-top: 30px;"
    >
      <a-col :span="20">
        <v-layout align-start>
          <v-flex>
            <v-data-table
              :headers="headers"
              :items="persons"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Usuário</v-toolbar-title>

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
                    Adicionar usuario <a-icon type="plus" />
                  </a-button>
                </v-toolbar>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <a-tooltip placement="right">
                  <template slot="title">
                    <span>Editar</span>
                  </template>

                  <v-icon @click="editar(item)">
                    mdi-table-edit
                  </v-icon>
                </a-tooltip>
              </template>
            </v-data-table>
          </v-flex>

          <a-modal
            title="Editar Usuário"
            :visible="visible"
            centered
            @cancel="cancelarEdicao"
          >
            <a-form>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item label="Nome">
                    <a-input v-model="editUsuario.nome"></a-input>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Usuário">
                    <a-input v-model="editUsuario.usuario"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>

            <template slot="footer">
              <a-button key="back" @click="cancelarEdicao">
                Cancelar
              </a-button>

              <a-button key="submit" type="primary" @click="alterar">
                Alterar
              </a-button>
            </template>
          </a-modal>
        </v-layout>
      </a-col>
    </a-row>
    <a-modal
      v-model="visibleAdd"
      :visible="visibleAdd"
      @ok="adicionarUsuario"
      okText="Adicionar"
      cancelText="Cancelar"
      @cancel="cancel()"
      centered
    >
      <!--   -->
      <a-form :form="form" style="padding: 10px;" hideRequiredMark>
        <a-form-item label="Nome">
          <a-input
            placeholder="Nome"
            v-model="nome"
            v-decorator="[
              'nome',
              {
                rules: [{ required: true, message: 'Informe o nome.' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Email">
          <a-input
            placeholder="Email"
            v-model="email"
            v-decorator="[
              'email',
              {
                rules: [{ required: true, message: 'Informe o email.' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Senha">
          <a-input
            placeholder="Senha"
            v-model="senha"
            v-decorator="[
              'senha',
              {
                rules: [{ required: true, message: 'Informe a senha.' }],
              },
            ]"
          />
        </a-form-item>
        <!-- <a-form-item label="Confirmação da Senha">
          <a-input
            placeholder="Confirmação da Senha"
            v-model="confi_senha"
            v-decorator="[
              'senha',
              {
                rules: [{ required: true, message: 'Informe a senha.' }],
              },
            ]"
          />
        </a-form-item> -->

        <a-form-item has-feedback label="Perfil">
          <a-select v-model="perfil_usuario" placeholder="Perfil">
            <a-select-option
              v-for="perfil_usuario in listaPerfis"
              :key="perfil_usuario.value"
              :value="perfil_usuario.value"
            >
              {{ perfil_usuario.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      configuration: {
        headers: {
          Authorization: this.$store.state.portarias_token,
        },
      },
      usuario: this.$store.state.usuario,
      dialog: false,
      search: "",
      persons: [],
      headers: [
        { text: "Opções", value: "action", sortable: false },
        { text: "ID", value: "id", sortable: true },
        { text: "Nome", value: "name", sortable: true },
        // { text: "Username", value: "username", sortable: true },
        { text: "Email", value: "email", sortable: false },
        { text: "Perfil", value: "perfil.descricao", sortable: false },
      ],
      editedIndex: -1,
      editUsuario: {
        id: "",
        nome: "",
        usuario: "",
      },
      visibleAdd: false,
      adModal: false,
      adAccion: 0,
      adNome: "",
      adId: "",
      visible: false,
      // MODEL USUARIO
      confi_senha: "",
      senha: "",
      email: "",
      nome: "",
      perfil_usuario: "",
      listaPerfis: [],
      form: this.$form.createForm(this),
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.listarPerfil();
  },

  methods: {
    editar(item) {
      this.visible = true;
      this.editUsuario.nome = item.name;
      this.editUsuario.usuario = item.email;
      this.editUsuario.id = item.username;
      // console.log(this.usuario.username)
    },

    alterar(item) {
      let me = this;
      axios
        .put(
          `/users/${this.usuario.id}`,
          this.editUsuario,
          this.configuration
        )
        .then((res) => {
          console.log(this.editUsuario.id);

          if (res.data.success) {
            this.$message.success("Usuário Atualizado!");
          }
          me.limparEdicao();
          me.listar();
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    cancelarEdicao() {
      this.visible = false;
    },

    limparEdicao() {
      this.visible = false;
      this.formNome = "";
      this.formUsuario = "";
      this.formId = "";
    },

    listar() {
      const me = this;
      let rota = "/users";
      console.log(this.configuration);
      this.axios
        .get(rota, this.configuration)
        .then(function(response) {
          me.persons = response.data;
          console.log("Chegou");
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },

    close() {
      this.limpar();
      this.dialog = false;
    },

    limpar() {
      this.adId = "";
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
    adicionarUsuario(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.axios
            .post(
              "/users",
              {
                name: values.nome,
                username: values.nome,
                email: values.email,
                password: values.senha,
                password_confirmation: values.senha,
                perfil_id: this.perfil_usuario,
              },
              this.configuration,
              console.log(this.perfil_usuario)
            )
            .then(() => {
              this.handleReset();
              this.visible = false;
              this.success();
              this.$emit("addUsuario", 1);
            })
            .catch((e) => {
              // eslint-disable-line no-unused-vars
            });
        } else {
          this.info();
        }
      });
    },

    listarPerfil() {
      let me = this;
      let perfil = [];
      let rota = "/perfils";
      me.axios
        .get(rota, me.configuration)
        .then((res) => {
          perfil = res.data;

          for (let pef of perfil) {
            console.log(pef);
            me.listaPerfis.push({
              text: pef.descricao,
              value: pef.id,
            });
          }
          console.log(this.listaPerfis);
        })
        .catch(function(error) {
          // eslint-disable-line no-unused-vars
        });
    },
  },
};
</script>
