var React = require('react');
var { Link, Navigation } = require('react-router');
var Select = require('react-select');
var Api = require('../actions/api');

var CardBind = React.createClass({
    mixins: [Api, Navigation],
    componentDidMount: function(){
    },
    getInitialState: function(){
        return {
            provinces: [
                {value: '1', label: '河北省'},
                {value: '2', label: '东北省'},
                {value: '3', label: '山西省'},
                {value: '4', label: '陕西省'},
                {value: '5', label: '吉林省'},
                {value: '6', label: '辽宁省'},
                {value: '12', label: '湖南省'}
            ]
        };
    },
    render: function(){
        var that = this;

        return <div className="cardbind">
            <div className="fixed-top text-center header">
                <a href="#/" className="back-link">
                    <img className="back" src="/static/img/back.svg"/>
                </a>
                <span>一键支付</span>
            </div>
            <div className="container">
                <div className="row">
                    <label className="label" htmlFor="name">姓名</label>
                    <span className="target">
                        <input type="text" id="name" name="name" className="target-input"/>
                    </span>
                </div>
                <div className="row">
                    <label className="label" htmlFor="idnum">身份证号</label>
                    <span className="target">
                        <input type="text" id="idnum" name="idnum" className="target-input"/>
                    </span>
                </div>
                <div className="row select">
                    <label className="label" htmlFor="provinces">省份</label>
                    <span className="target">
                        <Select name="provinces" id="provinces" value="" options={that.state.provinces} onChange={that.onSelect}/>
                    </span>
                </div>
            </div>
        </div>
    }
});

module.exports = CardBind;
