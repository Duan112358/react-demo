var React = require('react');
var {RouteHandler, Link, Navigation} = require('react-router');
var Api = require('../actions/api');

var Index = React.createClass({
    mixins: [Api],
    componentWillMount: function(){
        this.setState({
            config: this.get_config()
        });
    },
    componentDidMount: function(){
        this.init();
    },
    init: function(){
        var footer = this.refs.footer.getDOMNode();
        var container = this.refs.container.getDOMNode();

        container.style.paddingBottom = (footer.clientHeight + 20) + 'px';
    },
    pay: function(){
        alert('prepay pay');
        var that = this;
        var config = that.state.config;
        config['pay_type'] = 2;
        config.caller = 'h5';
        that.prepay(config, function(resp){
            alert(JSON.stringify(resp));
            if(resp.respcd === '0000'){
                that.weixinpay(resp.data, function(data){
                    console.log(data);
                });
            }else{
                alert(resp.resperr)
            }
        });
    },
    render: function(){
        var that = this;
        return <div className="index">
            <div className="container" ref="container">
                <div className="app-logo">
                    <img src="/static/img/oneapm.png" alt="logo"/>
                </div>
                <div className="row payinfo">
                    <div className="label">
                        收款方:
                    </div>
                    <span className="target">{that.state.config.app_name || '没有获取到APP_NAME'}</span>
                </div>
                <div className="row">
                    <div className="label">
                        订单信息: 
                    </div>
                    <span className="target">{that.state.config.order_info || "没有得到订单信息"}</span>
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
                <button className="btn btn-primary text-center alert-bar" onTouchStart={that.pay}>
                    微信支付
                </button>
            </div>
        </div>;
    }
});

module.exports = Index;
