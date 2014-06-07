require 'json'
require 'lifx'

lifx = LIFX::Client.lan
lifx.discover

min_lights = ARGV[0].to_i
label = ARGV[1]

if label
  lifx.discover do |c|
    c.lights.with_label(label)
  end
else
  lifx.discover
end

while lifx.lights.count < min_lights
  sleep(0.1)
end

def set_lights(lifx, data)
  if data['label']
    lights = lifx.lights.with_label(data['label'])
  else
    lights = lifx.lights
  end
  puts "#{data['label']}: #{data['color'].join('|')}"
  color = LIFX::Color.send(*data['color'])
  duration = data.fetch('duration', 0.125)
  lights.set_color(color, duration: duration)
  {lights: lights, color: color, duration: duration}
end

$stdout.write(JSON.generate({
  event: 'ready',
  data: {
    lights: lifx.lights.collect { |l| l.label }
  }
}))
$stdout.flush

while raw = $stdin.gets
  body = JSON.parse(raw)
  set_lights(lifx, body)
  sleep(body.fetch('duration', 0.125))
  $stdout.write(JSON.generate(event: 'response', data: body))
  $stdout.flush
end