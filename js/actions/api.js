var request = require('superagent');
var Alert = require('./alert');
var store = require('./store');

var URLS = {
    // token, caller=web
    areacities: '/util/v1/areacities',
    // token, caller=web
    headbanks: '/util/v1/headbanks',
    // token, caller=web, cityid, headbankid
    branchbanks: '/util/v1/branchbanks',
    // token, caller=web, q={5,9}
    cardsinfo: '/util/v1/cardsinfo',
    prepay: '/subscription/v1/plan/pay',
    //card_user,card_no,idnumber,issuerbank,brchbank_name
    bindcard: '/subscription/v1/card/bind',
    notify: '/subscription/v1/weixin/notify'
};

var Api = {
    _data: {},
    extend: function(data){
        data = data || {};
        if(!this._data.caller){
            this.get_config();
        }
        data.caller = data.caller || this._data.caller;
        data.token = this._data.token;
        return data;
    },
    post: function(url, data, cb) {
        //data = JSON.stringify(data);
        var that = this;
        request.post(url)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            .end(function(err, res){
                that._callback(res, cb);
            });
    },
    _callback: function(res, cb){
        if(res.status >= 400){
           Alert.error(res.status + ', 出错了...');
        }else{
           cb(res.body); 
        }
    },
    get: function(url, data, cb){
        var that = this;
        request.get(url)
            .query(that.extend(data))
            .end(function(res){
                that._callback(res, cb);
            });
    },
    get_areacities: function(cb) {
        this.get(URLS.areacities, {}, cb); 
    },
    get_headbanks: function(cb) {
        this.get(URLS.headbanks, {}, cb); 
    },
    get_branchbanks: function(data, cb) {
        this.get(URLS.branchbanks, data, cb); 
    },
    get_cardsinfo: function(data, cb) {
        this.get(URLS.cardsinfo, data, cb); 
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
    weixinpay: function(data, cb){
        var that = this;
        if(!that.isweixin()){
            cb({error: '请在微信中打开'});
            return;
        }
        WeixinJSBridge.invoke('getBrandWCPayRequest',data.pay_params,function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok"){
                that.notify({order_id:data.order_id});
                cb({success: '支付成功'});
            }else if(res.err_msg == "get_brand_wcpay_request:cancel") {
                cb({error: '支付已取消'})
            }else{
                Alert.error(res.err_msg);
                cb({error: '微信系统繁忙'});
            }
        });
    },
    close_window: function(){
        if(this.isweixin()){
            WeixinJSBridge.invoke('closeWindow', {}, function(res){});
        }else{
            window.close();
        }
    },
    prepay: function(data, cb){
        var that = this;
        that.post(URLS.prepay, data, cb);
    },
    get_config: function(){
       if(!this._data.caller){
           var config = document.head.querySelector('meta[name=config]').getAttribute('content'); 
           var static_url = document.head.querySelector('meta[name=static]').getAttribute('content'); 
           this._data = JSON.parse(JSON.parse('"' + config + '"'));
           this._data.static_url = static_url;
       }

       return this._data;
    },
    bindcard: function(data, cb){
        var that = this;
        that.post(URLS.bindcard, that.extend(data), cb);
    },
    notify: function(data){
       this.get(URLS.notify, data);     
    }
};

module.exports = Api;
