var request = require('superagent');
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
    bindcard: '/subscription/v1/card/bind'
};

var Api = {
    _data: {
        caller: 'h5',
        token: 'a6700fd21c9f4ea79c226d507eb26ff4'
    },
    extend: function(data){
        data = data || {};
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
                that._callback(err, res, cb);
            });
    },
    _callback: function(err, res, cb){
        if(err){
            console.error(err);
        }else{
           cb(res.body); 
        }
    },
    get: function(url, data, cb){
        var that = this;
        request.get(url)
            .query(that.extend(data))
            .end(function(err, res){
                that._callback(err, res, cb);
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
            cb('请在微信中打开');
            return;
        }
        WeixinJSBridge.invoke('getBrandWCPayRequest',data.pay_params,function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok"){
                cb({success: true, error: false});
            }else if(res.err_msg == "get_brand_wcpay_request:cancel") {
                that.close_window();
            }else{
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
       var config = document.head.querySelector('meta[name=config]').getAttribute('content'); 
       return JSON.parse(JSON.parse('"' + config + '"'));
    },
    bindcard: function(data, cb){
        var that = this;
        data.caller = 'h5';
        that.post(URLS.bindcard, that.extend(data), cb);
    }
};

module.exports = Api;
