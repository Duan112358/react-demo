var React = require('react');
var Router = require('react-router');

var routes = require('./route');

React.initializeTouchEvents(true);
Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
