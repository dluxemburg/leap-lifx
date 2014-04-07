require 'lifx'
require 'forwardable'

module LeapLifx
  class Lifx
    extend Forwardable

    attr_accessor :client
    def_delegators :@client, :light, :lights

    def initialize(:client)
      @client = client
    end

  end
end