import nengi from 'nengi'

const config = {
    UPDATE_RATE: 20, 

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 

    USE_HISTORIAN: true,
    HISTORIAN_TICKS: 40,

    protocols: {
        entities: [],
        localMessages: [],
        messages: [],
        commands: [],
        basics: []
    }
}

export default config
