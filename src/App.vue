<template>
  <div id="home">
    <!-- 头部组件 -->
      <header-box :seller="seller"></header-box>
    <div class="tab border-1px">
      <router-link tag="div" class="tab-item" to="/goods" :key>商品</router-link>
      <router-link tag="div" class="tab-item" to="/ratings" :seller="seller">评论</router-link>
      <router-link tag="div" class="tab-item" to="/seller">商家</router-link>
    </div>
    <!-- 路由对应的内容，占位符  并将获取到的数据传给需要使用的组件-->
    <transition name="slide">
      <!-- keep-alive 缓存路由状态 -->
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import header from './components/header/header.vue';
// 引入解析URL方法
import {urlParse} from './common/js/util.js';
export default{
  data() {
    return {
      seller:{
        id:(() => {
          return urlParse().id
        })()
      }
    }
  },
  created() {
    // 获取商家数据
    this.$http.get('/api/seller/?id='+ this.seller.id).then(function (result) {
      result = result.body;
      if(result.errno === 0) {
        //es6 Object.assign() 对象的浅拷贝
        this.seller = Object.assign({},this.seller,result.data);
        console.log(this.seller.id);
      }
    })
  },
  components: {
    "header-box": header
  }
}
</script>
<style lang="less">
  .slide-enter,.slide-leave-to{
    opacity:0;
  }
  .slide-enter-active,.slide-leave-active{
    transition:all 0.4s ease;
  }
  #home{
    .tab{
      display:flex;
      height:40px;
      line-height:40px;
      .tab-item{
        flex:1;
        text-align:center;
        font-size:14px;
        color:rgb(77,85,93);
        &.active{
          color:rgb(240,20,20);
        }
      }
    }
  }
</style>
