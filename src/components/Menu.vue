<template>
  <div class="btn">
    <router-link to="/">
      <v-btn text large color="white">
        <v-icon left> mdi-school</v-icon>
        <span class="mr-2">TURMAS</span>
      </v-btn>
    </router-link>

      <router-link to="/relatorio">
      <v-btn text large color="white">
        <v-icon left>mdi-file-document</v-icon>
        <span class="mr-2">ATIVIDADES</span>
      </v-btn>
    </router-link>
          <router-link to="/entrega">
      <v-btn text large color="white">
        <v-icon left>mdi-text-box-plus</v-icon>
        <span class="mr-2">Entrega</span>
      </v-btn>
    </router-link>

    <router-link to="/login">
      <v-btn text large color="white" @click="sair">
        <v-icon left>mdi-arrow-right-bold-box</v-icon>
        <span class="mr-2">Sair</span>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
  methods: {
    sair() {
      this.$store.dispatch("sair");
    },
  },
};
</script>

<style lang="css" scoped>
@media screen and (max-width: 880px) {
  .btn .v-btn {
    display: none;
  }
}
</style> scoped>

</style>