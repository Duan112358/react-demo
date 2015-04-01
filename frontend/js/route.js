var React = require('react'),
    {Route, DefaultRoute} = require('react-router');

var Intro = require('./views/intro');
var Home = require('./views/home');
var Index = require('./views/index');
var Detail = require('./views/detail');
var Result = require('./views/result');

module.exports = (
    <Route handler={Index} path="/">
        <DefaultRoute handler={Intro} name="intro"/>
        <Route handler={Home} name="home"/>
        <Route handler={Result} name="result"/>
        <Route handler={Detail} name="detail" path="/:id"/>
    </Route>
);
