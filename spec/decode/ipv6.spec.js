var IPv6 = require("../../decode/ipv6");
var NoNext = require("../../decode/ipv6headers/no_next");
require("should");

describe("IPv6", function(){
  var example, instance;
  beforeEach(function () {
    example = new Buffer("61298765" + // version=6, trafficClass=0x12, labelflow=0, 
                          "0000" + // payloadLength =0
                          "3b" + // No next header
                          "00" + // hopLimit=0
                          "fe80000000000000708dfe834114a512" + // src address
                          "2001000041379e508000f12ab9c82815", // dest address
                          "hex");
    instance = new IPv6();
  });

  describe("#decode", function(){
    it("is a function", function(){
        instance.decode.should.be.type("function");
    });

    it("sets #version to 6", function() { //After all this is ip "v6"
      instance.decode(example, 0);
      instance.should.have.property("version", 6);
    });

    it("sets #trafficClass to the trafficClass decoded from packet", function(){
      instance.decode(example, 0);
      instance.should.have.property("trafficClass", 0x12);
    });

    it("sets #flowLabel to the flow label decoded from packet", function(){
      instance.decode(example, 0);
      instance.should.have.property("flowLabel", 0x98765);
    });

    it("sets #flowLabel to the flow label decoded from packet", function(){
      instance.decode(example, 0);
      instance.should.have.property("payloadLength", 0);
    });

    it("sets #nextHeader to the next header the protocol id of the payload", function(){
      instance.decode(example, 0);
      instance.should.have.property("nextHeader", 59);
    });

    it("sets #hopLimit to the hop limit from the packet", function(){
      instance.decode(example, 0);
      instance.should.have.property("hopLimit", 0);
    });

    it("sets #saddr to the senders address", function(){
      instance.decode(example, 0);
      instance.saddr.should.have.property("addr", [0xfe, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x8d, 0xfe, 0x83, 0x41, 0x14, 0xa5, 0x12]);
    });

    it("sets #daddr to the destination address", function(){
      instance.decode(example, 0);
      instance.daddr.should.have.property("addr", [0x20, 0x01, 0x00, 0x00, 0x41, 0x37, 0x9e, 0x50, 0x80, 0x00, 0xf1, 0x2a, 0xb9, 0xc8, 0x28, 0x15]);
    });

    it("sets #payload to the next header", function(){
      instance.decode(example, 0);
      instance.payload.should.be.instanceOf(NoNext);
    });
  });

  describe("#toString()", function(){
    var instance;
    beforeEach(function(){
      instance = new IPv6();
    });

    it("is a function", function(){
      instance.toString.should.be.type("function");
    });

    it("returns a value like \"fe80:0000:0000:0000:708d:fe83:4114:a512 -> 2001:0000:4137:9e50:8000:f12a:b9c8:2815 proto 255 undefined\" when the protocol is not support by node_pcap", function(){
      var unsupported = new Buffer("60000000" + // version=6, trafficClass=0x12, labelflow=0, 
                          "0000" + // payloadLength =0
                          "ff" + // a next header type which is not supported
                          "00" + // hopLimit=0
                          "fe80000000000000708dfe834114a512" + // src address
                          "2001000041379e508000f12ab9c82815" + // dest address
                          "1600fa04effffffa",
                          "hex");

      instance.decode(unsupported, 0);
      instance.toString().should.be.exactly("fe80:0000:0000:0000:708d:fe83:4114:a512 -> 2001:0000:4137:9e50:8000:f12a:b9c8:2815 proto 255 undefined");
    });

    it("returns a value like \"fe80:0000:0000:0000:708d:fe83:4114:a512 -> 2001:0000:4137:9e50:8000:f12a:b9c8:2815 IGMP Membership Report\" when the protocol is support by node_pcap", function(){
      var igmp = new Buffer("60000000" + // version=6, trafficClass=0x12, labelflow=0, 
                          "0000" + // payloadLength =0
                          "02" + // IGMP next
                          "00" + // hopLimit=0
                          "fe80000000000000708dfe834114a512" + // src address
                          "2001000041379e508000f12ab9c82815" + // dest address
                          "1600fa04effffffa",
                          "hex");

      instance.decode(igmp, 0);
      instance.toString().should.be.exactly("fe80:0000:0000:0000:708d:fe83:4114:a512 -> 2001:0000:4137:9e50:8000:f12a:b9c8:2815 IGMP Membership Report");
    });
  });
});