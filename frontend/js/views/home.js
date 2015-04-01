var React = require('react');
var { Link } = require('react-router');
var Api = require('../actions/api');

var Home = React.createClass({
    mixins: [Api],
    componentDidMount: function(){
        var that = this;
        that.getlist(function(data){
            that.setState({
                items: data,
                loading: false
            });
        });

        that.login({
            username: '18810888188',
            password: '6543210'
        }, function(err, res){
            if(!err){
                var data = JSON.parse(res.text);
                that.cache('token', data.token);
                that.cache('mobile', '18810888188');
            }
        });
        this.share();
    },
    getInitialState: function(){
        return {
            loading: true,
            items: []
        }
    },
    render: function(){
        var that = this;
        var items = that.state.items;
        var loading = that.state.loading;

        return <div className="home">
            <div className="fixed-top text-center header">
                热门打油师
            </div>
            <div className="note alert-bar">
                <p className="msg text-center">热烈庆祝滴滴打油师融资2亿美金！</p>
                <p className="msg text-center">首单任一油品1毛包邮！</p>
            </div>
            <div className="list" ref="list">
            {
                items.map(function(item, index){
                    return <Link className="list-item table clearfix" to="detail" params={item}>
                       <div className="table-cell">
                        <img src={item.avatar} className="avatar"/>
                       </div>
                       <div className={"table-cell" + ((index === (items.length-1)) ? ' last':'')}>
                        <span className="row name">{item.name}</span>
                        <span className="row info">
                            <span className="order-count label">本月接单:{item.orders_count}</span>
                            <span className="rating label">评分:{item.rating}</span>
                        </span>
                        <span className="row desc">{item.desc}</span>
                       </div>
                    </Link>
                })
            }
            <div className="loading table">
                <span className="table-cell">
                    <img src="/static/img/indicator.png" className="loading-img"/>
                </span>
                <span className="table-cell loading-text">
                    <span className="row">客官请稍等片刻</span>
                    <span className="row">更多打油师正在赶来...</span>
                </span>
            </div>
            </div>
        </div>
    }
});

module.exports = Home;
