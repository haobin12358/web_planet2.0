<template>
    <div class="m-followUser">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <ul class="m-user-list" v-if="user_list.length > 0 ">
        <li v-for="(item,index) in user_list">
          <div class="m-flex-start">
            <img :src="item.usheader" class="m-avator" alt="">
            <div>
              <h3 class="m-user-name">
                <span >{{item.usname}}</span>
                <span class="m-user-level">{{item.uslevel_zn}}</span>
              </h3>
              <p class="m-grey">{{item.fens_count}}粉丝</p>
            </div>
          </div>

          <img src="/static/images/newpersonal/icon-follow.png" v-if="select_nav.value == 'follow' && !item.mutual_concern" class="m-user-icon" alt="" @click="cancelClick(index)">
          <img src="/static/images/newpersonal/icon-together.png" v-else-if=" item.mutual_concern" class="m-user-icon" alt="" @click="cancelClick(index)">
          <span class="m-follow-btn" v-else-if="select_nav.value == 'fans' && !item.mutual_concern" @click="followClick(index)">关注</span>
        </li>
      </ul>
      <p v-else class="m-no-data">暂无{{select_nav.name}}</p>
      <bottom-line v-if="bottom_show"></bottom-line>
      <div class="m-modal" v-if="show_modal">
        <div class="m-modal-state">
          <ul>
            <li>
              <img :src="select_user.usheader" class="m-avator" alt="">
              <p class="m-grey">您将不再关注@{{select_user.usname}} ？</p>
            </li>
            <li>
              <p class="m-active" @click.stop="followClick(select_index)">取消关注</p>
            </li>
          </ul>
          <p class="m-cancel" @click="show_modal = false">取消</p>
        </div>
      </div>
    </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import api from '../../../api/api';
  import bottomLine from '../../../components/common/bottomLine';
  import { Toast } from 'mint-ui';
  export default {
    name: "followUser",
    data(){
      return{
        nav_list:[
          {
            name:'关注',
            value:'follow',
            active:true
          },
          {
            name:'粉丝',
            value:'fans',
            active:false
          }
        ],
        page_info:{
          page_num: 1,
          page_size: 20
        },
        user_list:[],
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        select_nav:null,
        show_modal:false,
        select_index:0,
        select_user:null
      }
    },
    components:{navList, bottomLine},
    mounted(){
      this.navClick(this.$route.query.index || 0)
    },
    methods:{
      navClick(index){
        let arr = [].concat(this.nav_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        this.select_nav = arr[index];
        this.page_info.page_num = 1;
        this.bottom_show = false;
        this.getInfo();
      },
      getInfo(type){
        this.$http.get(api.collection_show,{
          params:{
            token:localStorage.getItem('token'),
            showtype:this.select_nav.value,
            page_size:this.page_info.page_size,
            page_num:this.page_info.page_num
          }
        }).then(res => {
          if(res.data.status == 200){
            this.isScroll =true;
            if(res.data.data.length >0){
              if(this.page_info.page_num >1){
                this.user_list =  this.user_list.concat(res.data.data);
              }else{
                this.user_list = res.data.data;
              }
              this.page_info.page_num = this.page_info.page_num + 1;
              this.total_count = res.data.total_count;
            }else{
              this.user_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
            }
          }
        })
      },
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.user_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              this.getInfo();

            }
          }
        }
      },
      cancelClick(index){
        if(this.select_nav.value == 'follow' || this.user_list[index].mutual_concern){
          this.select_user = this.user_list[index];
          this.select_index = index;
          this.show_modal = true;
        }
      },
      followClick(index){
        this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
          uclcollection:this.select_nav.value == 'follow' ?this.user_list[index].uclcollection :this.user_list[index].uclcollector,
          uclcotype:2
        }).then(res => {
          if(res.data.status == 200){
            Toast(
              {
                message: res.data.message,
                duration: 500
              });
            let arr = [].concat(this.user_list);
            if(this.select_nav.value == 'follow'){

                arr.splice(index,1);

              this.show_modal = false;
            }else{
              arr[index].mutual_concern = !arr[index].mutual_concern
            }
            this.user_list = [].concat(arr)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-followUser{
  .m-avator{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .m-user-list{
    li{
      .flex-row(space-between);
      padding: 20px 33px;
      border-bottom: 1px solid #F2F2F2;
      text-align: left;
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
  .m-modal{
    position: fixed;
    bottom: 0;
    top: 0;
    left:0;
    right:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
    z-index: 100;
    .m-modal-state{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      -webkit-transition: height 0.88s;
      transition: height 0.88s;
      ul{
        border-bottom: 10px solid #F4F4F4;
        li{
          padding: 13px 0;
          background-color: #fff;
          text-align: center;
          border-bottom: 1px solid #F2F2F2;
          p.m-active{
            padding: 10px 0;
            color: @mainColor;
            font-size: 28px;
            font-weight: 400;
          }
        }
      }
      .m-cancel{
        padding: 27px 0;
        background-color: #fff;
        font-size: 30px;
      }
    }
  }
}
</style>
