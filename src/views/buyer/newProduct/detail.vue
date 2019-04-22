<template>
    <div class="m-equipment-detail">

      <div class="m-side-scroll">
        <ul class="m-side-ul">
          <li>
            <img src="/static/images/product/icon-product-sort.png" class="m-icon-sort" alt="">
            <p>推荐分类</p>
          </li>
          <li v-for="(item,index) in icon_list" :class="item.active?'active':''" @click="sideClick(index)">
<!--            <img :src="item.pcpic"  alt="">-->
            <span class="m-ft-24">{{item.pcname}}</span>
          </li>
        </ul>
      </div>
<!--      <h3 class="m-equipment-h3"></h3>-->
      <!--<h3 class="m-equipment-h3">装备分类</h3>-->
      <section class="m-equipment-detail-content">
        <!--搜索-->
        <div class="m-selected-search">
          <div class="m-search-input-box m-flex-start" @click="changeRoute('/searchProduct')">
            <span class="m-icon-search"></span>
          </div>
        </div>
          <div v-if="category_list" v-for="(item,index) in category_list">

            <p class="m-category-name"  v-if="item.subs">
              {{item.pcname}}
            </p>

            <ul class="m-equipment-detail-product" v-if="item.subs">
              <li  v-for="(v,i) in item.subs" @click="changeRoute('/product',v)">
                <img :src="v.pcpic" alt="">
                <span>{{v.pcname}}</span>
              </li>
            </ul>
          </div>
      </section>

    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import axios from 'axios/index';
  import api from '../../../api/api'

  export default {
    name: "detail",
    data(){
      return{
        head_src:null,
        head_name:'',
        category_list:[],
        icon_list:null
    }
    },
    mounted(){
      common.changeTitle('装备单类');
      this.head_src = this.$route.query.head;
      this.head_name = this.$route.query.name;
      this.getCategory();
    },
    beforeRouteEnter (to, from, next){
      if(from.query.last_pcid){
        to.query.pcid  = from.query.last_pcid
      }
      next();
    },
    beforeMount (){
      // if(fromparams.length>0){
      //   let params = JSON.parse(fromparams);
      //   //将url上带回的参数赋值给vue中的data对象,从而实现条件的带回
      //   this.date  = params.date;
      //   this.status = params.status
      //   this.page = params.page;
      // }
    },
    methods:{
      // 跳转页面
      changeRoute(v,item){
        if(item){
          let arr = [].concat(this.icon_list);
          for(let i=0;i<arr.length;i++){
            if(arr[i].active){
              this.$router.push({path: v,query:{pcid:item.pcid,last_pcid:arr[i].pcid}})
            }
          }
        }else{
          this.$router.push({path: v})
        }
      },
      // 获取装备分类下的商品
      getCategoryList(id){
        axios.get(api.category_list,{ params:{ up:id, deep:1}}).then(res => {
          if(res.data.status == 200){
            this.category_list = [].concat(res.data.data);
          }
        })
      },
      // 获取装备信息
      getCategory() {
        axios.get(api.category_list).then(res => {
          if(res.data.status == 200){
            // console.log(res.data.data);
            for(let i=0;i<res.data.data.length;i++){
              res.data.data[i].active = false;
              if(this.$route.query.pcid && this.$route.query.pcid == res.data.data[i].pcid){
                res.data.data[i].active = true;
              }
            }
            if(!this.$route.query.pcid){
              res.data.data[0].active = true;
            }
            this.icon_list = [].concat(res.data.data);
            if(this.$route.query.pcid){
              this.getCategoryList(this.$route.query.pcid);
            }else{
              this.getCategoryList(this.icon_list[0].pcid);
            }
          }
        })
      },
      //装备点击
      sideClick(index){
        if(this.icon_list[index].active){
          return false;
        }
        let arr = [].concat(this.icon_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.icon_list = [].concat(arr);
        this.getCategoryList(this.icon_list[index].pcid);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-equipment-detail{
    background-color: #fff;
    min-height: 100vh;
    position: relative;
    color: #666;
    .m-selected-search{
      width: 610px;
      padding: 0;
      box-sizing: border-box;
      .m-search-input-box{
        height: 60px;
      }
    }
    .m-equipment-h3{
      text-align: left;
      padding: 14px 0 0 33px;
      color: #333;
      margin-top: -35px;
    }
    .m-side-scroll{
      position: absolute;
      width: 150px;
      overflow-y: auto;
      background-color: #fff;
      box-shadow: 5px 0 10px rgba(0,0,0,0.16);
      top: 0;
      min-height: 100vh;
      z-index: 100;
      li{
        padding: 30px 0;
        border-bottom: 1px solid #f2f2f2;
        &.active{
          span{
            display: block;
            width: 99%;
            color: @mainColor;
            border-right: 4px solid @mainColor;
          }
        }
        .m-icon-sort{
          display: inline-block;
          width: 40px;
          height: 40px;
        }
      }
    }

    .m-equipment-detail-content{
        padding: 0 0 50px 150px;
      .m-category-name{
        text-align: left;
        padding: 10px 20px;
      }
        .m-equipment-detail-product{
          .flex-row(flex-start);
          flex-wrap: wrap;
          padding-left: 30px;
          li{
            width: 164px;
            height: 220px;
            background:rgba(255,255,255,1);
            line-height: 63px;
            margin: 0 35px 20px 0;
            /*&:nth-child(3n){
              margin-right: 0;
            }*/
            img{
              display: block;
              width: 100%;
              height: 164px;
            }
          }
        }
      }


  }
</style>
