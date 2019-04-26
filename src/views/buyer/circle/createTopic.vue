<template>
    <div class="m-createTopic">
      <div class="m-flex-center m-search-top">
        <div class="m-search-input-box">
          <input type="text" v-model="toc.toctitle" maxlength="20" @input="searchInfo" @keypress="keyPress" placeholder="#请输入需要创建的话题#">
          <span class="m-icon-close" @click="clearInput"></span>
          <span class="m-btn" @click="returnBack">创建</span>
        </div>

        <!--<span @click="changeRoute" v-if="searchContent">搜索</span>-->
      </div>
      <div class="m-result-box">
        <ul>
          <li v-for="(item,index) in result_list" @click="selectClick(item)">
            {{item.toctitle}}
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import { Toast } from 'mint-ui';
    export default {
        name: "createTopic",
       data(){
          return{
            toc:{
              tocid: '',
              toctitle:''
            },
            result_list:[]
          }
       },
      methods:{
        /*清楚搜索内容*/
        clearInput(){
          this.toc= {
            tocid: '',
            toctitle:''
          };
        },
        /*键盘搜索*/
        keyPress(e){
          if(e.keyCode == 13){
              this.returnBack();
          }
        },
        /*返回*/
        returnBack(){
          if(this.toc.tocid){
            this.$router.push({path:'/circle/newEdit',query:{select:JSON.stringify(this.toc)}})
          }else{
            this.createToc();
          }

        },
        //选择
        selectClick(item){
          this.toc = item;
        },
        //创建话题
        createToc(){
          this.$http.post(this.$api.news_topic + '?token=' +localStorage.getItem('token'),{
            toctitle:this.toc.toctitle
          }).then(res => {
            if(res.data.status == 200){
              this.returnBack();
            }else{
              Toast(res.data.message);
            }
          })
        },
        /*搜索结果*/
        searchInfo(){
          if(this.toc.toctitle) {
            this.$http.get(this.$api.news_topic,{
              params:{
                kw:this.toc.toctitle,
              }
            }).then(res => {
              if(res.data.status ==200){
                this.result_list = res.data.data;
              }
            })
          }
        },
      }
    }
</script>

<style scoped lang="less">
  @import '../../../common/css/index';
  .m-createTopic{
    .m-search-top{
      border-bottom: 1px solid @borderColor;
      padding: 20px 33px;

      .m-search-input-box{
        width: 684px;
        background-color: #eee;
        height: 50px;
        position: relative;
        input{
          position: absolute;
          top: 0;
          left:0;
          width: 530px;
          height: 50px;
          line-height: 50px;
          background-color: transparent;
          border: none;
          padding-left: 40px;
          font-size: 21px;
        }
        .m-icon-close{
          position: absolute;
          right: 115px;
          top:12.5px;
          width: 25px;
          height: 25px;
          background: url("/static/images/icon-search-close.png") no-repeat;
          background-size: 100% 100%;
        }
        .m-btn{
          position: absolute;
          right:0;
          top:8.5px;
          border-left: 1px solid #C1C1C1;
          padding: 0 30px;
          color: @mainColor;
        }
      }

    }
    .m-result-box{
      li{
        padding: 20px 40px;
        border-bottom: 1px solid #f2f2f2;
        text-align: left;
        color: #000;
      }
    }
  }

</style>
