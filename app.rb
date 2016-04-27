#!ruby
require 'bundler/setup'
require 'time'
require 'erb'
require 'active_record'
require 'mysql2'
require 'sinatra'
require 'sinatra/reloader'

# Import files for database
ActiveRecord::Base.configurations = YAML.load(ERB.new(open('config/database.yml', &:read)).result)
ActiveRecord::Base.establish_connection(settings.environment)

class Issue <ActiveRecord::Base
self.table_name = 'item'
end

get '/' do
  'hellow'
end

post '/api/graph' do
  request.body.rewind  # 既に読まれているときのため
  data = JSON.parse request.body.read
  data.each do |v|
    p v
    open(v["name"],'wt') do |f|
      f.write v["content"]
    end
  end
  {ret:'OK!'}.to_json
end

post '/api/main' do
	p settings.environment
	@item= Issue.select("name, price, created_at")
	.where({:created_at => Time.parse(params[:first])..Time.parse(params[:last])})

	@title='result'
	@title='result develop' if settings.development?
	@title='result production' if settings.production?
	s=erb :result
  #Thread.new { sleep 1; Process.kill 'INT', Process.pid }
  s
end

get '/terminate' do
  body "Abort!"
  #logger.info "Received terminate request!"
  Thread.new { sleep 1; Process.kill 'INT', Process.pid }
  halt 200
end
