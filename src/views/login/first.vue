<template>
    <div>
      <mt-swipe :auto="0" @change="handleChange">
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="" class="m-swipe-img" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>

</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                name: ''
            }
        },
        components: {},
        methods: {
          handleChange(index){
            console.log(index)
            if(index == 2){
              this.$router.push('/login')
            }
          }
        },
        created() {

        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";

</style>
