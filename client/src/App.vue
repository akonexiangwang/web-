<template>
  <div id="app" :class="$store.getters.user.id === undefined ? 'centerIn' : ''">
    <router-view></router-view>
  </div>
</template>

<script>
//  import request from '../network/request'
// import qs from 'qs'
import Main from "./views/Main.vue";
import jwt_decode from "jwt-decode";
export default {
  name: "app",
  components: {
    Main,
  },
  created() {
    if (localStorage.eleToken) {
      const decoded = jwt_decode(localStorage.eleToken);
      //存储到vuex中
      this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded));
      this.$store.dispatch("setUser", decoded);
    }
  },

  methods: {
    //判断decoded是否为空
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  height: 100vh;
}

.centerIn {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
