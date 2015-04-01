# coding=utf-8
import urllib
import urllib2
import config
from config import log

def create_token():
    url = 'http://172.100.101.151:8080/createtoken?out_user=192&mchnt_id=123456&mobile=18513504999&weixin_openid=123333'

    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    the_page = response.read()
    log.debug('传出参数: %s' % the_page)

def create_order_token():
    url = 'http://172.100.101.151:8080/ordertoken'
    data = {}
    data['mobile']    = '13000000000'
    data['total_amt'] = '1'
    data['out_sn']    = '123456'

    values   = urllib.urlencode(data)
    req      = urllib2.Request(url, values)
    response = urllib2.urlopen(req)
    the_page = response.read()
    log.debug('传出参数: %s ' % the_page)

def notify_test():
    url = 'http://172.100.101.151:8080/notify'
    data = {}
    data['mobile']    = '13000000000'
    data['total_amt'] = '1'
    data['out_sn']    = '123456'

    values   = urllib.urlencode(data)
    req      = urllib2.Request(url, values)
    response = urllib2.urlopen(req)
    the_page = response.read()
    log.debug('传出参数: %s ' % the_page)

if __name__ == '__main__':
    create_token()
    create_order_token()
    notify_test()
