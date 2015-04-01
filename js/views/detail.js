var React = require('react');
var Api = require('../actions/api');
var { State, Navigation, Link } = require('react-router');

var Detail = React.createClass({
    mixins: [State, Navigation, Api],
    getInitialState: function(){
        return {
            loading: true,
            id: this.getParams().id,
            item: {}
        }
    },
    componentDidMount: function(){
        var that = this;
        that.getlist(function(items){
            var item = items.filter(function(data){
                return data.id == that.state.id;
            })[0];
            that.setState({
                loading: false,
                submitting: false,
                item: item
            });
        });
        that.share();
    },
    createOrder: function(e){
        var that = this;
        var target = e.target;
        var product = that.state.item.product;
        var token = that.cache('token');
        var mobile = that.cache('mobile');

        target.setAttribute('disabled', 'disabled');

        that.setState({
            submitting: true
        });

        that.checkout({
            token: token,
            amt: product.price * 100,
            subject: product.name,
            openid: '',
            mobile: mobile
        }, function(err, res){

            if(!err){
                var url = JSON.parse(res.text).url;
                location.href = url;
            }else{
                that.setState({
                    submitting: false
                });
                target.removeAttribute('disabled');
            }
        });
    },
    render: function(){
        var that = this;
        var loading = that.state.loading;
        var submitting = that.state.submitting;
        var item = that.state.item;
        var product = item.product || {};

        return <div className="detail">
            <div className="fixed-top text-center header">
                <Link to="home" className="back-link"><img className="back" src="/static/img/back.svg" onClick={that.transitionTo.bind(that, 'home')}/></Link>
                <span>{item.name}</span>
            </div>
            <div className="user table" style={{backgroundImage: 'url(' + item.bg + ')'}}>
                <span className="table-cell">
                    <img src={item.avatar} className="avatar"/>
                </span>
                <span className="table-cell">
                    <span className="row name">{item.name}</span>
                    <span className="row order-count">本月接单: {item.orders_count}</span>
                    <span className="row rating">综合评分: {item.rating}</span>
                </span>
            </div>
            <div className="well">
                <span className="row title">打油师简介</span>
                <p className="content">{item.detail}</p>
                <span className="row title">个人宣言</span>
                <p className="content">{item.quota}</p>
            </div>
            <div className="panel">
                <img className="panel-img" src={product.img}/>
                <span className="row name">{product.name}<span className="right">{product.price}元</span></span>
                <p className="content">{product.desc}</p>
                <p className="info text-center">使用钱台交易云，1毛钱体验滴滴打油</p>
            </div>
            <button className="btn btn-block btn-red alert-bar note" onClick={that.createOrder}>{submitting ?  '正在提交':'立即订购'}</button>
        </div>
    }
});

module.exports = Detail;
