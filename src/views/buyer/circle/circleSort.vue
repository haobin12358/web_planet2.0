<template>
    <div class="m-circleSort">
     <section>
       <div class="m-sort-title">
         <span>我的分类</span>
         <div class="m-flex-end">
           <span class="m-edit" v-if="!isEdit" @click="isEdit = true">编辑</span>
           <span class="m-edit" v-else @click="isEdit = false">完成</span>
           <img src="/static/images/product/icon-close.png" class="m-icon" alt="" @click="changeRoute">
         </div>
       </div>

       <ul class="m-sort-ul">
         <li>
           <span>活动</span>
           <img src="/static/images/circle/icon-circle-close.png" v-if="isEdit " class="m-circle-close" alt="">
         </li>
         <li>
           <span>活动</span>
           <img src="" alt="">
         </li>
         <li>
           <span>活动</span>
           <img src="" alt="">
         </li>
         <li>
           <span>活动</span>
           <img src="" alt="">
         </li>
         <li>
           <span>活动</span>
           <img src="" alt="">
         </li>
       </ul>
     </section>
      <section>
        <div class="m-sort-title">
          <span>添加分类</span>

        </div>

        <ul class="m-sort-ul m-cancel">
          <li>
            <span>活动</span>

          </li>
          <li>
            <span>活动</span>

          </li>
          <li>
            <span>活动</span>
            <img src="" alt="">
          </li>
          <li>
            <span>活动</span>
            <img src="" alt="">
          </li>
          <li>
            <span>活动</span>
            <img src="" alt="">
          </li>
        </ul>
      </section>
    </div>
</template>

<script>
    export default {
        name: "circleSort",
      data(){
          return{
            isEdit:false
          }
      },
      methods:{
        changeRoute(){
          this.$router.go(-1);
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-circleSort{
  width: 100%;
  height: 100vh;
  background-color: #fff;
  padding: 0 42px 0 48px;
  color: #666;
  box-sizing: border-box;
  .m-sort-title{
    .flex-row(space-between);
    padding: 20px 0;
    .m-icon{
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-left: 40px;
    }
    .m-edit{
      color: @mainColor;
    }
  }
  .m-sort-ul{
    .flex-row(flex-start);
    flex-wrap: wrap;
    li{
      position: relative;
      width: 150px;
      height: 60px;
      line-height: 60px;
      background-color: #EBEBEB;
      color: #000;
      margin: 0 20px 17px 0;
      &:nth-child(4n){
        margin-right: 0;
      }
      &.active{
        color: @mainColor;
      }
      .m-circle-close{
        position: absolute;
        width: 20px;
        height: 20px;
        top: -10px;
        right: -10px;
      }
    }
    &.m-cancel{
      li{
        color: #666;
      }
    }
  }
}
</style>
