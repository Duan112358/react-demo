var React = require('react');
var { DefaultRoute, Route, Link, RouteHandler} = require('react-router');

var Index = require('./views/index');
var Privacy = require('./views/privacy');
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
        <Route handler={Privacy} name="privacy"/>
        <DefaultRoute handler={Index}/>
    </Route>
);
