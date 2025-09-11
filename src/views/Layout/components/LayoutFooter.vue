<template>
    <footer class="app_footer">
        <!-- 联系我们 -->
         <div class="contact">
            <div class="container">
                <dl>
                    <dt>客户服务</dt>
                    <dd><i class="iconfont icon-kefu"></i>在线客服</dd>
                    <dd><i class="iconfont icon-question"></i>问题反馈</dd>
                </dl>
                <dl>
                    <dt>关注我们</dt>
                    <dd><i class="iconfont icon-weixin"></i>公众号</dd>
                    <dd><i class="iconfont icon-weibo"></i>微博</dd>
                </dl>
                <dl>
                    <dt>下载APP</dt>
                    <dd class="qrcode"><img src="@/assets/images/qrcode.jpg"></dd>
                    <dd class="download">
                        <span>扫描二维码</span>
                        <span>立马下载APP</span>
                        <a href="#">下载页面</a>
                    </dd>
                </dl>
                <dl>
                    <dt>服务热线</dt>
                    <dd class="hotline">
                        400-0000-000 <small>周一至周日 8:00-18:00</small>
                    </dd>
                </dl>
            </div>
         </div>

    </footer>
</template>


<script setup>

</script>


<style scoped lang="scss">
.app_footer {
    overflow:hidden;
    background-color:#f5f5f5;
    padding-top: 20px;

    .contact {
        background: #fff;

        .container {
            padding: 60px 0 40px 25px;
            display:flex;
        }

        dl {
            height:190px;
            text-align:center;
            padding:0 72px;
            border-right:1px solid #f2f2f2;
            color:#999;

            
        }
    }
}
</style>