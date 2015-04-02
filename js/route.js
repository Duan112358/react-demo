var React = require('react');
var { DefaultRoute, Route, Link, RouteHandler} = require('react-router');

var Index = require('./views/index');
var CardBind = require('./views/cardbind');

var App = React.createClass({
    render: function(){
        return <div className="app">
            <RouteHandler/>      
        </div>
    }
});

module.exports = (
    <Route handler={App}>
        <Route handler={CardBind} name="cardbind"/>
        <DefaultRoute handler={Index}/>
    </Route>
);
