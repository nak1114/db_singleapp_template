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
class DBApp < Sinatra::Base
  #enable :inline_templates
  set :method_override, true
  # set :session_secret, Proc.new { super() unless development? }
  # set :app_file, nil

  configure :development do
    register Sinatra::Reloader
    set :show_exceptions, true
  end
  configure :test do
    set :logging, true
    set :run, true
  end
  get '/' do
    'hellow'
  end

  post '/api/graph' do
    request.body.rewind
    data = JSON.parse request.body.read
    Dir.mkdir 'tmp' unless File.exist? 'tmp'
    data.each do |v|
      fname='.\\tmp\\' + v["name"]
      open(fname,'wt') do |f|
        f.write v["content"]
      end
      `#{ENV['CONVERTER']} #{fname} -M #{fname}.emf`
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
    p tet
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
end
