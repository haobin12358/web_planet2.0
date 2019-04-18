<template>
    <div class="m-followUser">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <ul class="m-user-list">
        <li>
          <div class="m-flex-start">
            <img src="" class="m-avator" alt="">
            <div>
              <h3 class="m-user-name">
                <span >123</span>
                <span class="m-user-level">123</span>
              </h3>
              <p class="m-grey">233粉丝</p>
            </div>
          </div>

          <img src="/static/images/newpersonal/icon-follow.png" class="m-user-icon" alt="">
<!--          <span class="m-follow-btn">关注</span>-->
        </li>
        <li>
          <div class="m-flex-start">
            <img src="" class="m-avator" alt="">
            <div>
              <h3 class="m-user-name">
                <span >123</span>
                <span class="m-user-level">123</span>
              </h3>
              <p class="m-grey">233粉丝</p>
            </div>
          </div>

          <img src="/static/images/newpersonal/icon-together.png" class="m-user-icon" alt="">
          <!--          <span class="m-follow-btn">关注</span>-->
        </li>
        <li>
          <div class="m-flex-start">
            <img src="" class="m-avator" alt="">
            <div>
              <h3 class="m-user-name">
                <span >123</span>
                <span class="m-user-level">123</span>
              </h3>
              <p class="m-grey">233粉丝</p>
            </div>
          </div>

<!--          <img src="/static/images/newpersonal/icon-follow.png" class="m-user-icon" alt="">-->
                    <span class="m-follow-btn">关注</span>
        </li>
      </ul>
    </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  export default {
    name: "followUser",
    data(){
      return{
        nav_list:[
          {
            name:'关注',
            value:'',
            active:true
          },
          {
            name:'粉丝',
            value:'',
            active:false
          }
        ]
      }
    },
    components:{navList},
    methods:{
      navClick(index){

      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-followUser{
  .m-user-list{
    li{
      .flex-row(space-between);
      padding: 20px 33px;
      border-bottom: 1px solid #F2F2F2;
      .m-avator{
        display: block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .m-user-name{
        font-size: 28px;
        font-weight: 600;
        .m-user-level{
          font-size: 16px;
          color: @mainColor;
          border: 1px solid @mainColor;
          padding: 2px 5px;
        }
      }
      .m-user-icon{
        display: block;
        width: 50px;
        height: 50px;
      }
      .m-follow-btn{
        display: block;
        font-size: 24px;
        color: @mainColor;
        border: 1px solid @mainColor;
        padding: 2px 20px;
      }
    }
  }
}
</style>
