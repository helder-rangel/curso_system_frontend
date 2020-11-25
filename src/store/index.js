import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
    key: 'vuex',
    storage: window.localStorage,
    reducer: function (state) {
        return {
            portarias_token: state.portarias_token,
            usuario: state.usuario
        }
    }
})

export default new Vuex.Store({
    plugins: [vuexPersist.plugin],

    state: {
        portarias_token: null,
        usuario: null,
    },

    mutations: {
        setToken(state, token){
            state.portarias_token = token;
        },

        setUsuario(state, usuario){
            state.usuario = usuario;
        },
    },

    actions: {
        guardarToken({commit}, token){
            commit('setToken', token)            
            localStorage.setItem('portarias_token', token)
        },

        guardarUsuario({commit}, usuario){
            commit('setUsuario', usuario)
            localStorage.setItem('usuario', usuario)
        },
        
        sair({commit}){
            commit("setToken", null);
            commit("setUsuario", null);
            localStorage.removeItem('portarias_token');
        }
    },
})
