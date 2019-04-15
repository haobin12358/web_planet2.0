<template>
  <div class="m-newcomer">
    新人礼包
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';

  export default {
    data() {
      return {
        name: '',

      }
    },
    components: {},
    methods: {

    },
    mounted() {
      common.changeTitle('新人礼包');
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-newcomer {

  }
</style>
