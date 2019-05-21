<template>
  <detail :price="price"></detail>
</template>

<script>
import detail from '../components/common/productDetail';
export default {
  data () {
    return {
      price: 10,
    }
  },
  components:{detail},
  
}
</script>

<style lang="less" scoped>

</style>

