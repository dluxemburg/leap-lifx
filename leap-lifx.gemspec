# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'leap-lifx/version'

Gem::Specification.new do |spec|
  spec.name          = "leap-lifx"
  spec.version       = Leap::Lifx::VERSION
  spec.authors       = ["Daniel Luxemburg"]
  spec.email         = ["daniel.luxemburg@gmail.com"]
  spec.summary       = %q{Wave hand at lamp, lamp turn colors}
  spec.description   = %q{Wave hand at lamp, lamp turn colors}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "pry"
  spec.add_development_dependency "guard-rspec"

  spec.add_dependency "thor"
  spec.add_dependency "lifx"
  spec.add_dependency "leapmotion"

end
