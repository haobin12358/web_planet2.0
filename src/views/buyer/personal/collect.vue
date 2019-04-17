<template>
    <div class="m-collect">
      <div class="m-nav">
        <nav-list :navlist="nav_list"  @navClick="navClick"></nav-list>
      </div>
      <div class="m-collect-content">
        <m-circle v-if="nav_list[0].active"></m-circle>

      </div>
    </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import mCircle from '../../../components/common/circle';
    export default {
        name: "collect",
      data(){
          return{
            nav_list:[
              {
                name:'内容',
                value:'',
                active:true
              },
              {
                name:'商品',
                value:'',
                active:false
              }
            ]
          }
      },
      components:{navList,mCircle},
      methods:{
        navClick(index){
          let arr = [].concat(this.nav_list);
          for(let i=0;i<arr.length;i++){
            arr[i].active = false;
          }
          arr[index].active = true;
          arr[index].desc_asc = !arr[index].desc_asc;
          this.nav_list = [].concat(arr);

        }
      }
    }
</script>

<style scoped lang="less">
.m-collect{
  background-color: #fff;
  min-height: 100vh;
  .m-collect-content{
    padding: 0 33px;
  }
}
</style>
