var Alert = require('sweetalert');

module.exports = {
    _alert: function(title, text, type, cb){
        Alert({
            title: title || '提示信息',
            text: text || '哦，天啊，不是吧，又出问题了',
            type: type || 'info',
            confirmButtonColor: '#fd778e',
            confirmButtonText: '关闭'});
    },
    error: function(text, cb){
        this._alert('出错了', text, 'error', cb);
    },
    info: function(title, text, cb){
        this._alert('提示', text, 'info', cb);
    },
    warning: function(text, cb){
        this._alert('注意', text, 'warning', cb);
    },
    success: function(text, cb){
        this._alert('已完成', text, 'success', cb);
    },
    applySuccess: function(syssn, amount, cb){
        Alert({
            title: '申请成功',
            html: 'true',
            customClass: 'success-alert',
            text: '<div class="alert-content">' +
                    '<div class="apply-note">' + 
                        '已经发起开通申请, 约2～3个小时, 即可开通。扣款成功后, 会给您发送邮件及短信通知。' +
                    '</div>' + 
                    '<div class="dividor"></div>' +
                    '<div class="pay-info">' +
                        '<span class="label">订单: <span>'+syssn+'</span></span>' +
                        '<span class="label">金额: <span>'+amount+'元</span></span>' +
                    '</div>' +
                '</div>',
            type: 'success',
            confirmButtonColor: 'white',
            confirmButtonText: '我知道了'},
            function(){
                cb();
            });
    },
    paySuccess: function(syssn, amount, cb){
        Alert({
            title: '支付成功',
            html: 'true',
            customClass: 'success-alert',
            text: '<div class="dividor pay"></div>' +
                '<div class="alert-content pay-info">' +
                    '<span class="label">订单: <span>'+syssn+'</span></span>' +
                    '<span class="label">金额: <span>'+amount+'元</span></span>' +
                '</div>',
            type: 'success',
            confirmButtonColor: 'white',
            confirmButtonText: '我知道了'},
            function(){
                cb();
            });
    }
};
