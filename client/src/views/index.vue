<template>
    <div class="index">
        <head-nav></head-nav>
        <left-menu></left-menu>
        <router-view></router-view>
    </div>
</template>

<script>
import HeadNav from '../components/HeadNav.vue'
import LeftMenu from '../components/LeftMenu.vue'
export default {
    name:'index',
    components:{
        HeadNav,
        LeftMenu
    }
}
</script>

<style scoped>
.index{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
