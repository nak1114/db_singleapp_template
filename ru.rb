#!ruby
require 'bundler/setup'
require 'rack/builder'
require 'rack/handler/webrick'

def start_rackup(opt={})
  app = Rack::Builder.new {
    eval(open('config.ru', &:read))
  }
  opt ={
    :Port =>9292,
    :StartCallback => Proc.new{ Thread.main.wakeup },
  }
  trap("INT"){ Rack::Handler::WEBrick.shutdown }
  server_thread = Thread.new do
    while(Thread.main.stop? != true)do Thread.pass; end
    Rack::Handler::WEBrick.run app,opt
  end
  Thread.stop
  `#{ENV['BROWSER']} http://localhost:9292/index.html`
  server_thread.join
end
start_rackup()
