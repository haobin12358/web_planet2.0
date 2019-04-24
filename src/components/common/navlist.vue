<template>
  <div :class="isScroll ? 'm-scroll-nav':''">
    <ul class="m-nav-list" v-if="isGet">
      <template v-for="(item,index) in navlist">
        <li :class="item.active?'active':''" @click="navClick(index)">{{item.itname}}
        </li>
      </template>
    </ul>
    <ul class="m-nav-list" v-else-if="isAct">
      <template v-for="(item,index) in navlist">
        <li :class="item.active?'active':''" @click="navClick(index)">{{item.acname}}
        </li>
      </template>
    </ul>
    <ul class="m-nav-list" v-else>
      <template v-for="(item,index) in navlist">
        <li :class="item.active?'active':''" @click="navClick(index)">{{item.name}}
          <span class="m-icon-box" v-if="item.icon">
            <span class="m-icon-asc" v-if="item.desc_asc"></span>
            <span class="m-icon-desc" v-if="!item.desc_asc"></span>
          </span>
          <span v-if="item.count" class="w-icon-green"></span>
        </li>
      </template>
    </ul>
  </div>


</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                name: ''
            }
        },
        props: {
          navlist:{
            type:Array,
            default:null
          },
          isScroll:{
            type:Boolean,
            default:false
          },
          isGet:{
            type:Boolean,
            default:false
          },
          isAct:{
            type:Boolean,
            default:false
          }
        },
        methods: {
          navClick(i){
            this.$emit('navClick',i);
          }
        },
        created() {

        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../../common/css/index";
</style>
