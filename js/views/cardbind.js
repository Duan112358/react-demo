var React = require('react');
var { Link, Navigation } = require('react-router');
var Select = require('../components/select');
var Classable = require('../components/classable');
var Input = require('../components/input');
var Checkbox = require('../components/checkbox');
var Alert = require('../actions/alert');
var Api = require('../actions/api');
var Store = require('../actions/store');

var CardBind = React.createClass({
    mixins: [Api, Navigation, Alert, Classable],
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
    },
    componentWillUnmount: function(){
        Store.set('__card_info__', JSON.stringify(this.state));
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
        return [];
    },
    onSelectProvince: function(provinceId){
        var that = this;
        var province = that.state.provinces.filter(function(p){
            return p.value == provinceId;
        })[0];

        var cities = province.cities;
        that.setState({
            province: province,
            provinceError: false,
            city: {},
            cityError: false,
            branchbanks: []
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
            branchbanks: []
        });

        that.get_branchbanks({
            cityid: city.value,
            headbankid: that.state.headbank.value
        }, function(resp){
            if(resp.respcd === '0000'){
                that.setState({
                    branchbanks: that.mapper(resp.data.records, 'name'),
                    branchbankError: resp.data.records.length ? false : '该地区暂时没有当前银行支行网点'
                });
            } 
        });
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
                            headbankNotFoundError: false
                        });
                        if(that.state.city.label){
                            that.get_branchbanks({
                                cityid: that.state.city.value,
                                headbankid: headbank.value
                            }, function(result){
                                if(result.respcd === '0000'){
                                    that.setState({
                                        branchbanks: that.mapper(result.data.records, 'name'),
                                        branchbankError: result.data.records.length ? false : '该地区暂时没有当前银行支行网点'
                                    });
                                } 
                            });
                        }
                    }else{
                        that.setState({
                            bankaccountNotFoundError: '未找到相关银行,请输入正确的银行卡号',
                            bankaccountError: '未找到相关银行,请输入正确的银行卡号'
                        });
                    }
                }else{
                    that.error(resp.resperr);
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

        if(!state.branchbank.label){
            if(!state.province.label || !state.city.label){
                target.branchbankError = '请先选择省份和城市,然后选择当地支行';
            }else{
                target.branchbankError = '请选择支行';
            }
            hasError = true;
        }

        if(hasError){
            that.setState(target);
            return;
        }

        if(!state.agree_privacy){
            this.warning('请仔细阅读并同意支付协议');
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
                       that.applySuccess(config.order_syssn, config.order_amount, function(){
                           that.close_window();
                       })
                   }else{
                       that.error(data.resperr);
                   }
                });
                Store.remove('__card_info__');
            }else{
                that.error(resp.resperr);
            } 
            that.setState({
                submitting: false
            });
        });
    },
    getInitialState: function(){
        if(Store.get('__card_info__')){
            var data = JSON.parse(Store.get('__card_info__'));
            return data;
        }

        return {
            provinces: [],
            province: {},
            cities: [],
            city: {},
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
        var orderinfo = this.get_config();
        this.setState({
            agree_privacy: value
        });
    },
    init: function(){
        var container = this.refs.container.getDOMNode();
        var bottom = this.refs.bottom.getDOMNode();

        var windowHeight = document.body.clientHeight;
        var containerHeight = container.clientHeight;
        var bottomHeight = bottom.clientHeight;

        var remaining = (windowHeight - containerHeight - bottomHeight - 32);

        if(remaining > 0){
            bottom.style.marginTop = remaining + 'px';
        }
    },
    componentDidMount: function(){
        this.init();
    },
    render: function(){
        var that = this;
        var headbankinfo = that.state.headbank.headbankname ? that.state.headbank.headbankname + '   ' + that.state.headbank.cardtype : false;
        return <div className="cardbind">
            <div className="container" ref="container">
                <Input name="name" id="name" value={that.state.name} onChange={that.changeName} error={that.state.nameError} type="text" label="姓名"/>                
                <Input name="idnum" id="idnum" value={that.state.idnum} onChange={that.changeIDNum} error={that.state.idnumError} type="text" label="身份证号"/>                
                <Input name="bankaccount" id="bankaccount" value={that.state.bankaccount} onChange={that.changeBankAccount} error={that.state.bankaccountError} desc={headbankinfo} type="tel" label="银行卡号"/>                
                <div className="row select">
                    <span className="cell first">
                        <Select name="provinces" id="provinces" clearable={false} value={that.state.province.label} options={that.state.provinces} onChange={that.onSelectProvince} placeholder="请选择省份" noResultsText="无数据" searchable={false}/>
                    </span>
                    <span className="cell second">
                        <Select name="city" clearable={false} id="cities" value={that.state.city.label} options={that.state.province.cities} clearable={false} onChange={that.onSelectCity} placeholder="请选择城市" noResultsText="无数据" searchable={false}/>
                    </span>
                </div>
                <div className={that.getClasses('row select', {'error': that.state.branchError})}>
                    <Select name="branchbank" id="branchbank" clearable={false} value={that.state.branchbank.label} options={that.state.branchbanks} onChange={that.onSelectBranchbank} placeholder="请选择支行" noResultsText="无数据"/>
                    {that.state.branchbankError ? <div className="error">{that.state.branchbankError}</div>:false}
                </div>
            </div>
            <div ref="bottom" className="bottom">
                <Checkbox checked={that.state.agree_privacy} id="agree" name="agree" onChange={that.onAgreePrivacy}>
                   已阅读并同意
                   <Link to="privacy">{'《'}钱台交易云支付服务协议{'》'}</Link> 
                </Checkbox>
                <button className="btn btn-primary text-center alert-bar" disabled={that.state.submitting ?'disabled': false} onClick={that.submit}>
                {that.state.submitting ? '支付处理中...' : '确认支付并开通'}
                </button>
            </div>
        </div>
    }
});

module.exports = CardBind;
