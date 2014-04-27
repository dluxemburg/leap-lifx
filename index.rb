require 'json'
require 'lifx'

lifx = LIFX::Client.lan

lifx.discover! do |lights|
  $stdout.write(JSON.generate({event: 'started', data: {}}))
  $stdout.flush
end

while raw = $stdin.gets
  body = JSON.parse(raw)
  color = LIFX::Color.hsl(*body['hsl'])
  lifx.lights.set_color(color,duration: 0.125)
  $stdout.write(JSON.generate(event: 'response', data: body))
  $stdout.flush
end