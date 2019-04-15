<template>
  <!--<div class="m-picker-status" v-if="show_picker">-->
    <mt-popup v-model="show_picker" position="bottom">
      <!--<div class="m-picker-box" >-->
        <p class="m-picker-text">
          <span class="cancel" @click="cancelSave(false)">取消</span>
          <span class="m-picker-btn" @click="pickerSave(false)">确定</span>
        </p>
        <input type="text" v-if="is_search" v-model="input_value" class="m-picker-input" @input="inputChange"/>
        <mt-picker :slots="slots"  @change="onValuesChange" value-key="name"></mt-picker>
      <!--</div>-->
    </mt-popup>

  <!--</div>-->
</template>

<script>
    export default {
        data(){
          return {
            select:'',
            input_value:''
          }
        },
      props:{
          slots:{
            type:Array,
            default:null
          },
          show_picker:{
              type:Boolean,
            default:false
          },
        params:{
            type:String,
            default:''
        },
        is_search:{
            type:Boolean,
            default:false
        }
      },
      methods:{
        onValuesChange(picker, values) {
          // console.log(values)
          this.select= values;
        },
        pickerSave(v){
          this.input_value = '';
          this.$emit('pickerSave','show_picker',v,this.select,this.params);
        },
        cancelSave(v){
          this.input_value = '';
          this.$emit('pickerSave','show_picker',v);
        },
        inputChange(){
          this.$emit('inputChange',this.input_value)
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .m-picker-text{
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    padding: 0 30px;
    span.cancel{
      color: #a4a4a4;
    }
  }
  .m-picker-input{
    border: none;
    width: 90%;
    padding: 0 4%;
    height: 72px;
    line-height: 72px;
    box-shadow: 0 5px 6px rgba(0,0,0,0.16);
  }

</style>
