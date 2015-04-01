var React = require('react');
var TransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var { Link, RouteHandler, State} = require('react-router');

require('../../less/app');

var Intro = require('./intro');
var Index = React.createClass({
    mixins: [State],
    render: function(){
        var name = this.getRoutes().reverse().name;
        return <div className="app">
            <TransitionGroup component="div" transitionName="fade">
                <RouteHandler key={name}/>      
            </TransitionGroup>
        </div>
    }
});

module.exports = Index;