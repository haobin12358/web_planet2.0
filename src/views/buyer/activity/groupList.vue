<template>
  <div>
    <div class="m-one-group" :class="items.gpstatus == 20?'m-cancel':''" @click="changeRoute('/groupProductDetail',items)" v-for="(items,index) in group_list">
      <img :src="items.prmainpic" class="m-one-group-img" alt="">
      <div class="m-product-info">
        <p class="m-product-title">{{items.prtitle}}</p>
        <p>押金 ¥{{items.gpdeposit}}</p>
        <div class="m-flex-start">
                <span class="m-one-num " :class="item ? 'active':''" v-for="(item,j) in items.numbers">
                 {{ item ? item:'?'}}
                </span>
        </div>
      </div>
      <div class="m-user-box">
        <div class="m-avator-box">
                <span  class="m-avator " :class="item != null ? 'active':''" v-for="(item,j) in items.headers">
                   <img :src="item" alt="">
                </span>
        </div>
        <p class="m-group-btn">{{items.type || '立即加入'}} </p>
      </div>
    </div>
  </div>
    
</template>

<script>
    export default {
        name: "groupList",
      data(){
          return{
            group_list:[],
            page_info:{
              page_num:1,
              page_size:10
            },
            isScroll: true,
            total_count: 0,
            bottom_show: false,
          }
      },
      //离开时记录位置
      beforeRouteLeave (to, from, next) {
        if(to.path.indexOf('Detail') > -1){
          this.$store.state.second_scroll = document.documentElement.scrollTop || document.body.scrollTop;
          this.$store.state.second_data = this._data;
          this.$store.state.second_change = true;
        }else{
          this.$store.state.second_scroll = 0;
          this.$store.state.second_change = false;
        }
        next();
      },
      mounted(){
        if(this.$store.state.second_scroll >0 ||  this.$store.state.second_change){
          for(let a in this.$store.state.second_data){
            this._data[a] = this.$store.state.second_data[a]
          }
          document.documentElement.scrollTop =this.$store.state.second_scroll;
        }else{
          this.getList();             // 获取活动list
        }
      },
      methods:{
          getList(){
            this.$http.get(this.$api.guessgroup_list,{
              params:{
                token:localStorage.getItem('token'),
                option:this.$route.query.option || 'all',
                page_num:this.page_info.page_num,
                page_size: this.page_info.page_size
              }
            }).then(res => {
              if(res.data.status == 200){
                this.isScroll = true;
                if(res.data.data.length > 0) {
                  if(this.page_info.page_num > 1) {
                    this.group_list = this.group_list.concat(res.data.data);
                  }else{
                    this.group_list = res.data.data;
                  }
                  this.page_info.page_num = this.page_info.page_num + 1;
                  this.total_count = res.data.total_count;
                }else{
                  this.group_list = [];
                  this.page_info.page_num = 1;
                  this.total_count = 0;
                }

              }
            })
          },
        //滚动加载更多
        touchMove(e) {
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.group_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                this.getList();
              }
            }
          }
        },
        // 下拉刷新
        loadTop() {
          this.page_info.page_num = 1;
          this.total_count = 0;
          this.bottom_show = false;
          this.getList();
          this.$refs.loadmore.onTopLoaded();
        },
        // 跳转页面
        changeRoute(v,item) {
          this.$router.push({ path: v, query: { ggid: item.ggid }});

        },
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
  .m-one-group{
    padding: 17px 24px;
    border-bottom: 1px solid #F2F2F2;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-start;
    .m-main-color{
      color: @mainColor;
    }
    .m-group-btn{
      color: @mainColor;
      display: inline-block;
      width: 150px;
      height: 40px;
      border: 1px solid @mainColor;
      text-align: center;
    }
    .m-one-group-img{
      display: block;
      width: 120px;
      height: 120px;
      margin-right: 20px;
    }
    .m-product-info{
      height: 120px;
      .flex-col(space-between,flex-start);
      .m-product-title{
        font-size: 28px;
        font-weight: 400;
        width: 380px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .m-one-num{
        display: block;
        background: #F4F4F4;
        border: 1px solid #c1c1c1;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #C1C1C1;
        font-weight: 600;
        font-size: 28px;
        margin-right: 10px;
        &.active{
          background: linear-gradient(180deg,@mainColor 0%,@subColor 100%);
          color: #fff;
          border: 1px solid transparent;
        }
      }
    }
    .m-user-box{
      margin-left: 20px;
      .flex-col(space-between,flex-end);
      height: 120px;
      text-align: right;
      width: 150px;
      .m-avator-box{
        position: relative;
        height: 60px;
        .m-avator{
          position: absolute;
          right: 0;
          top: 0;
          width: 60px;
          height: 60px;
          background-color: #F4F4F4;
          border: 1px solid #c1c1c1;
          border-radius: 50%;
          &:nth-child(2){
            right: 40px;
            z-index: 1;
          }
          &:first-child{
            right: 80px;
            z-index: 2;
          }
          &.active{
            border: 1px solid @mainColor;
          }
          &.m-two{
            &:first-child{
              right: 40px;
              z-index: 2;
            }
            &:nth-child(2){
              right: 0;
              z-index: 1;
            }
          }
          &.m-four{
            &:first-child{
              right: 120px;
              z-index: 3;
            }
            &:nth-child(2){
              right: 80px;
              z-index: 2;
            }
            &:nth-child(3){
              right: 40px;
              z-index: 1;
            }
          }
          img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-block;
          }
        }
      }
    }
    &.m-cancel{
      color: #999 !important;
      .m-product-info{
        .m-one-num{
          background: #C1C1C1 !important;
          color: #fff !important;
          &.active{
            background: #C1C1C1 !important;
            color: #fff !important;
          }
        }
      }
      .m-group-btn{
        color: #999;
        display: inline-block;
        width: 150px;
        height: 40px;
        border: 1px solid #999;
        text-align: center;
      }
    }
  }
</style>
