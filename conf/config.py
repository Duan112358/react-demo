# vim: set ts=4 et sw=4 sts=4 fileencoding=utf-8 :
import sys, os
import logging

# 日志
filename = sys.stdout
logging.basicConfig(level=logging.DEBUG,
                datefmt ='%a, %d %b %Y %H:%M:%S',
                format  = '%(asctime)s %(process)d,%(threadName)s %(filename)s:%(lineno)d [%(levelname)s] %(message)s',
                stream  = filename,
                filename= '' if filename == sys.stdout else filename)
log = logging.getLogger()


app_code     = '123456'
server_key   = '123456'
url          = 'http://172.100.101.106:20000/v1/auth/token'
wxconfigurl  = 'http://172.100.101.106:11111/v1/share/weixin'
orderurl     = 'http://172.100.101.106:20000/v1/order/pre_create'
checkouturl  = 'http://172.100.101.106:20000/v1/wap/checkout'
mis_createAct= 'http://172.100.101.151:10005/activity/create'
mis_manageconsume = 'http://172.100.101.151:10005/activity/manage/consume'
mis_managelaxin   = 'http://172.100.101.151:10005/activity/manage/laxin'
authexpires  = 60 * 60 * 2
orderexpires = 60 * 60 * 2
