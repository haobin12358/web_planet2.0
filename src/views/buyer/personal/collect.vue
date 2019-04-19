<template>
    <div class="m-collect">
      <div class="m-nav">
        <nav-list :navlist="nav_list"  @navClick="navClick"></nav-list>
      </div>
      <div class="m-collect-content">
        <div >
          <m-circle :index="index" v-for="(item,index) in news_list" v-if="nav_list[0].active && news_list.length > 0" :key="index" :circle="item" @likeClick="likeClick" @clickCollect="clickCollect" @followClick="followClick"></m-circle>

        </div>
        <p v-if="nav_list[0].active && news_list.length == 0" class="m-no-data">暂无收藏的发现内容</p>
        <div class="m-product-list" >

            <product v-if="nav_list[1].active && product_list.length >0" v-for="(item,index) in product_list" :key="index" :product="item"></product>

        </div>
        <p v-if="nav_list[1].active && product_list.length == 0" class="m-no-data">暂无收藏的商品</p>

        <bottom-line v-if="bottom_show"></bottom-line>

      </div>
    </div>
</template>

<script>
  import navList from '../../../components/common/navlist';
  import mCircle from '../../../components/common/circle';
  import product from '../../../components/common/product';
  import bottomLine from '../../../components/common/bottomLine';
  import api from '../../../api/api';
  import {Toast} from'mint-ui';
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
            ],
            product_list:[],
            news_list: [],
            page_info: {
              page_num: 1,
              page_size: 10
            },
            isScroll: true,
            total_count: 0,
            bottom_show: false,
          }
      },
      components:{navList,mCircle,product},
      mounted(){
          this.getNews();
      },
      methods:{
        //  导航点击
        navClick(index){
          let arr = [].concat(this.nav_list);
          for(let i=0;i<arr.length;i++){
            arr[i].active = false;
          }
          arr[index].active = true;
          arr[index].desc_asc = !arr[index].desc_asc;
          this.nav_list = [].concat(arr);
          this.page_info.page_num = 1;
          if(this.nav_list[0].active){
            this.getNews();
          }else if(this.nav_list[1].active){
            this.getProduct();
          }

        },
      //  获取商品列表
        getProduct(){
          let start = this.page_info.page_num;
          this.$http.get(api.product_list,{
            params:{
              page_size:this.page_info.page_size,
              page_num:start,
              token:localStorage.getItem('token'),
              collected: true
            }
          }).then(res => {
            if(res.data.status == 200){
              if(res.data.data.length >0){
                this.page_info.page_num =   this.page_info.page_num +1;
              }else{
                return false;
              }
              if(start >1){
                this.product_list = this.product_list.concat(res.data.data);
              }else{
                this.product_list = res.data.data;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.total_page = res.data.total_page;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        },
      //  获取发现列表
        getNews() {
          this.$http.get(api.get_all_news,{
            params:{
              token:localStorage.getItem('token'),
              page_num:this.page_info.page_num,
              page_size: this.page_info.page_size,
              nestatus:'usual',
              collected:true
            }
          }).then(res => {
            if(res.data.status == 200){
              this.isScroll =true;
              if(res.data.data.length >0){
                for(let i in res.data.data){
                  if(res.data.data[i].netext)
                    res.data.data[i].netext = res.data.data[i].netext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
                }
                if(this.page_info.page_num >1){
                  this.news_list =  this.news_list.concat(res.data.data);
                }else{
                  this.news_list = res.data.data;
                }
                this.page_info.page_num = this.page_info.page_num + 1;
                this.total_count = res.data.total_count;
              }else{
                this.news_list = null;
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
              if(this.news_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                if(this.nav_list[0].active){
                  this.getNews();
                }else if(this.nav_list[1].active){
                  this.getProduct();
                }
              }
            }
          }
        },
        /*点赞*/
        likeClick(i){
          if(!localStorage.getItem('token')){
            Toast('请登录后再试');
            this.$store.state.show_login = true;
            return false;
          }
          this.$http.post(api.favorite_news + '?token='+localStorage.getItem('token'),{
            neid:this.news_list[i].neid,
            tftype:1
          }).then(res => {
            if(res.data.status == 200){
              let arr = [].concat(this.news_list);
              if(arr[i].is_favorite){
                arr[i].favoritnumber = arr[i].favoritnumber-1;
              }else{
                arr[i].favoritnumber = arr[i].favoritnumber+1;
              }
              arr[i].is_favorite = !arr[i].is_favorite;
              this.news_list = [].concat(arr);
            }
          })
        },
        //  收藏
        clickCollect(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.news_list[index].neid,
            uclcotype:1
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.news_list)
              arr[index].collected = !arr[index].collected;
              arr.splice(index,1);
              this.news_list = [].concat(arr)
            }
          })
        },
      //  关注
        followClick(index){
          this.$http.post(api.collection_collect+'?token=' +localStorage.getItem('token'),{
            uclcollection:this.news_list[index].neid,
            uclcotype:2
          }).then(res => {
            if(res.data.status == 200){
              Toast(
                {
                  message: res.data.message,
                  duration: 500
                });
              let arr = [].concat(this.news_list)
              arr[index].follow = !arr[index].follow;
              this.news_list = [].concat(arr)
            }
          })
        }
      }
    }
</script>

<style scoped lang="less">

.m-collect{
  background-color: #fff;
  min-height: 100vh;
  .m-collect-content{
    /*padding: 0 33px;*/
  }
  .m-product-list{
    padding:  24px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .m-no-data{
    text-align: center;
    font-size: 24px;
    color: #C1C1C1;
    padding: 30px ;
  }
}
</style>
