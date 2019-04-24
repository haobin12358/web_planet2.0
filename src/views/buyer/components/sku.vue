<template>
  <div class="m-sku" >
    <div class="m-sku-state">
      <span class="m-icon-close" @click="changeModal('show_sku',false)"></span>
      <div class="m-sku-content">
        <div class="m-sku-img-box ">
          <img :src="select_value.skupic"  v-if="select_value" alt="">
          <img :src="change_info.skupic"  v-else-if="change_info" alt="">
          <img :src="product.prmainpic"  v-else alt="">
          <div v-if="select_value">
            <p v-if="isAct &&  select_value.tlsprice" class="m-price">¥{{select_value.tlsprice | money}}</p>
            <p class="m-price" v-else>￥{{select_value.skuprice | money}}</p>
            <p class="m-underline">价格：<s>¥{{product.prlineprice && (product.prlineprice | money)}}</s></p>
            <!--<span class="m-red" v-if="select_value.skustock">￥{{select_value.skuprice}}</span>-->
            <!--<span class="m-ft-26 m-red" v-if="select_value.skustock == 0">库存不足</span>-->
          </div>
          <div v-else>
            <p class="m-price" v-if="product.price_range">￥{{product.price_range | money }}</p>
            <p class="m-price" v-else-if="product.ipprice">{{product.ipprice}}星币</p>
            <p class="m-price" v-else>￥{{product.prprice && (product.prprice | money)}}</p>
            <p class="m-underline">价格：<s>¥{{product.prlineprice && (product.prlineprice | money)}}</s></p>
          </div>
        </div>
        <div class="m-scroll">
          <ul class="m-sku-box">
            <li v-for="(items,index) in product.skuvalue">
              <p>{{items.name}}</p>
              <ul class="m-sku-ul">
                <template  v-for="(item,i) in items.value">
                  <!--v-if="new_arr[index][i]"-->
                  <li v-if="new_arr.length>0 && !new_arr[index][i] "  class="cancel">{{item}}</li>
                  <li v-else :class="item == select[index]?'active':''" @click.stop="skuSelect(index,item)">{{item}}</li>
                </template>
              </ul>
            </li>
          </ul>
          <div class="m-sku-num" v-if="!activity">
            <span>购买数量</span>
            <div class="m-num">
              <span class="m-icon-cut" v-if="num > 1" @click.stop="changeNum(-1)"> - </span>
              <span class="m-icon-cut-sku" v-else>-</span>
              <input type="number" min="1" v-model="num" class="m-num-input" />
              <span class="m-icon-add" @click.stop="changeNum(1)"> +</span>
            </div>
          </div>
          <div class="m-guess-num-box" v-if="guess && select_value">
            <div class="tl">减免金额:</div>
            <div class="m-guess-num">
              <span>猜对一个数字减免：</span>
              <span>{{select_value.skudiscountone}}元</span>
            </div>
            <div class="m-guess-num">
              <span>猜对两个数字减免：</span>
              <span>{{select_value.skudiscounttwo}}元</span>
            </div>
            <div class="m-guess-num">
              <span>猜对三个数字减免：</span>
              <span>{{select_value.skudiscountthree}}元</span>
            </div>
            <div class="m-guess-num">
              <span>猜对四个数字减免：</span>
              <span>{{select_value.skudiscountfour}}元</span>
            </div>
            <div class="m-guess-num">
              <span>猜对五个数字减免：</span>
              <span>{{select_value.skudiscountfive}}元</span>
            </div>
            <div class="m-guess-num">
              <span>猜对六个数字减免：</span>
              <span>{{select_value.skudiscountsix}}元</span>
            </div>
          </div>
        </div>
        <div class="m-sku-btn">
          <span  class="active" v-if="select_value && (select_value.ipsstock &&  select_value.ipsstock > 0 || select_value.skustock &&  select_value.skustock > 0)" @click.stop="sureClick">确 定</span>
          <span v-else>确 定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          select:[],
          select_value:null,
          num:1,
          new_arr:[],
          last_arr:[],
          change_info:null
        }
      },
      props:{
        product:{
          type:Object,
          default:null
        },
        now_select:{
            type:Object,
          default:null
        },
        now_num:{
          type:Number,
          default:1
        },
        activity:{
          type:Boolean,
          default:false
        },
        guess:{
          type:Boolean,
          default:false
        },
        isAct:{
          type:Boolean,
          default:false
        }
      },
      mounted(){
        for(let i in this.product.skuvalue) {
          this.last_arr[i] = this.product.skuvalue[i].value;
          this.skuSelect(-1, '');
        }
        if(this.now_select){
          this.select_value = this.now_select;
          this.select = this.select_value.skuattritedetail;
          this.num = this.now_num;
          this.skuSelect(0, this.select[0]);
        }
        // 单个sku时自动选中
        let a = 0;
        for(let i in this.product.skuvalue) {
          a += this.product.skuvalue[i].value.length;
        }
        if(a == this.product.skuvalue.length) {
          for(let i in this.product.skuvalue) {
            this.skuSelect(i, this.product.skuvalue[i].value[0]);
          }
        }

      },
      methods:{
        //  改变模态框
        changeModal(v,bool){
          this.$emit('changeModal',v,bool)
        },
        //数量改变
        changeNum(v){
          if(v == -1 && this.num ==1){
            return false;
          }
          this.num = this.num + v;
        },
        //判断一个数组里面是否包含另外一个数组
        contrastArr(aa,bb){
            if(!(aa instanceof Array) || !(bb instanceof Array) || ((aa.length < bb.length))) {
              return false;
            }
            //var aaStr = aa.toString();
            /*for(var i = 0; i < bb.length; i++) {
                if(aaStr.indexOf(bb[i]) < 0) return false;
            }*/
            for (let i = 0; i < bb.length; i++) {
              let flag = false;
              for(let j = 0; j < aa.length; j++){
                if(aa[j] == bb[i]){
                  flag = true;
                  break;
                }
              }
              if(flag == false){
                return flag;
              }
            }
            return true;
        },
        //sku选择
        skuSelect(index,item){
          let _arr = [].concat(this.select);
          let change = -1;
          let newArr = [],change_arr = [];
          let ad = [];
          if(index != -1){
            _arr[index] = item;
            this.select = [].concat(_arr);
            ad.push(this.select[index]);
          }
          // for(let i =0;i<this.select.length;i++){
          for(let j=0;j<this.product.skus.length;j++){
            // if(this.product.skus[j].skuattritedetail[i] == this.select[i] && this.product.skus[j].skustock >0){
            //
            // }
            if(item == '' && ((this.product.skus[j].ipsstock && this.product.skus[j].ipsstock >0) || (this.product.skus[j].skustock && this.product.skus[j].skustock >0))){
              newArr.push(this.product.skus[j].skuattritedetail);
              change_arr.push(this.product.skus[j]);
            }
            else if(this.contrastArr(this.product.skus[j].skuattritedetail,ad) &&  ((this.product.skus[j].ipsstock && this.product.skus[j].ipsstock >0) || (this.product.skus[j].skustock && this.product.skus[j].skustock >0))){
              newArr.push(this.product.skus[j].skuattritedetail);
              change_arr.push(this.product.skus[j]);
            }
          }
          this.change_info = change_arr[0];

          let newArr_total = [];
          let arr = [];
          for(let i=0;i<this.product.skuvalue.length;i++){
            newArr_total.push(new Array());
           arr.push(new Array());
          }
          for(let i=0;i<newArr.length;i++){
            for(let j=0;j<newArr[i].length;j++){
              // newArr_total[j].push(newArr[i][j])
              arr[j].push(newArr[i][j])
            }
          }


          // newArr_total = [].concat(arr)
          for(let i=0;i<this.product.skuvalue.length;i++){
            for(let j=0;j<this.product.skuvalue[i].value.length;j++){
              if(arr[i].indexOf(this.product.skuvalue[i].value[j]) == -1){
                newArr_total[i][j] = '';
              }else{
                newArr_total[i][j] = this.product.skuvalue[i].value[j]
              }
            }
          }
         for(let a=0;a<newArr_total.length;a++){
           if(newArr_total[a].indexOf(this.select[a]) == -1){
             this.select[a] = '';
           }
         }
         if(index != -1){
           newArr_total[index] = this.last_arr[index];
         }
          this.new_arr = [].concat(newArr_total);
            this.last_arr = [].concat(newArr_total)
          // }
          if(this.select.length === this.product.skuvalue.length){
            for(let i = 0;i<this.product.skus.length;i++){
              if((JSON.stringify(this.product.skus[i].skuattritedetail) === JSON.stringify(this.select)) && (this.product.skus[i].skuattritedetail.length == this.select.length)){
                this.select_value = this.product.skus[i];
                change = change +1;
              }
            }
          }
          if(change == -1){
            this.select_value = null;
          }
          // console.log(this.new_arr)
        },
      //  确定
        sureClick(){
          this.$emit('sureClick',this.select_value,this.num);
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-sku{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    /*background-color: rgba(0,0,0,0.2);*/
    z-index: 1001;
    transition: opacity .5s;
    .m-sku-state{
      background-color: #fff;
      position: absolute;
      width: 100%;
      height: 990px;
      left: 0;
      bottom:0;
      /*border-radius:50px 50px 0 0;*/
      -webkit-transition: height 0.88s;
      transition: height 0.88s;
      box-sizing: border-box;
      .m-icon-close{
        position: absolute;
        top: 30px;
        right: 30px;
        height: 27px;
        width: 27px;
        padding: 5px;
        background: url("/static/images/product/icon-close.png") no-repeat;
        background-size: 100% 100%;
      }
      .m-sku-content{

        .m-center{
          text-align: center;
          .m-red{
            color: #EF9B2D;
            font-size: 30px;
            font-weight:400;
          }
        }
        .m-sku-img-box{
          padding: 0 30px;
          margin: 30px 0 10px;
          display: flex;
          flex-flow: row;
          align-items: flex-end;
          justify-content: flex-start;
          img{
            display: inline-block;
            width: 180px;
            height: 180px;
            margin-right: 30px;
          }
          .m-price{
            color: #E22300;
            font-size: 32px;
            text-align: left;
          }
          .m-underline{
            color: #C1C1C1;
            font-size: 24px;
            text-align: left;
          }
        }
        .m-scroll{
          height: 450px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 10px 30px;
          color: #000;
          .m-sku-box{
            text-align: left;
            list-style: none;
            padding: 0;
            .m-sku-ul{
              color: #333333;
              display: flex;
              flex-flow: row;
              align-items: center;
              justify-content: flex-start;
              flex-wrap: wrap;
              list-style: none;
              margin: 10px 0 0 0;
              overflow-y: scroll;
              li{
                height: 25px;
                line-height: 28px;
                padding: 8px 40px;
                background-color: #D5D5D5;
                /*border-radius: 30px;*/
                margin-right: 30px;
                margin-bottom: 20px;
                &.active{
                  background-color: @mainColor;
                  color: #ffffff;
                }
                &.cancel{
                  color: #fff;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
        .m-sku-btn{
          margin-top: 53px;
          text-align: center;
          span{
            display: inline-block;
            width: 750px;
            background-color: #d5d5d5;
            height: 62px;
            line-height: 62px;
            font-size: 30px;
            /*border-radius: 10px;*/
            text-align: center;
            &.active{
              color: #ffffff;
              background-color: @mainColor;
            }
          }
        }
      }
    }

  }
</style>
