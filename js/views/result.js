var React = require('react');
var {Link, State, Navigation, RouteHandler } = require('react-router');
var Api = require('../actions/api');

var Result = React.createClass({
    mixins: [State, Navigation, Api],
    shareWX: function(){
        var that = this;
        var sharing = that.state.sharing;
        that.setState({
            sharing: !sharing
        });
    },
    getInitialState: function(){
        var state = this.getquery();
        state.sharing = false;
        state.isweixin = this.isweixin();
        return state;
    },
    componentDidMount: function(){
        this.share();
    },
    getquery: function(){
        var search = location.hash.substr(location.hash.indexOf('?') + 1);
        return search.split('&').reduce(function(result, item) {
            values = item.split('=');
            result[values[0]] = values[1];
            return result;
        }, {});
    },
    render: function(){
        var that = this;
        var state = that.state;
        var sharing = that.state.sharing;
        var isweixin = that.state.isweixin;
        var classes = state.status == 2 ? 'text-center title' : 'text-center title error';
        var footer = isweixin ? 'footer' : 'footer noweixin';

        return <div className="result">
            <div className="fixed-top text-center header">
                <Link to="home" className="back-link"><img className="back" src="/static/img/back.svg" onClick={that.transitionTo.bind(that,'home')}/></Link>
                <span>订单: {decodeURIComponent(state.goods_name)}</span>
            </div>
            <div className="note alert-bar">
                <p className="msg text-center">感谢钱台交易云提供的支付服务！</p>
            </div>
            <div className="notice">
                <p className={classes}>{state.status == 2 ? '交易成功':'交易失败'}</p>
                <p className="info text-center">
                    滴滴打油纯属虚构，钱台支付绝对靠谱！
                </p>
            </div>
            <div className={footer}>
                <a className="info text-center" target="_blank" href="http://mp.weixin.qq.com/s?__biz=MzA4NTA3OTc2OA==&mid=202715497&idx=1&sn=31f29950348d53cbf284bf310df8bcb3#wechat_redirect">
                    钱台交易云，让交易更简单。
                </a>
                <button className="btn btn-block btn-info btn-share text-center" onTouchStart={that.shareWX}>
                    <span className="row text-center">立即分享</span>
                </button>
            </div>
            {sharing ? <div className="share fade-enter" ref="share" onTouchStart={that.shareWX}>
                <div className="share-img">
                </div>
            </div> : false}
        </div>
    }
});

module.exports = Result;
