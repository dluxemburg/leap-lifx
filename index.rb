require 'webrick'
require 'json'
require 'lifx'

lifx = LIFX::Client.lan
lifx.discover
server = WEBrick::HTTPServer.new(:Port => 8000)

server.mount_proc '/' do |req, res|
  body = JSON.parse(req.body)
  brightness = (body['brightness'] || 0)
  color = LIFX::Color.hsl(*body['hsl'])
  white = LIFX::Color.white(brightness:brightness)
  lifx.lights.set_color(color,duration: 0.125)
  res.body = JSON.generate(body)
end

server.start