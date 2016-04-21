if File.exists?(".bundle") then

require 'bundler/setup'
require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

task :default => :spec


desc "exec"
task :exec do
  sh "ruby ru.rb"
end

desc "bundle"
task :init do
  sh "bundle install"
end
else
desc "bundle"
task :init do
  sh "bundle install --path vendor/bundle --binstubs=vendor/bin"
end
end

