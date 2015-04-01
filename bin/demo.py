# coding=utf-8
import os, sys
import web
import time
import uuid
import urllib
import urllib2
import hashlib
import types, json
HOME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(HOME, 'conf'))
import config
from config import log

# urls 
urls = (
    '/',            'Index', 
    '/wxconfig',    'WXConfig',          # 微信分享参数配置（从喵喵微店获取）      
    '/ordertoken',  'OrderToken',        # 预下单token
    '/createtoken', 'CreateToken',       # 创建token
    '/notify',      'NotifyHandler',     # 回调通知
    '/wap/login',   'Login', 
    '/wap/checkout','Checkout',
    '/create_activity', 'CreateActivity',# 活动创建页面的嵌入
    '/managelaxin', 'ManageLaxinActivity',# 管理活动页面的嵌入
    '/manageconsume', 'ManageConsumeActivity',# 管理活动页面的嵌入
)

app = web.application(urls, globals())
render = web.template.render('templates')

# 参数签名
def param2sign(params, key, charset='utf-8'):
    log.debug('params: %s , params: %s' % (params,  key))
    keys = params.keys()
    keys.sort()
    query = []
    for k in keys:
        if k not in ('sign', 'sign_type'):
            query.append('%s=%s' % (k, params[k]))

    data = '&'.join(query) + key
    if not isinstance(data, types.UnicodeType):
        data = data.decode(charset)

    md5 = hashlib.md5()
    md5.update(data.encode(charset))
    return md5.hexdigest()

# 检测必传参数
def input2param(input, must_param):
    data = {}
    for i in must_param:
        if not input.has_key(i):
            log.debug('param error, must have %s' % i)
            return (-1, 'param error, must have %s' % i)
        else:
            if isinstance(input[i],types.UnicodeType):
                input[i] = input[i].encode('utf-8')
            data[i] = input[i]
    data.update(input)
    return (0, data)

class NotifyHandler:
    '''
    接受异步通知信息
    '''
    def POST(self):
        log.debug('=============NotifyClass===============')
        must_param = []
        web.header('Content-Type', 'application/json; charset=UTF-8')
        input = web.input()
        log.info('传回的数据:%s' % input)
        return 'Success'

class CreateToken:
    '''
    生成token
    在平台内是唯一的
    '''
    def GET(self):
        log.debug('=============CreateToken===============')
        must_param = []
        web.header('Content-Type', 'application/json; charset=UTF-8')
        input = web.input()
        data  = {}
        data['app_code']= config.app_code
        data['expires'] = config.authexpires
        data['caller']  = 'server'

        respcd, respdata = input2param(input, must_param)
        if respcd:
            return respdata
        data.update(respdata)

        data['sign']    = param2sign(data, config.server_key)
        log.debug('签名:%s' % data['sign'])
        log.info('传入参数: %s' % data)

        values   = urllib.urlencode(data)
        req      = urllib2.Request(config.url, values)
        response = urllib2.urlopen(req)
        the_page = response.read()
        ret      = the_page.decode('unicode-escape')
        ret      = json.loads(ret)
        log.info('传出参数：%s' % ret)
        if ret['respcd'] == '0000':
            return json.dumps({'token':ret['data']['token']})
        else:
            return '创建token失败'

    def POST(self):
        return self.GET()

class OrderToken:
    '''
    生成订单的token
    '''
    def GET(self):
        log.debug('=============OrderToken===============')
        must_param = ['total_amt']
        web.header('Content-Type', 'application/json; charset=UTF-8')
        input   = web.input()
        data   = {}
        data['app_code'] = config.app_code
        data['expires']  = config.orderexpires
        data['caller']   = 'server'

        respcd, respdata = input2param(input, must_param)
        if respcd:
            return respdata
        data.update(respdata)
        data['total_amt'] = input['total_amt']
        data['out_sn']    = uuid.uuid4()
        data['sign']      = param2sign(data, config.server_key)
        log.info('传入参数: %s' % data)

        values = urllib.urlencode(data)
        req = urllib2.Request(config.orderurl, values)
        response = urllib2.urlopen(req)
        the_page = response.read()
        ret = the_page.decode('unicode-escape')
        ret = json.loads(ret)
        log.info('传出参数：%s' % ret)
        if ret['respcd'] == '0000':
            return json.dumps({'token':ret['data']['order_token']})
        else:
            return ''

    def POST(self):
        return self.GET()


class WXConfig:
    def GET(self):
        input = web.input()
        log.info('微信配置传入参数', input.get('url'))
        req = urllib2.Request(config.wxconfigurl + '?share_url='+input.get('url', ''))
        resp = urllib2.urlopen(req)
        result = resp.read()
        log.info('微信配置返回参数', result)
        return result


