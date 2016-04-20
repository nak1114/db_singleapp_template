#!ruby
require 'bundler/setup'
require 'rack/builder'
require 'rack/handler/webrick'

def start_rackup(opt={})
	app = Rack::Builder.new {
		eval(open('config.ru', &:read))
	}
	`"C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe" http://localhost:9292/index.html`
	trap("INT"){ Rack::Handler::WEBrick.shutdown }
	Rack::Handler::WEBrick.run app,:Port =>9292
end
start_rackup()

__END__
