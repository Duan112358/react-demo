var React = require('react');
var {RouteHandler, Link, Navigation} = require('react-router');
var Api = require('../actions/api');
var Alert = require('../actions/alert');

var Index = React.createClass({
    mixins: [Api, Alert],
    componentWillMount: function(){
        this.setState({
            config: this.get_config()
        });
    },
    pay: function(){
        var that = this;
        that.setState({
            submitting: true
        });

        var config = that.state.config;
        config['pay_type'] = 2;
        that.prepay(config, function(resp){
            if(resp.respcd === '0000'){
                that.weixinpay(resp.data, function(data){
                    if(data.error){
                        this.error(data.error);
                    }else{
                        this.paySuccess(config.order_syssn, config.order_amount, function(){
                            that.close_window();
                        });
                    }
                });
            }else{
                that.error(resp.resperr)
            }
            that.setState({
                submitting: false
            });
        });
    },
    init: function(){
        var container = this.refs.container.getDOMNode();
        var bottom = this.refs.bottom.getDOMNode();

        var windowHeight = document.body.clientHeight;
        var containerHeight = container.clientHeight;
        var bottomHeight = bottom.clientHeight;

        var remaining = (windowHeight - containerHeight - bottomHeight - 122);

        if(remaining > 0){
            bottom.style.marginTop = remaining + 'px';
        }
    },
    componentDidMount: function(){
        this.init();
    },
    render: function(){
        var that = this;
        return <div className="index">
            <div className="container" ref="container">
                <div className="app-logo">
                    <img src={that.state.app_logo || (that.state.config.static_url+'/img/oneapm.png')} alt="logo"/>
                    <div className="app-name">
                        收款方: {that.state.config.app_name || 'ONEAPM'}
                    </div>
                </div>
                <div className="row order-info">
                    <div className="label">订单信息</div>
                    <div className="target">
                        <div className="item"><span className="name">名称:</span>{that.state.config.order_name}</div>
                        <div className="item"><span className="name">订单:</span>{that.state.config.order_syssn}</div>
                        <div className="item"><span className="name">金额:</span>{that.state.config.order_amount}元</div>
                    </div>
                </div>
                <h3 className="h3">支付方式</h3>
                <p className="app-desc text-info">
                    开启包月支付服务(支持借记卡), 实现包月:解决续费不便的烦恼
                </p>
            </div>
            <div ref="bottom" className="bottom">
                <Link className="btn btn-primary text-center alert-bar" to="cardbind">
                    包月支付
                </Link>
                <button className="btn btn-info text-center alert-bar" onClick={that.pay} disabled={that.state.submitting ? 'disabled': false}>
                    {that.state.submitting ? '支付处理中...' : '微信支付'}
                </button>
            </div>
        </div>;
    }
});

module.exports = Index;
