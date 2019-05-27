<template>
    <div class="m-messageDetail">
      <div class="m-messageDetail-content">
        <div class="m-messageDetail-one">
          <img src="" class="m-avator" alt="" />
          <div class="m-message">
            <span class="m-triangle"></span>
            <div class="m-message-content">12312</div>
          </div>
        </div>
        <div class="m-messageDetail-one m-my">

          <div class="m-message">
            <span class="m-triangle"></span>
            <div class="m-message-content">12312</div>
          </div>
          <img src="" class="m-avator" alt="" />
        </div>
      </div>
      <div class="m-messageDetail-footer">
        <img src="/static/images/circle/icon-pic.png" class="m-icon-img" alt="">
        <input type="text" class="m-input" placeholder="发消息...">
        <span class="m-send" @click="websocketsend">发送</span>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
    export default {
        name: "messageDetail",
      data(){
          return{
            websock:null
          }
      },
      mounted(){
        common.changeTitle('消息');
      },
      created(){
        //页面刚进入时开启长连接
        this.initWebSocket()
      },
      destroyed: function() {
        //页面销毁时关闭长连接
        if(this.websock.readyState === this.websock.OPEN)
          this.websocketclose();
      },
      methods: {
        initWebSocket(){ //初始化websocket

          // const wsuri = process.env.WS_API + "/websocket/threadsocket";//ws地址
          const wsuri = 'wss://pre2.bigxingxing.com:';
          this.websock = new WebSocket(wsuri);
          this.websock.onopen = this.websocketonopen;

          this.websock.onerror = this.websocketonerror;

          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketclose;
          console.log(this.websock.onopen,'sdsd')
        },

        websocketonopen() {
          console.log("WebSocket连接成功");
          this.websocketsend('1232')
        },
        websocketonerror(e) { //错误
          console.log("WebSocket连接发生错误");
        },
        websocketonmessage(e){ //数据接收
          const redata = JSON.parse(e.data);
          //注意：长连接我们是后台直接1秒推送一条数据，
          //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
          //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
          console.log(redata.value);
        },

        websocketsend(agentData){//数据发送
          this.websock.send(agentData);
          console.log(agentData)
        },

        websocketclose(e){ //关闭
          console.log(e,'sdsd')
          // console.log("connection closed (" + e.code + ")");
        },
      },

    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-messageDetail{
  min-height: 100vh;
  background-color: #fafafa;
  .m-messageDetail-content{
    padding: 40px;
    .m-messageDetail-one{
      display: flex;
      flex-flow: row;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 40px;
      width: 100%;
      .m-avator{
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 20px;
      }
      .m-message{
        position: relative;
        padding:  16px 0 0 16px;
        .m-triangle{
          width: 0;
          height: 0;
          border: 16px solid #fff;
          border-left:16px solid transparent;
          border-bottom:16px solid transparent;
          border-top:16px solid transparent;
          position: absolute;
          top:26px;
          left: -16px;
        }
        .m-message-content{
          padding: 5px 20px;
          background-color: #fff;
          font-size:28px;
          font-weight:300;
          line-height:40px;
        }
      }
      &.m-my{
        justify-content: flex-end;
        .m-avator{
          margin-right: 0;
          margin-left: 20px;
        }
        .m-message{
          position: relative;
          padding-right: 16px;
          .m-triangle{
            border: 16px solid #E6E6E6;
            border-right:16px solid transparent;
            border-bottom:16px solid transparent;
            border-top:16px solid transparent;
            position: absolute;
            top:26px;
            right: -16px;
            left: auto;
          }
          .m-message-content{
            background-color: #E6E6E6;
          }
        }
      }
    }
  }
  .m-messageDetail-footer{
    position: fixed;
    bottom:0;
    left: 0;
    padding: 20px;
    background-color: #fff;
    .flex-row(space-between);
    width: 750px;
    box-sizing: border-box;
    .m-icon-img{
      display: inline-block;
      width: 46px;
      height: 46px;
      margin: 0 20px;
    }
    .m-input{
      padding: 0 20px;
      height: 34px;
      line-height: 34px;
      border-left: 1px solid #EFEFEF;
      border-right: 1px solid #EFEFEF;
      width: 510px;
      box-sizing: border-box;
    }
    .m-send{
      color: @mainColor;
      padding: 0 20px;
      font-size: 28px;
      font-weight: 500;
    }
  }
}
</style>
