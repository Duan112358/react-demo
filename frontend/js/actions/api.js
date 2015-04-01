var request = require('superagent');
var store = require('./store');

var datalist = [{
    avatar: '/static/img/avatar1.png',
    name: '陈军建',
    id: 123,
    orders_count: 3754,
    rating: 4.6,
    desc: '从业29年，经验丰富',
    detail: '陈师傅在地沟油界工作29年，有多年的地沟油采、榨、滤、销经验。',
    quota: '“只有你没想到的，没有我弄不到的。”',
    bg: '/static/img/bg1.png',
    product: {
        name: '绿色纯正地沟油',
        price: 0.1,
        img: '/static/img/p1.png',
        desc: '本品采集自华北高端餐厅残余食物，榨取每一滴油前，我们都会进行精心的筛选，只保留能榨油的部分，用心还原出绿色纯正地沟油，保证每一滴油的质量！'
    }
}, {
    avatar: '/static/img/avatar2.png',
    name: '呼延策',
    id: 23412,
    orders_count: 4216,
    rating: 4.5,
    desc: '食品安全高材生',
    detail: '呼延同学毕业于世界某知名大学食品安全专业，有多年地沟油提纯经验。',
    quota: '“愿每个人都能用上放心地沟油！”',
    bg: '/static/img/bg2.png',
    product: {
        name: '顶级初榨地沟油',
        price: 0.1,
        img: '/static/img/p2.png',
        desc: '本品采集自华北高端餐厅残余食物，榨取每一滴油前，我们都会进行精心的筛选，只保留能榨油的部分，用心还原出绿色纯正地沟油，保证每一滴油的质量！'
    }
}, {
    avatar: '/static/img/avatar3.png',
    name: '迪小玲',
    id: 3141,
    orders_count: 7899,
    rating: 4.8,
    desc: '精细打算有性价比',
    detail: '迪女士在地沟油界工作十余年，有丰富的采购经验，擅长成本控制。',
    quota: '“好油需要善于发现的眼睛。”',
    bg: '/static/img/bg3.png',
    product: {
        name: '有机健康地沟油',
        price: 0.1,
        img: '/static/img/p3.png',
        desc: '本品原料采集自一百余家合作餐厅，通过高级萃取技术和过滤技术，还原出每一滴油本来澄澈若水的模样，适合家庭或小型餐馆使用。'
    }
}, {
    avatar: '/static/img/avatar4.png',
    name: '吴赐仁',
    id: 521,
    orders_count: 9999,
    rating: 4.9,
    desc: '身份神秘，无油不打',
    detail: '吴先生参与地沟油国际贸易多年，经营涵盖从精品到大众品牌所有地沟油。',
    quota: '“出售92年拉非陈年地沟油，价格面议”',
    bg: '/static/img/bg4.png',
    product: {
        name: '原味调和地沟油',
        price: 0.1,
        img: '/static/img/p4.png',
        desc: '本品勾兑自吴先生经营的地沟油单品，既有顶级初榨产品的口感，同时也保持了较低的价位，适合大批量采购却又成本不足的客户，同时附赠会员'
    }
}];

var Api = {
    urls: {
        login: '/wap/login',
        checkout: '/wap/checkout',
        wxConfig: '/wxconfig'
    },
    post: function(url, data, cb) {
        //data = JSON.stringify(data);
        request.post(url)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            .end(cb);
    },
    getlist: function(cb) {
        cb(datalist);
    },
    checkout: function(data, cb) {
        this.post(this.urls.checkout, data, cb);
    },
    login: function(data, cb) {
        this.post(this.urls.login, data, cb);
    },
    cache: function(key, value) {
        if (value) {
            store.set(key, value);
        } else {
            return store.get(key);
        }
    },
    isweixin: function(){
        var agent = navigator.userAgent.toLowerCase();
        return agent.indexOf('micromessenger') !== -1;
    },
    share: function(cb) {
        var that = this;
        request.get(that.urls.wxConfig + '?url=' + window.location.href)
            .send({
                url: location.href
            })
            .end(function(err, res) {
                console.log(err, res);
                if (!err) {
                    var resp = JSON.parse(res.text);
                    if (resp.respcd == '0000') {
                        resp.data.jsApiList = [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo'
                        ];
                        console.log(resp.data);
                        if (window.wx) {
                            resp.data.debug = true;
                            wx.config(resp.data);
                            var share_data = {
                                title: '滴滴打油获BAT两亿美元巨额融资',
                                link: 'http://mp.weixin.qq.com/s?__biz=MzA4NTA3OTc2OA==&mid=203512253&idx=1&sn=c29b40813457751113d42f1afdec5d27&scene=1&key=0ce8fa93c80e41c517e785b3623377a804ca82810e48a1ff00c05143a5c95feaede45796256d7557512847a3bfba6af7&ascene=0&uin=MjgxMTg3ODQ2MQ%3D%3D&devicetype=iMac+MacBookPro10%2C2+OSX+OSX+10.10.2+build(14C109)&version=11020012&pass_ticket=72XuKLw7RYGoboF7uc2GikHOHHEWnQGmTtlLXia2Gzx6C%2FWRlUbgqBEqW%2FFVk9Gr',
                                desc: '滴滴打油豪掷1亿人民币叫板滴滴打车，以1毛1公升跳楼价让大家体验滴滴打油，直到滴滴打车停止补贴！',
                                imgUrl: location.host + '/static/img/dayou.jpg'
                            };

                            wx.ready(function() {
                                // 2. 分享接口
                                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                                wx.onMenuShareAppMessage(share_data);
                                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                                wx.onMenuShareTimeline(share_data);
                                // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
                                wx.onMenuShareQQ(share_data);
                                // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
                                wx.onMenuShareWeibo(share_data);
                            });
                        }
                    }

                }
            })
    }
};

module.exports = Api;
