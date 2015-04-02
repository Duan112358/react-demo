var React = require('react');
var {RouteHandler, Link, Navigation} = require('react-router');
var Api = require('../actions/api');

var Index = React.createClass({
    mixins: [Api],
    componentDidMount: function(){
        this.init();
    },
    init: function(){
        var footer = this.refs.footer.getDOMNode();
        var container = this.refs.container.getDOMNode();

        container.style.paddingBottom = (footer.clientHeight + 20) + 'px';
    },
    render: function(){
        return <div className="index">
            <div className="container" ref="container">
                <div className="app-logo">
                    <img src="/static/img/oneapm.png" alt="logo"/>
                </div>
                <div className="row payinfo">
                    <div className="label">
                        收款方:
                    </div>
                    <span className="target">ONEAPM</span>
                </div>
                <div className="row">
                    <div className="label">
                        订单信息: 
                    </div>
                    <span className="target">ONEAPM</span>
                </div>
                <div className="row">
                    <div className="label"></div>
                    <span className="target">2015-04-02</span>
                </div>
                <div className="row">
                    <div className="label"></div>
                    <span className="target">&yen; 20</span>
                </div>
            </div>
            <div className="footer" ref="footer">
                <h3 className="h3">支付方式</h3>
                <p className="app-desc text-info">
                    开启一件支付服务(支持借记卡), 实现包月:解决续费不便的烦恼
                </p>
                <Link className="btn btn-primary text-center alert-bar" to="cardbind">
                    一键支付
                </Link>
                <p className="app-desc text-info">
                    每月均需手工在线支付
                </p>
                <Link className="btn btn-primary text-center alert-bar" to="cardbind">
                    微信支付
                </Link>
            </div>
        </div>;
    }
});

module.exports = Index;
