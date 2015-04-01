var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Api = require('../actions/api');
var Link = Router.Link;

var Index = React.createClass({
    mixins: [Api],
    componentDidMount: function(){
        this.share();
        return {};
    },
    render: function(){
        return <div className="intro">
            <p className="app-title text-center text-info">滴滴打油</p>
            <div className="app-logo">
                <img src="/static/img/logo.png" alt="logo"/>
            </div>
            <div className="footer">
                <p className="app-desc text-center text-info">地沟油售卖平台第一家！</p>
                <Link className="btn btn-block btn-info text-center alert-bar" to="home">
                    立即体验
                </Link>
                <p className="app-ver text-center text-info">1.0</p>
            </div>
        </div>
    }
});

module.exports = Index;
