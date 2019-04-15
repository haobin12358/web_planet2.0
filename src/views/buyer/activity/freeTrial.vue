<template>
  <div class="m-freeTrial">
    免费试用
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
      common.changeTitle('免费试用');
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-freeTrial {

  }
</style>