class CreateActivity:
    '''
    创建活动的嵌入页面
    '''
    def GET(self):
        input   = web.input()
        token = input.get('token', '')
        web.header('Content-Type','text/html; charset=utf-8', unique=True)
        return '''
        <html>
        <head>
            <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
            <meta name="format-detection" content="telephone=no" />
        </head>
        <body>
            <p>yyk测试:</p>
             <iframe src="%s?token=%s" height="1000" width="1000"> 
             </iframe>
        </body>
        </html>
        ''' % (config.mis_createAct, token)

class ManageLaxinActivity:
    '''
    管理拉新活动的嵌入页面
    '''
    def GET(self):
        input   = web.input()
        token = input.get('token', '')
        web.header('Content-Type','text/html; charset=utf-8', unique=True)
        return '''
        <html>
        <head>
            <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
            <meta name="format-detection" content="telephone=no" />
        </head>
        <body>
            <p>yyk测试:</p>
             <iframe src="%s?token=%s" height="1000" width="1000"> 
             </iframe>
        </body>
        </html>
        ''' % (config.mis_managelaxin, token)

class ManageConsumeActivity:
    '''
    管理消费返劵活动的嵌入页面
    '''
    def GET(self):
        input   = web.input()
        token = input.get('token', '')
        web.header('Content-Type','text/html; charset=utf-8', unique=True)
        return '''
        <html>
        <head>
            <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
            <meta name="format-detection" content="telephone=no" />
        </head>
        <body>
            <p>yyk测试:</p>
             <iframe src="%s?token=%s" height="1000" width="1000"> 
             </iframe>
        </body>
        </html>
        ''' % (config.mis_manageconsume, token)

class Index:
    def GET(self):
        return render.index();

# H5页面
class Login:
    def GET(self):
        web.header('Content-Type','text/html; charset=utf-8', unique=True)
        return '''
        <html>
        <head>
            <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
            <meta name="format-detection" content="telephone=no" />
        </head>
        <body>
        <form action="" method="post">
            <p>用户名</p>
            <input type="text" name="username"/>
            <p>密码</p>
            <input type="password" name="password"/>
            <br>
            <input type="submit" value="登录"/>
        </form>
        </body>
        </html>
        '''

    def POST(self):
        input = web.input()
        print input
        username = input.get('username','')

        data = {
            'mobile':username,
            'app_code': config.app_code,
            'caller':'server',
        }
        data['sign']    = param2sign(data, config.server_key)
        values = urllib.urlencode(data)
        req = urllib2.Request(config.url, values)
        response = urllib2.urlopen(req)
        ret = response.read()
        j = json.loads(ret)
        log.debug(j)
        token = j['data']['token']
        return json.dumps({'token': token})

class Checkout:
    def GET(self):
        input = web.input()
        token = input.get('token','')
        mobile = input.get('mobile','')

        web.header('Content-Type','text/html; charset=utf-8', unique=True)

        return u' \
        <html> \
        <head> \
            <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" /> \
            <meta name="format-detection" content="telephone=no" /> \
        </head> \
        <body> \
        <form action="" method="post"> \
            <p>上门美甲基础套餐</p> \
            <label> 价格<input type="text" name="amt" value="10"></label> \
            <label> openid<input type="text" name="openid" value=""></label> \
            <input type="hidden" name="subject" value="美甲套餐"> \
            <input type="hidden" name="token" value="%s"> \
            <input type="hidden" name="mobile" value="%s"> \
            <input type="submit" value="下单"/> \
        </form> \
        </body> \
        '%(token,mobile)

    def POST(self):
        input = web.input()
        amt = int(input.get('amt','0'))
        subject = input.get('subject','')
        token = input.get('token','')
        mobile = input.get('mobile','')
        openid = input.get('openid','')
        out_sn = str(int(time.time()*1000))

        data = {
            'total_amt':amt,
            'app_code':config.app_code,
            'out_sn':out_sn,
            'caller':'server',
        }
        data['sign']    = param2sign(data, config.server_key)
        values = urllib.urlencode(data)
        req = urllib2.Request(config.orderurl, values)
        response = urllib2.urlopen(req)
        ret = response.read()
        j = json.loads(ret)
        log.debug(j)
        order_token = j['data']['order_token']
        return json.dumps({
            'order_token': order_token,
            'url':  config.checkouturl + '?token='+token+'&order_token='+order_token+'&goods_name='+subject+'&mobile='+mobile+'&total_amt='+str(amt) + '&out_sn='+out_sn+'&showwxpaytitle=1&openid='+openid
        })

if __name__ == "__main__":
    app.run()
