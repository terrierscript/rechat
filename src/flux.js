import { Flummox, Store, Actions } from "flummox"

class MessageActions extends Actions {
  newMessage(content) { return content }
}

class MessageStore extends Store {
  constructor(flux) {
    super()
    const messageActions = flux.getActions("messages")
    this.register(messageActions.newMessage, this.handleNewMessage);
    this.messageCounter = 0;

    this.state = {
      messages: []
    };
  }
  handleNewMessage(content) {
    const id = this.messageCounter++
    var msgs = this.state.messages
    msgs.push(content)
    this.setState({
      messages: msgs
      // [id]: {
      //   content,
      //   id
      // }
    })

  }
}

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions("messages", MessageActions)
    this.createStore("messages", MessageStore, this)
  }
}

export default new Flux();
