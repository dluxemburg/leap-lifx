require 'json'
require 'lifx'

lifx = LIFX::Client.lan


lifx.discover

while lifx.lights.count < 1
  sleep(0.1)
end

$stdout.write(JSON.generate({
  event: 'started',
  data: {
    count: lifx.lights.count
  }
}))
$stdout.flush


while raw = $stdin.gets
  body = JSON.parse(raw)
  color = LIFX::Color.hsl(*body['hsl'])
  lifx.lights.set_color(color,duration: 0.125)
  $stdout.write(JSON.generate(event: 'response', data: body))
  $stdout.flush
end