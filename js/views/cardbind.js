var React = require('react');
var { Link, Navigation } = require('react-router');
var Select = require('../components/select');
var Api = require('../actions/api');

var CardBind = React.createClass({
    mixins: [Api, Navigation],
    componentWillMount: function(){
        var that = this;
        that.get_areacities(function(resp){
            if(resp.respcd === '0000'){
                var provinces = resp.data.records.map(function(record){
                    return {
                        label: record.areaname,
                        value: record.areaid,
                        cities: that.mapper(record.cities, 'cityname', 'cityid') 
                    };
                });
                that.setState({
                    provinces: provinces
                });    
            }else{
                console.log(resp.resperr);
            } 
        });

        that.get_headbanks(function(resp){
            if(resp.respcd === '0000'){
                var headbanks = that.mapper(resp.data.records, 'headbankname', 'headbankid');
                that.setState({
                    headbanks: headbanks
                });
            }
        });
    },
    mapper: function(records, label, value){
        if(records.length){
            return records.map(function(record, index){
                return {
                    label: record[label],
                    value: value ? record[value] : index
                };
            });
        }
    },
    onSelectProvince: function(provinceId){
        var that = this;
        var province = that.state.provinces.filter(function(p){
            return p.value == provinceId;
        })[0];


        var cities = province.cities;
        that.setState({
            province: province,
            provinceError: false
        });
    },
    onSelectCity: function(cityid){
        var that = this;
        var city = that.state.province.cities.filter(function(c){
            return c.value == cityid;
        })[0];
        that.setState({
            city: city,
            cityError: false,
            showheadbanks: true
        });

        if(that.state.disableheadbank){
            that.get_branchbanks({
                cityid: city.value,
                headbankid: that.state.headbank.value
            }, function(resp){
                if(resp.respcd === '0000'){
                    that.setState({
                        branchbanks: that.mapper(resp.data.records, 'name')
                    });
                } 
            });
        }
    },
    onSelectHeadbank: function(headbankid){
        var that = this;
        var headbank = that.state.headbanks.filter(function(c){
            return c.value == headbankid;
        })[0];
        that.setState({
            headbank: headbank,
            headbankError: false
        });

        that.get_branchbanks({
            cityid: that.state.city.value,
            headbankid: headbank.value
        }, function(resp){
            if(resp.respcd === '0000'){
                that.setState({
                    branchbanks: that.mapper(resp.data.records, 'name')
                });
            } 
        });
    },
    changeIDNum: function(e){
        var that = this;
        var value = e.target.value;

        if(value && value.length > 18){
            that.setState({
                idnumError: '身份证号码格式不正确'
            });
            return;
        }
        if(value && !/^\d{0,}(X|x|\d)$/.test(value)){
            that.setState({
                idnumError: '身份证号码格式不正确'
            });
            return;
        }

        that.setState({
            idnum: value,
            idnumError: false
        });
    },
    changeBankAccount: function(e){
        var value = e.target.value;
        var target = {};
        var hasError = false;
        var that = this;

        if(value && value.length === 6){
            that.get_cardsinfo({
                q: value
            }, function(resp){
                if(resp.respcd === '0000'){
                    var records = resp.data.records;
                    if(records.length){
                        var headbank = records[0];
                        headbank.label = headbank.headbankname;
                        headbank.value = headbank.headbankid;
                        that.setState({
                            headbank: headbank,
                            showheadbanks: true,
                            disableheadbank: true,
                            headbankError: false,
                            headbankNotFoundError: false
                        });
                    }else{
                        that.setState({
                            bankaccountNotFoundError: '未找到相关银行,请输入正确的银行卡号',
                            bankaccountError: '未找到相关银行,请输入正确的银行卡号'
                        });
                    }
                }
            }) 
        }
        if(value && (!/^\d+$/.test(value) || value.length > 19)){
            target.bankaccountError = that.bankaccountNotFoundError || '请输入正确的银行卡号';
            hasError = true;
        }

        if(!hasError){
            target.bankaccountError = that.bankaccountNotFoundError || false;
        }

        target.bankaccount = value;
        that.setState(target);

    },
    onSelectBranchbank: function(branchbankId){
        var that = this;
        var branchbank = that.state.branchbanks.filter(function(c){
            return c.value == branchbankId;
        })[0];
        that.setState({
            branchbank: branchbank,
            branchbankError: false
        });
    },
    submit: function(){
        var that = this;   
        var hasError = false;
        var target = {};
        var state = that.state;

        if(!state.name){
           target.nameError = '姓名不能为空';
           hasError = true;
        }

        if(!state.idnum){
           target.idnumError = '身份证号不能为空';
           hasError = true;
        }else{
           var pattern = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
           if(!pattern.test(state.idnum)){
               target.idnumError = '身份证格式不正确';
               hasError = true;
           }
        }

        if(!state.bankaccount){
            target.bankaccountError = '银行卡号不能为空';
            hasError = true;
        }else{
            if(!/^\d{16,19}$/.test(state.bankaccount)){
                target.bankaccountError = '银行卡号格式不正确';
                hasError = true;
            }
        }

        if(!state.branchbank.label && state.headbank.label){
            target.branchbankError = '请选择支行';
            hasError = true;
        }

        if(hasError){
            that.setState(target);
            return;
        }

        if(!state.agree_privacy){
            alert('请仔细阅读并同意支付协议');
            return;
        }

        that.setState({
            submitting: true
        });

        that.bindcard({
            card_user: state.name,
            card_no: state.bankaccount,
            idnumber: state.idnum,
            issuerbank: state.headbank.label,
            brchbank_name: state.branchbank.label
        }, function(resp){
            if(resp.respcd === '0000'){
                var config = that.get_config();
                config.pay_type = 7;
                config.card_id = resp.data.card_id;
                that.prepay(config, function(data){
                   if(data.respcd === '0000'){
                        alert('银行卡代付支付绑定成功')
                        that.close_window();
                   }else{
                       alert(data.resperr);
                   }
                });
            }else{
                alert(resp.resperr);
            } 
            that.setState({
                submitting: false
            });
        });
    },
    getInitialState: function(){
        return {
            provinces: [],
            province: {},
            cities: [],
            city: {},
            headbanks: [],
            headbank: {},
            branchbanks: [],
            branchbank: {}
        };
    },
    changeName: function(e){
        var that = this;
        var value = e.target.value;
        var target = {};

        if(value.length){
            target.nameError = false;
        }

        target.name = value;
        that.setState(target);
    },
    onAgreePrivacy: function(e){
        var value = e.target.checked;
        this.setState({
            agree_privacy: value
        });
    },
    render: function(){
        var that = this;

        return <div className="cardbind">
            <div className="text-center header">
                <a href="#/" className="back-link">
                    <img className="back" src="/static/img/back.svg"/>
                </a>
                <span>一键支付</span>
            </div>
            <div className="container" ref="container">
                <div className="row">
                    <label className="label" htmlFor="name">姓名</label>
                    <span className="target">
                        <input type="text" id="name" name="name" className="target-input" onChange={that.changeName}/>
                    </span>
                </div>
                {that.state.nameError ? <div className="error">{that.state.nameError}</div> : false}
                <div className="row">
                    <label className="label" htmlFor="idnum">身份证号</label>
                    <span className="target">
                        <input type="text" id="idnum" name="idnum" className="target-input" onChange={that.changeIDNum}/>
                    </span>
                </div>
                {that.state.idnumError ? <div className="error">{that.state.idnumError}</div> : false}
                <div className="row">
                    <label className="label" htmlFor="bankaccount">银行卡号</label>
                    <span className="target">
                        <input type="tel" value={that.state.bankaccount} id="bankaccount" name="bankaccount" className="target-input" onChange={that.changeBankAccount}/>
                    </span>
                </div>
                {that.state.bankaccountError ? <div className="error">{that.state.bankaccountError}</div> : false}
                <div className="row select">
                    <label className="label" htmlFor="provinces">省份</label>
                    <span className="target">
                        <Select name="provinces" id="provinces" value={that.state.province.label} options={that.state.provinces} onChange={that.onSelectProvince} placeholder="请选择省份" noResultsText="无数据"/>
                    </span>
                </div>
                {that.state.provinceError ? <div className="error">{that.state.provinceError}</div>:false}
                {that.state.province.label ? <div className="row select">
                    <label className="label" htmlFor="city">城市</label>
                    <span className="target">
                        <Select name="city" id="cities" value={that.state.city.label} options={that.state.province.cities} onChange={that.onSelectCity} placeholder="请选择城市" noResultsText="无数据"/>
                    </span>
                </div> : false}
                {that.state.cityError ? <div className="error">{that.state.cityError}</div>:false}
                {that.state.showheadbanks ? <div className="row select">
                    <label className="label" htmlFor="headbanks">银行</label>
                    <span className="target">
                        <Select name="headbank" disabled={that.state.disableheadbank} id="headbanks" value={that.state.headbank.label} options={that.state.headbanks} onChange={that.onSelectHeadbank} placeholder="请选择银行" noResultsText="无数据"/>
                    </span>
                </div> : false}
                {that.state.headbankError ? <div className="error">{that.state.headbankError}</div>:false}
                {that.state.branchbanks.length ? <div className="row select">
                    <label className="label" htmlFor="branchbank">银行支行</label>
                    <span className="target">
                        <Select name="branchbank" id="branchbank" value={that.state.branchbank.label} options={that.state.branchbanks} onChange={that.onSelectBranchbank} placeholder="请选择支行" noResultsText="无数据"/>
                    </span>
                </div> : false}
                {that.state.branchbankError ? <div className="error">{that.state.branchbankError}</div>:false}
            </div>
            <div className="footer" ref="footer">
                <div className="row">
                    <label className="note">
                       <label htmlFor="agree">已阅读并同意<input type="checkbox" name="agree" id="agree" onChange={that.onAgreePrivacy}/></label>
                       <Link to="privacy">&lt;&lt;钱台交易云一键支付服务协议&gt;&gt;</Link> 
                    </label>
                </div>
                <button className="btn btn-primary text-center alert-bar" disabled={that.state.submitting ?'disabled': false} onTouchStart={that.submit}>
                {that.state.submitting ? '支付处理中...' : '确认支付并开通'}
                </button>
            </div>
        </div>
    }
});

module.exports = CardBind;
