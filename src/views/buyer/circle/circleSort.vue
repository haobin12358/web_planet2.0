<template>
    <div class="m-circleSort">
     <section>
       <div class="m-sort-title">
         <span>我的分类</span>
         <div class="m-flex-end">
           <span class="m-edit" v-if="!isEdit" @click="isEdit = true">编辑</span>
           <span class="m-edit" v-else @click="doSelect">完成</span>
           <img src="/static/images/product/icon-close.png" class="m-icon" alt="" @click="changeRoute">
         </div>
       </div>

       <ul class="m-sort-ul">
         <li v-for="(item,index) in my_label" :class="item.active?'active':''">
           <span>{{item.itname}}</span>
           <img src="/static/images/circle/icon-circle-close.png" v-if="isEdit && item.itid != 'mynews'" @click="deleteClick(index)" class="m-circle-close" alt="">
         </li>
       </ul>
     </section>
      <section>
        <div class="m-sort-title">
          <span>添加分类</span>
        </div>
        <ul class="m-sort-ul m-cancel">
          <li v-for="(item,index) in all_label">
            <span @click="addClick(index)"> {{item.itname}}</span>
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
            isEdit:false,
            my_label:[],
            all_label:[]
          }
      },
      mounted(){
         this.getMy();
      },
      methods:{
        changeRoute(){
          this.doSelect('关闭');
        },
        //点击删除
        deleteClick(index){
          this.my_label[index].active = false;
          this.all_label.push(this.my_label[index])
          this.my_label.splice(index,1);
        },
        //点击添加分类
        addClick(index){
          this.all_label[index].active = true;
          this.my_label.push(this.all_label[index]);
          this.all_label.splice(index,1);
        },
      //  获取我的分类
        getMy(){
          this.$http.get(this.$api.items_list, { params: { ittype:10,token:localStorage.getItem('token'),option:1}}).then(res => {
            if(res.data.status == 200){
                this.my_label = [].concat(res.data.data.my_item);
                for(let i in this.my_label){
                  this.my_label[i].active = false;
                }
              this.all_label = [].concat(res.data.data.candidate_item);
              for(let i in this.all_label){
                this.all_label[i].active = false;
              }
            }
          })
        },
        doSelect(item){
          let arr = [];
          for(let i in this.my_label){
            arr.push(this.my_label[i].itid);
          }
          this.$http.post(this.$api.choose_category + '?token=' +localStorage.getItem('token'),{
            itids:arr
          }).then(res => {
            if(res.data.status == 200){
              if(item == '关闭')
                this.$router.go(-1);
              else
                this.isEdit = false;
            }
          })
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
      span{
        display: inline-block;
        width: 150px;
        height: 60px;
        line-height: 60px;
        margin: 0 20px 17px 0;
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
        white-space:nowrap;
      }
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
        top: -5px;
        right: -5px;
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
